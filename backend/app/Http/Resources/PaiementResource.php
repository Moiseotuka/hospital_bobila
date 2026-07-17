<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaiementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'bulletin_paie_id' => $this->bulletin_paie_id,
            'bulletinPaie' => new BulletinPaieResource($this->whenLoaded('bulletinPaie')),
            'agent_id' => $this->agent_id,
            'agent' => new AgentResource($this->whenLoaded('agent')),
            'periode_paie_id' => $this->periode_paie_id,
            'periodePaie' => new PeriodePaieResource($this->whenLoaded('periodePaie')),
            'montant' => (float) $this->montant,
            'date_paiement' => $this->date_paiement?->format('Y-m-d'),
            'mode_paiement' => $this->mode_paiement,
            'reference' => $this->reference,
            'banque' => $this->banque,
            'statut' => $this->statut,
            'motif_annulation' => $this->motif_annulation,
            'traite_par' => $this->traite_par,
            'traitePar' => new UserResource($this->whenLoaded('traitePar')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
