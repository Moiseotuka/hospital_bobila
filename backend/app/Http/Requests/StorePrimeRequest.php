<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrimeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:20|unique:primes,code',
            'nom' => 'required|string|max:100',
            'type' => 'required|string|max:50',
            'montant' => 'nullable|numeric|min:0|required_without:pourcentage',
            'pourcentage' => 'nullable|numeric|min:0|max:100|required_without:montant',
            'est_pourcentage' => 'sometimes|boolean',
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
