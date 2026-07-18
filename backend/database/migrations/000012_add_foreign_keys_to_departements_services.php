<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departements', function (Blueprint $table) {
            $table->foreign('chef_departement_id')
                ->references('id')
                ->on('agents')
                ->onDelete('set null');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->foreign('chef_service_id')
                ->references('id')
                ->on('agents')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('departements', function (Blueprint $table) {
            $table->dropForeign(['chef_departement_id']);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropForeign(['chef_service_id']);
        });
    }
};
