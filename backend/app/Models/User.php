<?php

namespace App\Models;

use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, HasFactory, SoftDeletes, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'phone',
        'photo',
        'derniere_connexion',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'derniere_connexion' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function notifications()
    {
        return $this->morphMany(\Illuminate\Notifications\DatabaseNotification::class, 'notifiable');
    }

    public function isAdministrateur(): bool
    {
        return $this->role === RoleEnum::ADMINISTRATEUR->value;
    }

    public function isChefRh(): bool
    {
        return $this->role === RoleEnum::CHEF_RH->value;
    }

    public function isComptable(): bool
    {
        return $this->role === RoleEnum::COMPTABLE->value;
    }

    public function isDirection(): bool
    {
        return $this->role === RoleEnum::DIRECTION->value;
    }

    public function isAuditeur(): bool
    {
        return $this->role === RoleEnum::AUDITEUR->value;
    }
}
