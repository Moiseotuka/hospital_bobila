<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrateur Système',
                'email' => 'admin@hmckokolo.cd',
                'password' => Hash::make('admin123'),
                'role' => RoleEnum::ADMINISTRATEUR->value,
                'is_active' => true,
                'spatie_role' => 'Administrateur',
            ],
            [
                'name' => 'Chef RH',
                'email' => 'rh@hmckokolo.cd',
                'password' => Hash::make('password'),
                'role' => RoleEnum::CHEF_RH->value,
                'is_active' => true,
                'spatie_role' => 'Chef RH',
            ],
            [
                'name' => 'Comptable',
                'email' => 'comptable@hmckokolo.cd',
                'password' => Hash::make('password'),
                'role' => RoleEnum::COMPTABLE->value,
                'is_active' => true,
                'spatie_role' => 'Comptable',
            ],
            [
                'name' => 'Directeur',
                'email' => 'direction@hmckokolo.cd',
                'password' => Hash::make('password'),
                'role' => RoleEnum::DIRECTION->value,
                'is_active' => true,
                'spatie_role' => 'Direction',
            ],
            [
                'name' => 'Auditeur',
                'email' => 'auditeur@hmckokolo.cd',
                'password' => Hash::make('password'),
                'role' => RoleEnum::AUDITEUR->value,
                'is_active' => true,
                'spatie_role' => 'Auditeur',
            ],
        ];

        foreach ($users as $userData) {
            $spatieRole = $userData['spatie_role'];
            unset($userData['spatie_role']);

            $user = User::create($userData);
            $user->assignRole($spatieRole);
        }
    }
}
