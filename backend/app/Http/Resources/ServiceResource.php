<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'nom' => $this->nom,
            'description' => $this->description,
            'departement_id' => $this->departement_id,
            'departement' => new DepartementResource($this->whenLoaded('departement')),
            'chef_service_id' => $this->chef_service_id,
            'is_active' => $this->is_active,
            'agents_count' => $this->whenCounted('agents'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
