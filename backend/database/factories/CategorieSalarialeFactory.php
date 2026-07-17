<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategorieSalarialeFactory extends Factory
{
    public function definition(): array
    {
        $categories = [
            'Catégorie A', 'Catégorie B', 'Catégorie C', 'Catégorie D', 'Catégorie E',
        ];

        return [
            'code' => 'CAT-' . $this->faker->unique()->numerify('##'),
            'nom' => $this->faker->unique()->randomElement($categories),
            'salaire_base' => $this->faker->randomFloat(2, 300000, 3000000),
            'indemnites' => $this->faker->randomFloat(2, 50000, 300000),
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
