<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'matricule' => 'required|string|max:50|unique:agents,matricule',
            'nom' => 'required|string|max:100',
            'postnom' => 'required|string|max:100',
            'prenom' => 'nullable|string|max:100',
            'sexe' => 'required|string|in:M,F',
            'date_naissance' => 'required|date|before:today',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'etat_civil' => 'nullable|string|in:Marie,Celibataire,Divorce,Veuf',
            'nombre_enfants' => 'nullable|integer|min:0',
            'date_engagement' => 'required|date',
            'statut' => 'required|string|in:militaire,civil',
            'grade_id' => 'nullable|integer|exists:grades,id',
            'fonction_id' => 'nullable|integer|exists:fonctions,id',
            'departement_id' => 'nullable|integer|exists:departements,id',
            'service_id' => 'nullable|integer|exists:services,id',
            'categorie_salariale_id' => 'nullable|integer|exists:categories_salariales,id',
            'compte_bancaire' => 'nullable|string|max:50',
            'banque' => 'nullable|string|max:100',
            'numero_cnss' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100|unique:agents,email',
            'situation' => 'required|string|in:actif,suspendu,retraite,decede',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'matricule.required' => 'Le matricule est obligatoire.',
            'matricule.unique' => 'Ce matricule existe déjà.',
            'nom.required' => 'Le nom est obligatoire.',
            'postnom.required' => 'Le postnom est obligatoire.',
            'sexe.in' => 'Le sexe doit être M ou F.',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui.',
        ];
    }
}
