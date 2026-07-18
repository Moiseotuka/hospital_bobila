<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'agents', 'grades', 'fonctions', 'departements', 'services',
            'categories', 'primes', 'retenues', 'paie', 'paiements',
            'bulletins', 'rapports', 'audit', 'parametres', 'users',
        ];

        $actions = ['view', 'create', 'edit', 'delete'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$module}.{$action}", 'guard_name' => 'web']);
            }
        }

        $roles = [
            'Administrateur' => $this->allPermissions($modules, $actions),
            'Chef RH' => array_merge(
                $this->fullCRUD(['agents', 'grades', 'fonctions', 'departements', 'services', 'categories']),
                $this->viewOnly(['primes', 'retenues', 'paie', 'paiements', 'bulletins', 'rapports']),
            ),
            'Comptable' => array_merge(
                $this->fullCRUD(['primes', 'retenues', 'paie', 'paiements', 'bulletins']),
                $this->viewOnly(['agents', 'rapports']),
            ),
            'Direction' => array_merge(
                $this->viewOnly(array_merge($modules, ['audit'])),
                ['rapports.view', 'rapports.create', 'rapports.edit'],
            ),
            'Auditeur' => $this->viewOnly(['agents', 'grades', 'fonctions', 'departements', 'services', 'categories', 'primes', 'retenues', 'paie', 'paiements', 'bulletins', 'rapports', 'audit']),
        ];

        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->givePermissionTo($permissions);
        }
    }

    private function allPermissions(array $modules, array $actions): array
    {
        $perms = [];
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $perms[] = "{$module}.{$action}";
            }
        }
        return $perms;
    }

    private function fullCRUD(array $modules): array
    {
        $perms = [];
        foreach ($modules as $module) {
            foreach (['view', 'create', 'edit', 'delete'] as $action) {
                $perms[] = "{$module}.{$action}";
            }
        }
        return $perms;
    }

    private function viewOnly(array $modules): array
    {
        $perms = [];
        foreach ($modules as $module) {
            $perms[] = "{$module}.view";
        }
        return $perms;
    }
}
