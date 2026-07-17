<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('service') ?? $this->route('id');

        return [
            'code' => ['sometimes', 'string', 'max:20', Rule::unique('services', 'code')->ignore($id)],
            'nom' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
            'departement_id' => 'sometimes|integer|exists:departements,id',
            'chef_service_id' => 'nullable|integer|exists:agents,id',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
