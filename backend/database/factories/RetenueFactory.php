<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RetenueFactory extends Factory
{
    public function definition(): array
    {
        $types = [
            'impot', 'cnss', 'avance', 'pret', 'discipline', 'assurance', 'autre',
        ];

        $estPourcentage = $this->faker->boolean(25);

        return [
            'code' => 'RET-' . $this->faker->unique()->numerify('##'),
            'nom' => $this->faker->unique()->words(3, true),
            'type' => $this->faker->randomElement($types),
            'montant' => $estPourcentage ? null : $this->faker->randomFloat(2, 10000, 500000),
            'pourcentage' => $estPourcentage ? $this->faker->randomFloat(2, 1, 20) : null,
            'est_pourcentage' => $estPourcentage,
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
