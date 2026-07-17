<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategorieSalarialeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:20|unique:categories_salariales,code',
            'nom' => 'required|string|max:100',
            'salaire_base' => 'required|numeric|min:0',
            'indemnites' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
