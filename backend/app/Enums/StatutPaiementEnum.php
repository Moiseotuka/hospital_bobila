<?php

namespace App\Enums;

enum StatutPaiementEnum: string
{
    case PAYE = 'paye';
    case EN_ATTENTE = 'en_attente';
    case ANNULE = 'annule';

    public function label(): string
    {
        return match ($this) {
            self::PAYE => 'Payé',
            self::EN_ATTENTE => 'En attente',
            self::ANNULE => 'Annulé',
        };
    }

    public function couleur(): string
    {
        return match ($this) {
            self::PAYE => 'success',
            self::EN_ATTENTE => 'warning',
            self::ANNULE => 'danger',
        };
    }

    public static function valeurs(): array
    {
        return array_column(self::cases(), 'value');
    }
}
