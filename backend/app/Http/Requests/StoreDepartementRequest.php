<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:20|unique:departements,code',
            'nom' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'chef_departement_id' => 'nullable|integer|exists:agents,id',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
