<?php

namespace Database\Seeders;

use App\Models\HospitalSetting;
use Illuminate\Database\Seeder;

class HospitalSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'hopital_nom', 'value' => 'Hôpital Militaire Central Camp Kokolo', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'hopital_adresse', 'value' => 'Camp Kokolo, Kinshasa, RDC', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'hopital_telephone', 'value' => '+243 81 000 00 00', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'hopital_email', 'value' => 'contact@hmckokolo.cd', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'hopital_devise', 'value' => 'FC', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'hopital_devise_symbole', 'value' => 'FC', 'type' => 'text', 'group' => 'hopital'],
            ['key' => 'hopital_taux_change', 'value' => '2500', 'type' => 'float', 'group' => 'hopital'],
            ['key' => 'paie_jour_traitement', 'value' => '25', 'type' => 'integer', 'group' => 'paie'],
            ['key' => 'paie_devise', 'value' => 'FC', 'type' => 'text', 'group' => 'paie'],
            ['key' => 'impot_taux', 'value' => '15', 'type' => 'float', 'group' => 'paie'],
            ['key' => 'cnss_taux', 'value' => '5', 'type' => 'float', 'group' => 'paie'],
            ['key' => 'cnss_employeur_taux', 'value' => '7', 'type' => 'float', 'group' => 'paie'],
        ];

        foreach ($settings as $setting) {
            HospitalSetting::create($setting);
        }
    }
}
