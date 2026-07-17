<?php

namespace App\Models;

use App\Enums\StatutPeriodePaieEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PeriodePaie extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'mois',
        'annee',
        'date_debut',
        'date_fin',
        'statut',
        'total_brut',
        'total_primes',
        'total_retenues',
        'total_net',
        'nombre_agents',
        'created_by',
        'valide_by',
        'verrouille_by',
    ];

    protected $casts = [
        'total_brut' => 'decimal:2',
        'total_primes' => 'decimal:2',
        'total_retenues' => 'decimal:2',
        'total_net' => 'decimal:2',
        'nombre_agents' => 'integer',
    ];

    public function bulletinsPaie(): HasMany
    {
        return $this->hasMany(BulletinPaie::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function valideBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'valide_by');
    }

    public function verrouilleBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verrouille_by');
    }

    public function estGenerer(): bool
    {
        return $this->statut === StatutPeriodePaieEnum::GENERE->value;
    }

    public function estValide(): bool
    {
        return $this->statut === StatutPeriodePaieEnum::VALIDE->value;
    }

    public function estVerrouille(): bool
    {
        return $this->statut === StatutPeriodePaieEnum::VERROUILLE->value;
    }

    public function scopeByStatut($query, string $statut)
    {
        return $query->where('statut', $statut);
    }

    public function scopeByAnnee($query, int $annee)
    {
        return $query->where('annee', $annee);
    }
}
