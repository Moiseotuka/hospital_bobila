<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFonctionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('fonction') ?? $this->route('id');

        return [
            'code' => ['sometimes', 'string', 'max:20', Rule::unique('fonctions', 'code')->ignore($id)],
            'nom' => 'sometimes|string|max:100',
            'prime_fonction' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
