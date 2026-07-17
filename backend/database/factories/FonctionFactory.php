<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FonctionFactory extends Factory
{
    public function definition(): array
    {
        $fonctions = [
            'Chef de Service', 'Chef de Département', 'Médecin Chef',
            'Infirmier Major', 'Comptable', 'Secrétaire', 'Chauffeur',
            'Agent de Sécurité', 'Technicien de Surface', 'Assistant RH',
        ];

        return [
            'code' => 'FCT-' . $this->faker->unique()->numerify('##'),
            'nom' => $this->faker->unique()->randomElement($fonctions),
            'prime_fonction' => $this->faker->randomFloat(2, 0, 300000),
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
