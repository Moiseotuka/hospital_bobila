<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if (!$user->is_active) {
            return $this->errorResponse('Votre compte est désactivé. Contactez l\'administrateur.', null, 403);
        }

        $user->update(['derniere_connexion' => now()]);

        $abilities = [$user->role];
        $token = $user->createToken('auth-token-' . $user->id, $abilities)->plainTextToken;

        $this->auditService->logConnexion();

        return $this->successResponse([
            'user' => new UserResource($user),
            'token' => $token,
            'abilities' => $abilities,
        ], 'Connexion réussie.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        $this->auditService->log('deconnexion', 'Authentification', 'Déconnexion de l\'utilisateur');

        return $this->successResponse(null, 'Déconnexion réussie.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['permissions', 'roles']);

        return $this->successResponse(new UserResource($user));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|max:100|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }
            $validated['photo'] = $request->file('photo')->store('users/photos', 'public');
        }

        $user->update($validated);

        $this->auditService->logModification(
            'Profil',
            'Mise à jour du profil',
            $user,
            [],
            $validated
        );

        return $this->successResponse(new UserResource($user), 'Profil mis à jour avec succès.');
    }
}
