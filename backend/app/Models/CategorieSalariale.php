<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategorieSalariale extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categories_salariales';

    protected $fillable = [
        'code',
        'nom',
        'salaire_base',
        'indemnites',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }
}
