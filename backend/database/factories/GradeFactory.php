<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GradeFactory extends Factory
{
    public function definition(): array
    {
        $grades = [
            'Général d\'Armée', 'Général de Corps d\'Armée', 'Général de Division',
            'Général de Brigade', 'Colonel', 'Lieutenant-Colonel', 'Major',
            'Capitaine', 'Lieutenant', 'Sous-Lieutenant', 'Adjudant-Chef',
            'Adjudant', 'Sergent-Chef', 'Sergent', 'Caporal',
        ];

        return [
            'code' => 'GR-' . $this->faker->unique()->numerify('##'),
            'nom' => $this->faker->unique()->randomElement($grades),
            'salaire_base' => $this->faker->randomFloat(2, 500000, 5000000),
            'prime' => $this->faker->randomFloat(2, 50000, 500000),
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
