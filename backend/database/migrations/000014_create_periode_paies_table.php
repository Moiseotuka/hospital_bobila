<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode_paies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('mois');
            $table->integer('annee');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('statut');
            $table->decimal('total_brut', 15, 2)->default(0);
            $table->decimal('total_primes', 15, 2)->default(0);
            $table->decimal('total_retenues', 15, 2)->default(0);
            $table->decimal('total_net', 15, 2)->default(0);
            $table->integer('nombre_agents')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('valide_by')->nullable();
            $table->unsignedBigInteger('verrouille_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['mois', 'annee']);

            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('valide_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('verrouille_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periode_paies');
    }
};
