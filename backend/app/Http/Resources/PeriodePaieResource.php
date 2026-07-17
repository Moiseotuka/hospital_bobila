<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeriodePaieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mois' => $this->mois,
            'annee' => $this->annee,
            'date_debut' => $this->date_debut?->format('Y-m-d'),
            'date_fin' => $this->date_fin?->format('Y-m-d'),
            'statut' => $this->statut,
            'total_brut' => (float) $this->total_brut,
            'total_primes' => (float) $this->total_primes,
            'total_retenues' => (float) $this->total_retenues,
            'total_net' => (float) $this->total_net,
            'nombre_agents' => $this->nombre_agents,
            'created_by' => $this->created_by,
            'createdBy' => new UserResource($this->whenLoaded('createdBy')),
            'valide_by' => $this->valide_by,
            'valideBy' => new UserResource($this->whenLoaded('valideBy')),
            'verrouille_by' => $this->verrouille_by,
            'verrouilleBy' => new UserResource($this->whenLoaded('verrouilleBy')),
            'bulletins_count' => $this->whenCounted('bulletinsPaie'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
