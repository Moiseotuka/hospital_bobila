<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'matricule' => $this->matricule,
            'nom' => $this->nom,
            'postnom' => $this->postnom,
            'prenom' => $this->prenom,
            'nom_complet' => $this->nom_complet,
            'sexe' => $this->sexe,
            'date_naissance' => $this->date_naissance?->format('Y-m-d'),
            'age' => $this->age,
            'telephone' => $this->telephone,
            'adresse' => $this->adresse,
            'photo_url' => $this->photo ? asset('storage/' . $this->photo) : null,
            'etat_civil' => $this->etat_civil,
            'nombre_enfants' => $this->nombre_enfants,
            'date_engagement' => $this->date_engagement?->format('Y-m-d'),
            'statut' => $this->statut,
            'grade' => new GradeResource($this->whenLoaded('grade')),
            'fonction' => new FonctionResource($this->whenLoaded('fonction')),
            'departement' => new DepartementResource($this->whenLoaded('departement')),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'categorie_salariale' => new CategorieSalarialeResource($this->whenLoaded('categorieSalariale')),
            'compte_bancaire' => $this->compte_bancaire,
            'banque' => $this->banque,
            'numero_cnss' => $this->numero_cnss,
            'email' => $this->email,
            'situation' => $this->situation,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
