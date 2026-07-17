<?php

namespace Database\Seeders;

use App\Models\CategorieSalariale;
use Illuminate\Database\Seeder;

class CategorieSalarialeSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['code' => 'CAT-01', 'nom' => 'Catégorie A (Cadres Supérieurs)', 'salaire_base' => 2500000, 'indemnites' => 500000, 'description' => 'Cadres supérieurs et dirigeants de l\'hôpital'],
            ['code' => 'CAT-02', 'nom' => 'Catégorie B (Cadres Moyens)', 'salaire_base' => 1500000, 'indemnites' => 300000, 'description' => 'Cadres moyens et chefs de services'],
            ['code' => 'CAT-03', 'nom' => 'Catégorie C (Agents de Maîtrise)', 'salaire_base' => 800000, 'indemnites' => 150000, 'description' => 'Agents de maîtrise et techniciens supérieurs'],
            ['code' => 'CAT-04', 'nom' => 'Catégorie D (Personnel d\'Exécution)', 'salaire_base' => 500000, 'indemnites' => 100000, 'description' => 'Personnel d\'exécution et employés administratifs'],
            ['code' => 'CAT-05', 'nom' => 'Catégorie E (Personnel de Service)', 'salaire_base' => 300000, 'indemnites' => 50000, 'description' => 'Personnel de service et d\'entretien'],
        ];

        foreach ($categories as $categorie) {
            CategorieSalariale::create($categorie);
        }
    }
}
