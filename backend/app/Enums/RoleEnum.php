<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMINISTRATEUR = 'administrateur';
    case CHEF_RH = 'chef_rh';
    case COMPTABLE = 'comptable';
    case DIRECTION = 'direction';
    case AUDITEUR = 'auditeur';

    public function label(): string
    {
        return match ($this) {
            self::ADMINISTRATEUR => 'Administrateur',
            self::CHEF_RH => 'Chef RH',
            self::COMPTABLE => 'Comptable',
            self::DIRECTION => 'Direction',
            self::AUDITEUR => 'Auditeur',
        };
    }

    public static function valeurs(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return array_combine(
            self::values(),
            array_map(fn($case) => $case->label(), self::cases())
        );
    }
}
