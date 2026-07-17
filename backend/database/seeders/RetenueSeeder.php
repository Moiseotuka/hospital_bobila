<?php

namespace Database\Seeders;

use App\Models\Retenue;
use Illuminate\Database\Seeder;

class RetenueSeeder extends Seeder
{
    public function run(): void
    {
        $retenues = [
            [
                'code' => 'RET-01', 'nom' => 'Impôt sur le Revenu', 'type' => 'impot',
                'montant' => null, 'pourcentage' => 15.00, 'est_pourcentage' => true,
                'description' => 'Impôt sur le revenu professionnel (IPR) - 15%',
            ],
            [
                'code' => 'RET-02', 'nom' => 'CNSS (Part Salariale)', 'type' => 'cnss',
                'montant' => null, 'pourcentage' => 5.00, 'est_pourcentage' => true,
                'description' => 'Cotisation salariale à la CNSS - 5%',
            ],
            [
                'code' => 'RET-03', 'nom' => 'Avance sur Salaire', 'type' => 'avance',
                'montant' => 0, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Montant défini lors de l\'application de l\'avance',
            ],
            [
                'code' => 'RET-04', 'nom' => 'Prêt', 'type' => 'pret',
                'montant' => 0, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Montant défini lors de l\'octroi du prêt',
            ],
            [
                'code' => 'RET-05', 'nom' => 'Retenue Disciplinaire', 'type' => 'discipline',
                'montant' => 0, 'pourcentage' => null, 'est_pourcentage' => false,
                'description' => 'Retenue disciplinaire appliquée selon la gravité de la faute',
            ],
            [
                'code' => 'RET-06', 'nom' => 'Assurance', 'type' => 'assurance',
                'montant' => null, 'pourcentage' => 2.00, 'est_pourcentage' => true,
                'description' => 'Cotisation d\'assurance médicale - 2%',
            ],
        ];

        foreach ($retenues as $retenue) {
            Retenue::create($retenue);
        }
    }
}
