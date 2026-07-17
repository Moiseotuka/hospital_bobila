<?php

namespace Database\Seeders;

use App\Models\Prime;
use Illuminate\Database\Seeder;

class PrimeSeeder extends Seeder
{
    public function run(): void
    {
        $primes = [
            [
                'code' => 'PRM-01', 'nom' => 'Prime de Risque', 'type' => 'risque',
                'montant' => 150000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Prime compensant les risques liés à l\'exercice de la fonction',
            ],
            [
                'code' => 'PRM-02', 'nom' => 'Prime Médicale', 'type' => 'medicale',
                'montant' => 100000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Prime accordée au personnel médical pour services rendus',
            ],
            [
                'code' => 'PRM-03', 'nom' => "Prime d'Ancienneté", 'type' => 'anciennete',
                'montant' => 0, 'pourcentage' => 2.00, 'est_pourcentage' => true,
                'description' => "Prime basée sur l'ancienneté du personnel (2% par année d'ancienneté)",
            ],
            [
                'code' => 'PRM-04', 'nom' => 'Prime de Logement', 'type' => 'logement',
                'montant' => 200000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Allocation de logement pour le personnel',
            ],
            [
                'code' => 'PRM-05', 'nom' => 'Prime de Transport', 'type' => 'transport',
                'montant' => 100000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Prime de transport pour les déplacements professionnels',
            ],
            [
                'code' => 'PRM-06', 'nom' => 'Prime Exceptionnelle', 'type' => 'exceptionnelle',
                'montant' => 250000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Prime exceptionnelle pour services extraordinaires',
            ],
            [
                'code' => 'PRM-07', 'nom' => 'Prime de Commandement', 'type' => 'commandement',
                'montant' => 200000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Prime de commandement pour les chefs de département',
            ],
            [
                'code' => 'PRM-08', 'nom' => 'Prime de Responsabilité', 'type' => 'responsabilite',
                'montant' => 150000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Prime de responsabilité pour les postes à responsabilité',
            ],
            [
                'code' => 'PRM-09', 'nom' => 'Prime de Rendement', 'type' => 'rendement',
                'montant' => 0, 'pourcentage' => 10.00, 'est_pourcentage' => true,
                'description' => 'Prime basée sur le rendement individuel (10% du salaire de base)',
            ],
            [
                'code' => 'PRM-10', 'nom' => 'Prime de Nuit', 'type' => 'autre',
                'montant' => 75000, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Prime pour le travail de nuit et les gardes',
            ],
        ];

        foreach ($primes as $prime) {
            Prime::create($prime);
        }
    }
}
