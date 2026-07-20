<?php

namespace Database\Seeders;

use App\Models\HospitalSetting;
use Illuminate\Database\Seeder;

class HospitalSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'nom', 'value' => 'Hôpital Militaire Central Camp Kokolo', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'adresse', 'value' => 'Camp Kokolo, Kinshasa, RDC', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'telephone', 'value' => '+243 81 000 00 00', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'email', 'value' => 'contact@hmckokolo.cd', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'devise', 'value' => 'FC', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'devise_symbole', 'value' => 'FC', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'taux_change', 'value' => '2500', 'type' => 'float', 'group' => 'hopital'],
            ['key' => 'jour_traitement', 'value' => '25', 'type' => 'integer', 'group' => 'paie'],
            ['key' => 'devise', 'value' => 'FC', 'type' => 'text', 'group' => 'paie'],
            ['key' => 'taux_change', 'value' => '2500', 'type' => 'float', 'group' => 'paie'],
            ['key' => 'taux_impot', 'value' => '15', 'type' => 'float', 'group' => 'taxes'],
            ['key' => 'taux_cnss', 'value' => '5', 'type' => 'float', 'group' => 'taxes'],
            ['key' => 'taux_cnss_employeur', 'value' => '7', 'type' => 'float', 'group' => 'taxes'],
            ['key' => 'fuseau_horaire', 'value' => 'Africa/Kinshasa', 'type' => 'text', 'group' => 'general'],
            ['key' => 'format_date', 'value' => 'd/m/Y', 'type' => 'text', 'group' => 'general'],
            ['key' => 'langue', 'value' => 'fr', 'type' => 'text', 'group' => 'general'],
        ];

        foreach ($settings as $setting) {
            HospitalSetting::updateOrCreate(
                ['key' => $setting['key'], 'group' => $setting['group']],
                $setting
            );
        }
    }
}
