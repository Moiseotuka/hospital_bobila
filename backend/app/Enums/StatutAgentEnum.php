<?php

namespace App\Enums;

enum StatutAgentEnum: string
{
    case ACTIF = 'actif';
    case SUSPENDU = 'suspendu';
    case RETRAITE = 'retraite';
    case DECEDE = 'decede';

    public function label(): string
    {
        return match ($this) {
            self::ACTIF => 'Actif',
            self::SUSPENDU => 'Suspendu',
            self::RETRAITE => 'Retraité',
            self::DECEDE => 'Décédé',
        };
    }

    public static function values(): array
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
