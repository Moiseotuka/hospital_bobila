<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFonctionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:20|unique:fonctions,code',
            'nom' => 'required|string|max:100',
            'prime_fonction' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
