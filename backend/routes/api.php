<?php

use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BulletinController;
use App\Http\Controllers\Api\CategorieSalarialeController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartementController;
use App\Http\Controllers\Api\FonctionController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\PaieController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\ParametreController;
use App\Http\Controllers\Api\PrimeController;
use App\Http\Controllers\Api\RapportController;
use App\Http\Controllers\Api\RetenueController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', function () {
    try {
        $dbOk = false;
        $userCount = 0;
        try {
            $userCount = \App\Models\User::count();
            $dbOk = true;
        } catch (\Throwable $e) {
            $dbOk = false;
            $dbError = $e->getMessage();
        }

        return response()->json([
            'success' => true,
            'message' => 'API Hôpital Militaire Camp Kokolo - Opérationnelle',
            'timestamp' => now()->toIso8601String(),
            'debug' => [
                'db_connected' => $dbOk,
                'user_count' => $userCount,
                'db_error' => $dbOk ? null : ($dbError ?? null),
            ],
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'error' => get_class($e) . ': ' . $e->getMessage(),
            'file' => $e->getFile() . ':' . $e->getLine(),
        ], 500);
    }
});

// Setup endpoint (one-time use)
Route::post('/setup', function () {
    try {
        $output = [];
        $exitCode = \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
        $output['migrate'] = ['exit' => $exitCode, 'output' => \Illuminate\Support\Facades\Artisan::output()];

        return response()->json(['success' => true, 'output' => $output]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'error' => get_class($e) . ': ' . $e->getMessage(),
            'file' => $e->getFile() . ':' . $e->getLine(),
        ], 500);
    }
});

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);

// Protected routes
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/evolution', [DashboardController::class, 'evolutionMensuelle']);
    Route::get('/dashboard/repartition-grade', [DashboardController::class, 'repartitionGrade']);
    Route::get('/dashboard/repartition-departement', [DashboardController::class, 'repartitionDepartement']);
    Route::get('/dashboard/derniers-paiements', [DashboardController::class, 'derniersPaiements']);
    Route::get('/dashboard/alertes', [DashboardController::class, 'alertes']);

    // Agents
    Route::get('agents-stats', [AgentController::class, 'stats']);
    Route::apiResource('agents', AgentController::class);
    Route::post('agents/{id}/restore', [AgentController::class, 'restore']);
    Route::get('agents/{id}/export-pdf', [AgentController::class, 'exportPDF']);
    Route::get('agents/{id}/export-excel', [AgentController::class, 'exportExcel']);

    // Reference resources
    Route::apiResource('grades', GradeController::class);
    Route::apiResource('fonctions', FonctionController::class);
    Route::apiResource('departements', DepartementController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('categories-salariales', CategorieSalarialeController::class);
    Route::apiResource('primes', PrimeController::class);
    Route::apiResource('retenues', RetenueController::class);

    // Prime & Retenue calculations
    Route::get('primes/calculate/{agent}', [PrimeController::class, 'calculatePrime']);
    Route::get('retenues/calculate/{agent}/{salaireBrut}', [RetenueController::class, 'calculateRetenue']);

    // Paie
    Route::get('paies', [PaieController::class, 'index']);
    Route::post('paies', [PaieController::class, 'store']);
    Route::get('paies/{id}', [PaieController::class, 'show']);
    Route::post('paies/{id}/generate', [PaieController::class, 'generate']);
    Route::post('paies/{id}/validate', [PaieController::class, 'validate']);
    Route::post('paies/{id}/lock', [PaieController::class, 'lock']);
    Route::get('paies/{id}/bulletins', [PaieController::class, 'getBulletins']);
    Route::get('paies/{id}/stats', [PaieController::class, 'getStats']);

    // Paiements
    Route::get('paiements', [PaiementController::class, 'index']);
    Route::post('paiements', [PaiementController::class, 'store']);
    Route::post('paiements/collective', [PaiementController::class, 'storeCollective']);
    Route::get('paiements/{id}', [PaiementController::class, 'show']);
    Route::put('paiements/{id}', [PaiementController::class, 'update']);
    Route::delete('paiements/{id}', [PaiementController::class, 'destroy']);

    // Bulletins
    Route::get('bulletins', [BulletinController::class, 'index']);
    Route::get('bulletins/{id}', [BulletinController::class, 'show']);
    Route::get('bulletins/{id}/download-pdf', [BulletinController::class, 'downloadPDF']);
    Route::get('bulletins/{id}/print', [BulletinController::class, 'print']);
    Route::post('bulletins/{id}/send-email', [BulletinController::class, 'sendByEmail']);

    // Rapports
    Route::get('rapports/mensuel/{mois}/{annee}', [RapportController::class, 'mensuel']);
    Route::get('rapports/annuel/{annee}', [RapportController::class, 'annuel']);
    Route::get('rapports/masse-salariale', [RapportController::class, 'masseSalariale']);
    Route::get('rapports/agents-impayes/{periodeId}', [RapportController::class, 'agentsImpayes']);
    Route::get('rapports/retenues/{periodeId}', [RapportController::class, 'retenues']);
    Route::get('rapports/primes/{periodeId}', [RapportController::class, 'primes']);
    Route::get('rapports/export/{type}', [RapportController::class, 'exportPDF']);
    Route::get('rapports/export-excel/{type}', [RapportController::class, 'exportExcel']);

    // Audit
    Route::get('audit-logs', [AuditController::class, 'index']);
    Route::get('audit-logs/{id}', [AuditController::class, 'show']);
    Route::get('audit-logs/export/excel', [AuditController::class, 'exportExcel']);

    // Parametres
    Route::get('parametres', [ParametreController::class, 'index']);
    Route::get('parametres/{key}', [ParametreController::class, 'show']);
    Route::put('parametres/{key}', [ParametreController::class, 'update']);
    Route::post('parametres/logo', [ParametreController::class, 'updateLogo']);
    Route::post('parametres/signature', [ParametreController::class, 'updateSignature']);
    Route::post('parametres/cachet', [ParametreController::class, 'updateCachet']);

    // Users (admin only)
    Route::middleware('role:administrateur')->group(function () {
        Route::apiResource('users', UserController::class);
    });
});
