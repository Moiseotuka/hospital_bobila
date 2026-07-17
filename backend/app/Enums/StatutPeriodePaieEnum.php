<?php

namespace App\Enums;

enum StatutPeriodePaieEnum: string
{
    case EN_ATTENTE = 'en_attente';
    case GENERE = 'generé';
    case VALIDE = 'valide';
    case VERROUILLE = 'verrouille';

    public function label(): string
    {
        return match ($this) {
            self::EN_ATTENTE => 'En attente',
            self::GENERE => 'Généré',
            self::VALIDE => 'Validé',
            self::VERROUILLE => 'Verrouillé',
        };
    }

    public function couleur(): string
    {
        return match ($this) {
            self::EN_ATTENTE => 'warning',
            self::GENERE => 'info',
            self::VALIDE => 'success',
            self::VERROUILLE => 'secondary',
        };
    }

    public static function valeurs(): array
    {
        return array_column(self::cases(), 'value');
    }
}
