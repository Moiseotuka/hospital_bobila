<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Non authentifié.',
                'errors' => null,
            ], 401);
        }

        foreach ($roles as $role) {
            if ($user->role === $role) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'data' => null,
            'message' => 'Accès refusé. Vous n\'avez pas les autorisations nécessaires.',
            'errors' => ['role' => ['Rôle requis : ' . implode(', ', $roles)]],
        ], 403);
    }
}
