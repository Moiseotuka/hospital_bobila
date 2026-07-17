<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e): mixed
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException($request, Throwable $e): JsonResponse
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Erreur de validation.',
                'errors' => $e->errors(),
            ], 422);
        }

        if ($e instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Non authentifié.',
                'errors' => null,
            ], 401);
        }

        if ($e instanceof AuthorizationException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Action non autorisée.',
                'errors' => null,
            ], 403);
        }

        if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Ressource non trouvée.',
                'errors' => null,
            ], 404);
        }

        if (config('app.debug')) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage(),
                'errors' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString(),
                ],
            ], 500);
        }

        return response()->json([
            'success' => false,
            'data' => null,
            'message' => 'Erreur interne du serveur.',
            'errors' => null,
        ], 500);
    }
}
