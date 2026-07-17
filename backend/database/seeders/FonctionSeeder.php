<?php

namespace Database\Seeders;

use App\Models\Fonction;
use Illuminate\Database\Seeder;

class FonctionSeeder extends Seeder
{
    public function run(): void
    {
        $fonctions = [
            ['code' => 'F-01', 'nom' => 'Médecin Chef', 'prime_fonction' => 500000, 'description' => 'Responsable médical en chef de l\'hôpital'],
            ['code' => 'F-02', 'nom' => 'Chef de Département', 'prime_fonction' => 350000, 'description' => 'Responsable d\'un département hospitalier'],
            ['code' => 'F-03', 'nom' => 'Chef de Service', 'prime_fonction' => 250000, 'description' => 'Responsable d\'un service médical ou administratif'],
            ['code' => 'F-04', 'nom' => 'Infirmier Major', 'prime_fonction' => 200000, 'description' => 'Infirmier en chef supervisant le personnel soignant'],
            ['code' => 'F-05', 'nom' => 'Comptable Principal', 'prime_fonction' => 150000, 'description' => 'Responsable de la comptabilité hospitalière'],
            ['code' => 'F-06', 'nom' => 'Assistant RH', 'prime_fonction' => 100000, 'description' => 'Assistant aux ressources humaines'],
            ['code' => 'F-07', 'nom' => 'Secrétaire Administratif', 'prime_fonction' => 75000, 'description' => 'Secrétaire chargé des tâches administratives'],
            ['code' => 'F-08', 'nom' => 'Technicien de Laboratoire', 'prime_fonction' => 100000, 'description' => 'Technicien spécialisé en analyses médicales'],
            ['code' => 'F-09', 'nom' => 'Pharmacien', 'prime_fonction' => 150000, 'description' => 'Pharmacien responsable de la pharmacie'],
            ['code' => 'F-10', 'nom' => 'Agent de Sécurité', 'prime_fonction' => 50000, 'description' => 'Agent chargé de la sécurité des installations'],
        ];

        foreach ($fonctions as $fonction) {
            Fonction::create($fonction);
        }
    }
}
