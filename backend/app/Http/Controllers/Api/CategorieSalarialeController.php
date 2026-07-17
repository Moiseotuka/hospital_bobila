<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategorieSalarialeRequest;
use App\Http\Requests\UpdateCategorieSalarialeRequest;
use App\Http\Resources\CategorieSalarialeResource;
use App\Models\CategorieSalariale;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategorieSalarialeController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = CategorieSalariale::withCount('agents');

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('nom')->paginate(15);

        return $this->successResponse($categories->through(fn($c) => new CategorieSalarialeResource($c)));
    }

    public function store(StoreCategorieSalarialeRequest $request): JsonResponse
    {
        try {
            $categorie = CategorieSalariale::create($request->validated());

            $this->auditService->logCreation('CategorieSalariale', 'Création de la catégorie salariale ' . $categorie->nom, $categorie, $request->validated());

            return $this->successResponse(new CategorieSalarialeResource($categorie), 'Catégorie salariale créée avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la catégorie salariale: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $categorie = CategorieSalariale::withCount('agents')->findOrFail($id);

        return $this->successResponse(new CategorieSalarialeResource($categorie));
    }

    public function update($id, UpdateCategorieSalarialeRequest $request): JsonResponse
    {
        try {
            $categorie = CategorieSalariale::findOrFail($id);
            $anciennes = $categorie->toArray();

            $categorie->update($request->validated());

            $this->auditService->logModification('CategorieSalariale', 'Modification de la catégorie salariale ' . $categorie->nom, $categorie, $anciennes, $categorie->fresh()->toArray());

            return $this->successResponse(new CategorieSalarialeResource($categorie->fresh()->loadCount('agents')), 'Catégorie salariale modifiée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification de la catégorie salariale: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $categorie = CategorieSalariale::findOrFail($id);

            if ($categorie->agents()->count() > 0) {
                return $this->errorResponse('Impossible de supprimer cette catégorie car elle est liée à des agents.', null, 409);
            }

            $categorieData = $categorie->toArray();
            $categorie->delete();

            $this->auditService->logSuppression('CategorieSalariale', 'Suppression de la catégorie salariale ' . $categorie->nom, $categorie, $categorieData);

            return $this->successResponse(null, 'Catégorie salariale supprimée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la catégorie salariale: ' . $e->getMessage(), null, 500);
        }
    }
}
