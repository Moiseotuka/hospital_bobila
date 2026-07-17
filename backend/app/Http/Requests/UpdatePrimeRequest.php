<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePrimeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('prime') ?? $this->route('id');

        return [
            'code' => ['sometimes', 'string', 'max:20', Rule::unique('primes', 'code')->ignore($id)],
            'nom' => 'sometimes|string|max:100',
            'type' => 'sometimes|string|max:50',
            'montant' => 'nullable|numeric|min:0',
            'pourcentage' => 'nullable|numeric|min:0|max:100',
            'est_pourcentage' => 'sometimes|boolean',
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
