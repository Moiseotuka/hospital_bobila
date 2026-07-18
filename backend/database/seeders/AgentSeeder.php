<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\CategorieSalariale;
use App\Models\Departement;
use App\Models\Fonction;
use App\Models\Grade;
use Illuminate\Database\Seeder;

class AgentSeeder extends Seeder
{
    public function run(): void
    {
        Agent::create([
            'matricule' => 'AG-0001',
            'nom' => 'Mbala',
            'postnom' => 'Mukendi',
            'prenom' => 'Jean-Pierre',
            'sexe' => 'M',
            'date_naissance' => '1975-03-15',
            'telephone' => '+243812345678',
            'adresse' => 'Camp Kokolo, Kinshasa',
            'etat_civil' => 'Marie',
            'nombre_enfants' => 3,
            'date_engagement' => '2010-01-01',
            'statut' => 'militaire',
            'grade_id' => Grade::inRandomOrder()->first()?->id,
            'fonction_id' => Fonction::inRandomOrder()->first()?->id,
            'departement_id' => Departement::inRandomOrder()->first()?->id,
            'categorie_salariale_id' => CategorieSalariale::inRandomOrder()->first()?->id,
            'compte_bancaire' => 'CD1234567890',
            'banque' => 'Rawbank',
            'numero_cnss' => 'CNSS-00000001',
            'email' => 'jean-pierre.mbala@hmckokolo.cd',
            'situation' => 'actif',
            'is_active' => true,
        ]);
    }
}
