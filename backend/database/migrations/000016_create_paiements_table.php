<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('bulletin_paie_id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('periode_paie_id');
            $table->decimal('montant', 15, 2);
            $table->date('date_paiement');
            $table->string('mode_paiement');
            $table->string('reference')->nullable()->unique();
            $table->string('banque')->nullable();
            $table->string('statut');
            $table->text('motif_annulation')->nullable();
            $table->unsignedBigInteger('traite_par');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('bulletin_paie_id')->references('id')->on('bulletins_paie')->onDelete('cascade');
            $table->foreign('agent_id')->references('id')->on('agents')->onDelete('cascade');
            $table->foreign('periode_paie_id')->references('id')->on('periode_paies')->onDelete('cascade');
            $table->foreign('traite_par')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
