<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('name')->paginate(15);

        return $this->successResponse($users->through(fn($u) => new UserResource($u)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', 'string', Rule::in(RoleEnum::valeurs())],
            'phone' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            $validated['password'] = Hash::make($validated['password']);

            if ($request->hasFile('photo')) {
                $validated['photo'] = $request->file('photo')->store('users/photos', 'public');
            }

            $validated['is_active'] = $validated['is_active'] ?? true;

            $user = User::create($validated);

            $this->auditService->logCreation('User', 'Création de l\'utilisateur ' . $user->name, $user, $validated);

            return $this->successResponse(new UserResource($user), 'Utilisateur créé avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'utilisateur: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $user = User::findOrFail($id);

        return $this->successResponse(new UserResource($user));
    }

    public function update($id, Request $request): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => ['sometimes', 'email', 'max:100', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'role' => ['sometimes', 'string', Rule::in(RoleEnum::valeurs())],
            'phone' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            $anciennes = $user->toArray();

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            if ($request->hasFile('photo')) {
                if ($user->photo) {
                    Storage::disk('public')->delete($user->photo);
                }
                $validated['photo'] = $request->file('photo')->store('users/photos', 'public');
            }

            $user->update($validated);

            $this->auditService->logModification('User', 'Modification de l\'utilisateur ' . $user->name, $user, $anciennes, $user->fresh()->toArray());

            return $this->successResponse(new UserResource($user->fresh()), 'Utilisateur modifié avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification de l\'utilisateur: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            if ($user->id === auth()->id()) {
                return $this->errorResponse('Vous ne pouvez pas supprimer votre propre compte.', null, 409);
            }

            $userData = $user->toArray();
            $user->delete();

            $this->auditService->logSuppression('User', 'Suppression de l\'utilisateur ' . $user->name, $user, $userData);

            return $this->successResponse(null, 'Utilisateur supprimé avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'utilisateur: ' . $e->getMessage(), null, 500);
        }
    }
}
