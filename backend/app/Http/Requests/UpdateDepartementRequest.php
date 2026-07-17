<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('departement') ?? $this->route('id');

        return [
            'code' => ['sometimes', 'string', 'max:20', Rule::unique('departements', 'code')->ignore($id)],
            'nom' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
            'chef_departement_id' => 'nullable|integer|exists:agents,id',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
