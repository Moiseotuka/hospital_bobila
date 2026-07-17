<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'action',
        'module',
        'description',
        'model_type',
        'model_id',
        'anciennes_valeurs',
        'nouvelles_valeurs',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'anciennes_valeurs' => 'array',
        'nouvelles_valeurs' => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByModule($query, ?string $module)
    {
        if ($module) {
            return $query->where('module', $module);
        }
        return $query;
    }

    public function scopeByUser($query, ?int $userId)
    {
        if ($userId) {
            return $query->where('user_id', $userId);
        }
        return $query;
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
