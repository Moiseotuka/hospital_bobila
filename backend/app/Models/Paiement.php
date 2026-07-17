<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Paiement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'bulletin_paie_id',
        'agent_id',
        'periode_paie_id',
        'montant',
        'date_paiement',
        'mode_paiement',
        'reference',
        'banque',
        'statut',
        'motif_annulation',
        'traite_par',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_paiement' => 'date',
    ];

    public function bulletinPaie(): BelongsTo
    {
        return $this->belongsTo(BulletinPaie::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function periodePaie(): BelongsTo
    {
        return $this->belongsTo(PeriodePaie::class);
    }

    public function traitePar(): BelongsTo
    {
        return $this->belongsTo(User::class, 'traite_par');
    }
}
