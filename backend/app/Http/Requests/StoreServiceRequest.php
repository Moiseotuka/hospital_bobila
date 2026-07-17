<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:20|unique:services,code',
            'nom' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'departement_id' => 'required|integer|exists:departements,id',
            'chef_service_id' => 'nullable|integer|exists:agents,id',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
