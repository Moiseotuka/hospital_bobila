<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class BulletinPaie extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'agent_id',
        'periode_paie_id',
        'matricule',
        'nom_complet',
        'grade_nom',
        'fonction_nom',
        'departement_nom',
        'service_nom',
        'salaire_base',
        'total_primes',
        'total_retenues',
        'salaire_brut',
        'salaire_net',
        'net_a_payer',
        'primes_detail',
        'retenues_detail',
        'date_generation',
        'est_valide',
        'est_verrouille',
        'qr_code',
    ];

    protected $casts = [
        'primes_detail' => 'array',
        'retenues_detail' => 'array',
        'salaire_base' => 'decimal:2',
        'total_primes' => 'decimal:2',
        'total_retenues' => 'decimal:2',
        'salaire_brut' => 'decimal:2',
        'salaire_net' => 'decimal:2',
        'net_a_payer' => 'decimal:2',
        'date_generation' => 'datetime',
        'est_valide' => 'boolean',
        'est_verrouille' => 'boolean',
    ];

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function periodePaie(): BelongsTo
    {
        return $this->belongsTo(PeriodePaie::class);
    }

    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }

    public function genererQrCode(): string
    {
        $data = json_encode([
            'bulletin_id' => $this->id,
            'matricule' => $this->matricule,
            'agent' => $this->nom_complet,
            'periode' => $this->periodePaie->mois . '/' . $this->periodePaie->annee,
            'net_a_payer' => $this->net_a_payer,
            'date' => $this->date_generation->format('Y-m-d H:i:s'),
        ]);

        $qrCode = QrCode::format('png')
            ->size(250)
            ->margin(2)
            ->generate($data);

        $this->qr_code = base64_encode($qrCode);
        $this->save();

        return $this->qr_code;
    }
}
