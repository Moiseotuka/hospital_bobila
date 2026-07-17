<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BulletinPaieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agent_id' => $this->agent_id,
            'agent' => new AgentResource($this->whenLoaded('agent')),
            'periode_paie_id' => $this->periode_paie_id,
            'periodePaie' => new PeriodePaieResource($this->whenLoaded('periodePaie')),
            'matricule' => $this->matricule,
            'nom_complet' => $this->nom_complet,
            'grade_nom' => $this->grade_nom,
            'fonction_nom' => $this->fonction_nom,
            'departement_nom' => $this->departement_nom,
            'service_nom' => $this->service_nom,
            'salaire_base' => (float) $this->salaire_base,
            'total_primes' => (float) $this->total_primes,
            'total_retenues' => (float) $this->total_retenues,
            'salaire_brut' => (float) $this->salaire_brut,
            'salaire_net' => (float) $this->salaire_net,
            'net_a_payer' => (float) $this->net_a_payer,
            'primes_detail' => $this->primes_detail,
            'retenues_detail' => $this->retenues_detail,
            'date_generation' => $this->date_generation?->format('Y-m-d H:i:s'),
            'est_valide' => $this->est_valide,
            'est_verrouille' => $this->est_verrouille,
            'qr_code' => $this->qr_code,
            'paiement' => new PaiementResource($this->whenLoaded('paiement')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
