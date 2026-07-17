<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('matricule')->unique();
            $table->string('nom');
            $table->string('postnom');
            $table->string('prenom')->nullable();
            $table->string('sexe');
            $table->date('date_naissance');
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->string('photo')->nullable();
            $table->string('etat_civil')->nullable();
            $table->integer('nombre_enfants')->default(0);
            $table->date('date_engagement');
            $table->string('statut');
            $table->unsignedBigInteger('grade_id')->nullable();
            $table->unsignedBigInteger('fonction_id')->nullable();
            $table->unsignedBigInteger('departement_id')->nullable();
            $table->unsignedBigInteger('service_id')->nullable();
            $table->unsignedBigInteger('categorie_salariale_id')->nullable();
            $table->string('compte_bancaire')->nullable();
            $table->string('banque')->nullable();
            $table->string('numero_cnss')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('situation')->default('actif');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('grade_id')->references('id')->on('grades')->onDelete('set null');
            $table->foreign('fonction_id')->references('id')->on('fonctions')->onDelete('set null');
            $table->foreign('departement_id')->references('id')->on('departements')->onDelete('set null');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
            $table->foreign('categorie_salariale_id')->references('id')->on('categories_salariales')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
