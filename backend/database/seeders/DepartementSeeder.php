<?php

namespace Database\Seeders;

use App\Models\Departement;
use Illuminate\Database\Seeder;

class DepartementSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['code' => 'DEPT-MDGN', 'nom' => 'Médecine Générale', 'description' => 'Département de médecine générale pour les soins primaires et le diagnostic'],
            ['code' => 'DEPT-CHIR', 'nom' => 'Chirurgie', 'description' => 'Département de chirurgie pour les interventions chirurgicales'],
            ['code' => 'DEPT-PEDI', 'nom' => 'Pédiatrie', 'description' => 'Département de pédiatrie pour les soins aux enfants'],
            ['code' => 'DEPT-GYNE', 'nom' => 'Gynécologie', 'description' => 'Département de gynécologie et obstétrique'],
            ['code' => 'DEPT-CARD', 'nom' => 'Cardiologie', 'description' => 'Département de cardiologie pour les soins cardiaques'],
            ['code' => 'DEPT-RADI', 'nom' => 'Radiologie', 'description' => 'Département de radiologie et d\'imagerie médicale'],
            ['code' => 'DEPT-LABO', 'nom' => 'Laboratoire', 'description' => 'Département des analyses biologiques et médicales'],
            ['code' => 'DEPT-URGE', 'nom' => 'Urgences', 'description' => 'Département des urgences et soins critiques'],
            ['code' => 'DEPT-ADMN', 'nom' => 'Administration', 'description' => 'Département de l\'administration générale de l\'hôpital'],
            ['code' => 'DEPT-RHUM', 'nom' => 'Ressources Humaines', 'description' => 'Département de la gestion des ressources humaines'],
            ['code' => 'DEPT-CMPT', 'nom' => 'Comptabilité', 'description' => 'Département de la comptabilité et des finances'],
            ['code' => 'DEPT-LOGS', 'nom' => 'Logistique', 'description' => 'Département de la logistique et des approvisionnements'],
            ['code' => 'DEPT-PHMC', 'nom' => 'Pharmacie', 'description' => 'Département de la pharmacie et de la distribution des médicaments'],
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
