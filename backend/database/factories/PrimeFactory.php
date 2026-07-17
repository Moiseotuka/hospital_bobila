<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PrimeFactory extends Factory
{
    public function definition(): array
    {
        $types = [
            'risque', 'medicale', 'anciennete', 'logement', 'transport',
            'exceptionnelle', 'commandement', 'responsabilite', 'rendement', 'nuit', 'autre',
        ];

        $estPourcentage = $this->faker->boolean(20);

        return [
            'code' => 'PRM-' . $this->faker->unique()->numerify('##'),
            'nom' => $this->faker->unique()->words(3, true),
            'type' => $this->faker->randomElement($types),
            'montant' => $estPourcentage ? 0 : $this->faker->randomFloat(2, 50000, 500000),
            'pourcentage' => $estPourcentage ? $this->faker->randomFloat(2, 1, 20) : null,
            'est_pourcentage' => $estPourcentage,
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
