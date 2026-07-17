<?php

namespace Database\Factories;

use App\Models\CategorieSalariale;
use App\Models\Departement;
use App\Models\Fonction;
use App\Models\Grade;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class AgentFactory extends Factory
{
    public function definition(): array
    {
        $noms = [
            'Mbala', 'Kabasele', 'Tshibangu', 'Lubumbashi', 'Kinshasa',
            'Ilunga', 'Katanga', 'Kasongo', 'Mwamba', 'Nkongolo',
            'Kazadi', 'Mpiana', 'Tshilombo', 'Mbuyi', 'Kalonji',
            'Mutombo', 'Makabu', 'Ntumba', 'Kanku', 'Kabongo',
            'Muteba', 'Lunda', 'Tshimanga', 'Banza', 'Kibwe',
            'Nsenga', 'Mpoyi', 'Kabeya', 'Ngoy', 'Kakudji',
        ];

        $postnoms = [
            'Mukendi', 'Ngoie', 'Mutombo', 'Kazadi', 'Kalonji',
            'Tshibanda', 'Mpoyi', 'Luboya', 'Mwanza', 'Kabeya',
            'Ngoy', 'Kakudji', 'Mbuyi', 'Mpungu', 'Banza',
            'Nsenga', 'Mwamba', 'Kanku', 'Lunda', 'Tshilombo',
        ];

        $prenoms = [
            'Jean-Pierre', 'Marie-Claire', 'Joseph', 'Françoise', 'André',
            'Albertine', 'Paul', 'Catherine', 'Pierre', 'Elisabeth',
            'Jacques', 'Marguerite', 'Georges', 'Thérèse', 'Henri',
            'Philomène', 'Antoine', 'Christine', 'Michel', 'Louise',
            'Jean', 'Marie', 'Charles', 'Jeanne', 'Philippe',
            'Benoît', 'Anne', 'Marc', 'Cécile', 'Simon',
        ];

        $banques = ['Rawbank', 'BIC', 'EquityBCDC', 'Access Bank', 'Afriland', 'FBNBank'];
        $etatsCivils = ['Marie', 'Celibataire', 'Divorce', 'Veuf'];
        $situations = ['actif', 'actif', 'actif', 'actif', 'suspendu', 'retraite'];
        $statuts = ['militaire', 'militaire', 'militaire', 'militaire', 'militaire', 'militaire', 'militaire', 'civil', 'civil', 'civil'];

        return [
            'matricule' => 'AG-' . str_pad($this->faker->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'nom' => $this->faker->randomElement($noms),
            'postnom' => $this->faker->randomElement($postnoms),
            'prenom' => $this->faker->randomElement($prenoms),
            'sexe' => $this->faker->randomElement(['M', 'F']),
            'date_naissance' => $this->faker->dateTimeBetween('1960-01-01', '2000-12-31'),
            'telephone' => '+243' . $this->faker->numerify('8########'),
            'adresse' => $this->faker->randomElement([
                'Avenue de la Libération, Kinshasa',
                'Boulevard Lumumba, Kinshasa',
                'Avenue du Commerce, Gombe, Kinshasa',
                'Quartier Matonge, Kinshasa',
                'Cité de l\'OUA, Kinshasa',
                'Camp Kokolo, Kinshasa',
                'Avenue des Armées, Kinshasa',
                'Commune de Ngaliema, Kinshasa',
                'Quartier Bandalungwa, Kinshasa',
                'Avenue de l\'Université, Kinshasa',
            ]),
            'photo' => null,
            'etat_civil' => $this->faker->randomElement($etatsCivils),
            'nombre_enfants' => $this->faker->numberBetween(0, 8),
            'date_engagement' => $this->faker->dateTimeBetween('2000-01-01', '2025-12-31'),
            'statut' => $this->faker->randomElement($statuts),
            'grade_id' => Grade::inRandomOrder()->first()?->id ?? Grade::factory(),
            'fonction_id' => Fonction::inRandomOrder()->first()?->id ?? Fonction::factory(),
            'departement_id' => Departement::inRandomOrder()->first()?->id ?? Departement::factory(),
            'service_id' => Service::inRandomOrder()->first()?->id ?? Service::factory(),
            'categorie_salariale_id' => CategorieSalariale::inRandomOrder()->first()?->id ?? CategorieSalariale::factory(),
            'compte_bancaire' => $this->faker->bankAccountNumber(),
            'banque' => $this->faker->randomElement($banques),
            'numero_cnss' => 'CNSS-' . $this->faker->unique()->numerify('########'),
            'email' => $this->faker->unique()->safeEmail(),
            'situation' => $this->faker->randomElement($situations),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
