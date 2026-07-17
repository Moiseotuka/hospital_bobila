<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Retenue extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'nom',
        'type',
        'montant',
        'pourcentage',
        'est_pourcentage',
        'description',
        'is_active',
    ];

    protected $casts = [
        'est_pourcentage' => 'boolean',
        'is_active' => 'boolean',
    ];
}
