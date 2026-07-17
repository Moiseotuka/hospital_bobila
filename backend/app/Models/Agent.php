<?php

namespace App\Models;

use App\Enums\StatutAgentEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'matricule',
        'nom',
        'postnom',
        'prenom',
        'sexe',
        'date_naissance',
        'telephone',
        'adresse',
        'photo',
        'etat_civil',
        'nombre_enfants',
        'date_engagement',
        'statut',
        'grade_id',
        'fonction_id',
        'departement_id',
        'service_id',
        'categorie_salariale_id',
        'compte_bancaire',
        'banque',
        'numero_cnss',
        'email',
        'situation',
        'is_active',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_engagement' => 'date',
        'nombre_enfants' => 'integer',
        'is_active' => 'boolean',
    ];

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function fonction(): BelongsTo
    {
        return $this->belongsTo(Fonction::class);
    }

    public function departement(): BelongsTo
    {
        return $this->belongsTo(Departement::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function categorieSalariale(): BelongsTo
    {
        return $this->belongsTo(CategorieSalariale::class);
    }

    public function bulletinsPaie(): HasMany
    {
        return $this->hasMany(BulletinPaie::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function getNomCompletAttribute(): string
    {
        $parts = array_filter([$this->nom, $this->postnom, $this->prenom]);
        return implode(' ', $parts);
    }

    public function getAgeAttribute(): int
    {
        return $this->date_naissance->age;
    }

    public function scopeMilitaires($query)
    {
        return $query->where('statut', 'militaire');
    }

    public function scopeCivils($query)
    {
        return $query->where('statut', 'civil');
    }

    public function scopeActifs($query)
    {
        return $query->where('situation', StatutAgentEnum::ACTIF->value);
    }

    public function scopeParDepartement($query, int $departementId)
    {
        return $query->where('departement_id', $departementId);
    }

    public function scopeParService($query, int $serviceId)
    {
        return $query->where('service_id', $serviceId);
    }
}
