<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $agentId = $this->route('agent') ?? $this->route('id');

        return [
            'matricule' => ['sometimes', 'string', 'max:50', Rule::unique('agents', 'matricule')->ignore($agentId)],
            'nom' => 'sometimes|string|max:100',
            'postnom' => 'sometimes|string|max:100',
            'prenom' => 'nullable|string|max:100',
            'sexe' => 'sometimes|string|in:M,F',
            'date_naissance' => 'sometimes|date|before:today',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'etat_civil' => 'nullable|string|in:Marie,Celibataire,Divorce,Veuf',
            'nombre_enfants' => 'nullable|integer|min:0',
            'date_engagement' => 'sometimes|date',
            'statut' => 'sometimes|string|in:militaire,civil',
            'grade_id' => 'nullable|integer|exists:grades,id',
            'fonction_id' => 'nullable|integer|exists:fonctions,id',
            'departement_id' => 'nullable|integer|exists:departements,id',
            'service_id' => 'nullable|integer|exists:services,id',
            'categorie_salariale_id' => 'nullable|integer|exists:categories_salariales,id',
            'compte_bancaire' => 'nullable|string|max:50',
            'banque' => 'nullable|string|max:100',
            'numero_cnss' => 'nullable|string|max:30',
            'email' => ['nullable', 'email', 'max:100', Rule::unique('agents', 'email')->ignore($agentId)],
            'situation' => 'sometimes|string|in:actif,suspendu,retraite,decede',
            'is_active' => 'sometimes|boolean',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
