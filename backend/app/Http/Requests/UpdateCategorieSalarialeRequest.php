<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategorieSalarialeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('categorie_salariale') ?? $this->route('id');

        return [
            'code' => ['sometimes', 'string', 'max:20', Rule::unique('categories_salariales', 'code')->ignore($id)],
            'nom' => 'sometimes|string|max:100',
            'salaire_base' => 'sometimes|numeric|min:0',
            'indemnites' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
