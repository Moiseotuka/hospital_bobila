<?php

namespace Database\Seeders;

use App\Models\Departement;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $departements = Departement::pluck('id', 'code');

        $services = [
            ['code' => 'SERV-SOIN', 'nom' => 'Soins Intensifs', 'description' => 'Unité de soins intensifs pour les patients critiques', 'departement_code' => 'DEPT-MDGN'],
            ['code' => 'SERV-CNSE', 'nom' => 'Consultation Externe', 'description' => 'Service de consultation externe pour les patients ambulatoires', 'departement_code' => 'DEPT-MDGN'],
            ['code' => 'SERV-HOSP', 'nom' => 'Hospitalisation', 'description' => 'Service d\'hospitalisation pour les patients admis', 'departement_code' => 'DEPT-MDGN'],
            ['code' => 'SERV-BLCC', 'nom' => 'Bloc Opératoire Central', 'description' => 'Bloc opératoire pour les interventions chirurgicales', 'departement_code' => 'DEPT-CHIR'],
            ['code' => 'SERV-STER', 'nom' => 'Stérilisation', 'description' => 'Service de stérilisation du matériel médical', 'departement_code' => 'DEPT-CHIR'],
            ['code' => 'SERV-PEDI', 'nom' => 'Pédiatrie Générale', 'description' => 'Service de pédiatrie pour les soins aux enfants', 'departement_code' => 'DEPT-PEDI'],
            ['code' => 'SERV-NEON', 'nom' => 'Néonatologie', 'description' => 'Unité de soins aux nouveau-nés', 'departement_code' => 'DEPT-PEDI'],
            ['code' => 'SERV-MATR', 'nom' => 'Maternité', 'description' => 'Service de maternité et d\'accouchement', 'departement_code' => 'DEPT-GYNE'],
            ['code' => 'SERV-CARD', 'nom' => 'Cardiologie Médicale', 'description' => 'Service de cardiologie pour les soins cardiaques', 'departement_code' => 'DEPT-CARD'],
            ['code' => 'SERV-RAD1', 'nom' => 'Radiologie Standard', 'description' => 'Service de radiologie conventionnelle', 'departement_code' => 'DEPT-RADI'],
            ['code' => 'SERV-ECHO', 'nom' => 'Échographie', 'description' => 'Service d\'échographie médicale', 'departement_code' => 'DEPT-RADI'],
            ['code' => 'SERV-ANLB', 'nom' => 'Analyses Biologiques', 'description' => 'Service d\'analyses biologiques et de laboratoire', 'departement_code' => 'DEPT-LABO'],
            ['code' => 'SERV-MICR', 'nom' => 'Microbiologie', 'description' => 'Service de microbiologie et de parasitologie', 'departement_code' => 'DEPT-LABO'],
            ['code' => 'SERV-URGC', 'nom' => 'Urgences Centrales', 'description' => 'Service central des urgences médicales', 'departement_code' => 'DEPT-URGE'],
            ['code' => 'SERV-PERS', 'nom' => 'Personnel et Paie', 'description' => 'Service de gestion du personnel et de la paie', 'departement_code' => 'DEPT-RHUM'],
            ['code' => 'SERV-FINN', 'nom' => 'Finances', 'description' => 'Service de gestion financière et comptable', 'departement_code' => 'DEPT-CMPT'],
            ['code' => 'SERV-APPV', 'nom' => 'Approvisionnement', 'description' => 'Service des achats et approvisionnements', 'departement_code' => 'DEPT-LOGS'],
            ['code' => 'SERV-PHAR', 'nom' => 'Pharmacie Centrale', 'description' => 'Service de la pharmacie centrale et distribution', 'departement_code' => 'DEPT-PHMC'],
        ];

        foreach ($services as $service) {
            Service::create([
                'code' => $service['code'],
                'nom' => $service['nom'],
                'description' => $service['description'],
                'departement_id' => $departements[$service['departement_code']] ?? null,
                'chef_service_id' => null,
                'is_active' => true,
            ]);
        }
    }
}
