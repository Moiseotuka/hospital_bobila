<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        $grades = [
            ['code' => 'GR-01', 'nom' => "Général d'Armée", 'salaire_base' => 4500000, 'prime' => 500000, 'description' => 'Grade le plus élevé de la hiérarchie militaire'],
            ['code' => 'GR-02', 'nom' => 'Général de Corps d\'Armée', 'salaire_base' => 4000000, 'prime' => 450000, 'description' => 'Officier général de corps d\'armée'],
            ['code' => 'GR-03', 'nom' => 'Général de Division', 'salaire_base' => 3500000, 'prime' => 400000, 'description' => 'Officier général de division'],
            ['code' => 'GR-04', 'nom' => 'Général de Brigade', 'salaire_base' => 3000000, 'prime' => 350000, 'description' => 'Officier général de brigade'],
            ['code' => 'GR-05', 'nom' => 'Colonel', 'salaire_base' => 2500000, 'prime' => 300000, 'description' => 'Officier supérieur commandant un régiment'],
            ['code' => 'GR-06', 'nom' => 'Lieutenant-Colonel', 'salaire_base' => 2000000, 'prime' => 250000, 'description' => 'Officier supérieur adjoint au colonel'],
            ['code' => 'GR-07', 'nom' => 'Major', 'salaire_base' => 1700000, 'prime' => 200000, 'description' => 'Officier supérieur de grade intermédiaire'],
            ['code' => 'GR-08', 'nom' => 'Capitaine', 'salaire_base' => 1400000, 'prime' => 175000, 'description' => 'Officier subalterne commandant une compagnie'],
            ['code' => 'GR-09', 'nom' => 'Lieutenant', 'salaire_base' => 1100000, 'prime' => 150000, 'description' => 'Officier subalterne adjoint au capitaine'],
            ['code' => 'GR-10', 'nom' => 'Sous-Lieutenant', 'salaire_base' => 900000, 'prime' => 125000, 'description' => 'Premier grade des officiers subalternes'],
            ['code' => 'GR-11', 'nom' => 'Adjudant-Chef', 'salaire_base' => 750000, 'prime' => 100000, 'description' => 'Sous-officier supérieur chef'],
            ['code' => 'GR-12', 'nom' => 'Adjudant', 'salaire_base' => 600000, 'prime' => 80000, 'description' => 'Sous-officier supérieur'],
            ['code' => 'GR-13', 'nom' => 'Sergent-Chef', 'salaire_base' => 500000, 'prime' => 60000, 'description' => 'Sous-officier chef d\'équipe'],
            ['code' => 'GR-14', 'nom' => 'Sergent', 'salaire_base' => 400000, 'prime' => 50000, 'description' => 'Sous-officier subalterne'],
            ['code' => 'GR-15', 'nom' => 'Caporal', 'salaire_base' => 300000, 'prime' => 40000, 'description' => 'Premier grade des sous-officiers'],
        ];

        foreach ($grades as $grade) {
            Grade::create($grade);
        }
    }
}
