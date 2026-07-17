<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DepartementFactory extends Factory
{
    public function definition(): array
    {
        $departements = [
            'Médecine Générale', 'Chirurgie', 'Pédiatrie', 'Gynécologie',
            'Cardiologie', 'Radiologie', 'Laboratoire', 'Urgences',
            'Administration', 'Ressources Humaines', 'Comptabilité', 'Logistique', 'Pharmacie',
        ];

        return [
            'code' => 'DEPT-' . $this->faker->unique()->regexify('[A-Z]{4}'),
            'nom' => $this->faker->unique()->randomElement($departements),
            'description' => $this->faker->sentence(),
            'chef_departement_id' => null,
            'is_active' => true,
        ];
    }
}
