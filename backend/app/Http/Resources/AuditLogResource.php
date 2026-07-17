<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'action' => $this->action,
            'module' => $this->module,
            'description' => $this->description,
            'model_type' => $this->model_type,
            'model_id' => $this->model_id,
            'anciennes_valeurs' => $this->anciennes_valeurs,
            'nouvelles_valeurs' => $this->nouvelles_valeurs,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
