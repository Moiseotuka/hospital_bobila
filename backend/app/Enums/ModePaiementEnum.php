<?php

namespace App\Enums;

enum ModePaiementEnum: string
{
    case VIREMENT_BANCAIRE = 'virement_bancaire';
    case MOBILE_MONEY = 'mobile_money';
    case ESPECES = 'especes';
    case CHEQUE = 'cheque';

    public function label(): string
    {
        return match ($this) {
            self::VIREMENT_BANCAIRE => 'Virement bancaire',
            self::MOBILE_MONEY => 'Mobile Money',
            self::ESPECES => 'Espèces',
            self::CHEQUE => 'Chèque',
        };
    }

    public static function valeurs(): array
    {
        return array_column(self::cases(), 'value');
    }
}
