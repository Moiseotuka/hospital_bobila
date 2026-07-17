<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bulletins_paie', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('periode_paie_id');
            $table->string('matricule');
            $table->string('nom_complet');
            $table->string('grade_nom')->nullable();
            $table->string('fonction_nom')->nullable();
            $table->string('departement_nom')->nullable();
            $table->string('service_nom')->nullable();
            $table->decimal('salaire_base', 15, 2);
            $table->decimal('total_primes', 15, 2);
            $table->decimal('total_retenues', 15, 2);
            $table->decimal('salaire_brut', 15, 2);
            $table->decimal('salaire_net', 15, 2);
            $table->decimal('net_a_payer', 15, 2);
            $table->jsonb('primes_detail')->nullable();
            $table->jsonb('retenues_detail')->nullable();
            $table->dateTime('date_generation');
            $table->boolean('est_valide')->default(false);
            $table->boolean('est_verrouille')->default(false);
            $table->text('qr_code')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('agent_id')->references('id')->on('agents')->onDelete('cascade');
            $table->foreign('periode_paie_id')->references('id')->on('periode_paies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bulletins_paie');
    }
};
