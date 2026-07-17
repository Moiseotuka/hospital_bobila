<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            HospitalSettingSeeder::class,
            AdminUserSeeder::class,
            GradeSeeder::class,
            FonctionSeeder::class,
            DepartementSeeder::class,
            CategorieSalarialeSeeder::class,
            ServiceSeeder::class,
            PrimeSeeder::class,
            RetenueSeeder::class,
            AgentSeeder::class,
        ]);
    }
}
