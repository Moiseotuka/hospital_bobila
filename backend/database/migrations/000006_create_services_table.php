<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code')->unique();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('departement_id');
            $table->unsignedBigInteger('chef_service_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('departement_id')->references('id')->on('departements')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
