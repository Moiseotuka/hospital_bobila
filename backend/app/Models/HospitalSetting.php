<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HospitalSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    public function getValueAttribute($value)
    {
        return match ($this->type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'float' => (float) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }

    public function setValueAttribute($value): void
    {
        if ($this->type === 'json' && is_array($value)) {
            $this->attributes['value'] = json_encode($value);
        } elseif (is_bool($value)) {
            $this->attributes['value'] = $value ? '1' : '0';
        } else {
            $this->attributes['value'] = $value;
        }
    }

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function setValue(string $key, mixed $value, string $type = 'text', ?string $group = null): self
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'type' => $type, 'group' => $group]
        );
    }

    public function scopeByGroup($query, string $group)
    {
        return $query->where('group', $group);
    }
}
