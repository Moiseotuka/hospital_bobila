<?php

namespace Database\Factories;

use App\Models\Departement;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $services = [
            'Soins Intensifs', 'Consultation Externe', 'Hospitalisation',
            'Imagerie Médicale', 'Analyses', 'Pharmacie Centrale',
            'Buanderie', 'Cuisine', 'Transports', 'Sécurité',
        ];

        return [
            'code' => 'SERV-' . $this->faker->unique()->regexify('[A-Z]{4}'),
            'nom' => $this->faker->unique()->randomElement($services),
            'description' => $this->faker->sentence(),
            'departement_id' => Departement::factory(),
            'chef_service_id' => null,
            'is_active' => true,
        ];
    }
}
