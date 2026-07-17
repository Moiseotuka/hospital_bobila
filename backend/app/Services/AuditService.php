<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    public function log(
        string $action,
        string $module,
        string $description,
        Model $model = null,
        array $anciennes = [],
        array $nouvelles = []
    ): AuditLog {
        $request = request();

        return AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model?->getKey(),
            'anciennes_valeurs' => $anciennes,
            'nouvelles_valeurs' => $nouvelles,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'created_at' => now(),
        ]);
    }

    public function logConnexion(): AuditLog
    {
        return $this->log('connexion', 'Authentification', 'Connexion de l\'utilisateur');
    }

    public function logCreation(string $module, string $description, Model $model, array $nouvelles = []): AuditLog
    {
        return $this->log('creation', $module, $description, $model, [], $nouvelles);
    }

    public function logModification(string $module, string $description, Model $model, array $anciennes, array $nouvelles): AuditLog
    {
        return $this->log('modification', $module, $description, $model, $anciennes, $nouvelles);
    }

    public function logSuppression(string $module, string $description, Model $model, array $anciennes = []): AuditLog
    {
        return $this->log('suppression', $module, $description, $model, $anciennes, []);
    }

    public function logPaiement(string $description, Model $model, array $nouvelles = []): AuditLog
    {
        return $this->log('paiement', 'Paiement', $description, $model, [], $nouvelles);
    }

    public function logExport(string $module, string $description): AuditLog
    {
        return $this->log('export', $module, $description);
    }

    public function logImpression(string $module, string $description, Model $model = null): AuditLog
    {
        return $this->log('impression', $module, $description, $model);
    }
}
