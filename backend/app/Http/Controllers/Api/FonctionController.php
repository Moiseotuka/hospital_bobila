<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFonctionRequest;
use App\Http\Requests\UpdateFonctionRequest;
use App\Http\Resources\FonctionResource;
use App\Models\Fonction;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FonctionController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Fonction::withCount('agents');

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $fonctions = $query->orderBy('nom')->paginate(15);

        return $this->successResponse($fonctions->through(fn($f) => new FonctionResource($f)));
    }

    public function store(StoreFonctionRequest $request): JsonResponse
    {
        try {
            $fonction = Fonction::create($request->validated());

            $this->auditService->logCreation('Fonction', 'Création de la fonction ' . $fonction->nom, $fonction, $request->validated());

            return $this->successResponse(new FonctionResource($fonction), 'Fonction créée avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la fonction: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $fonction = Fonction::withCount('agents')->findOrFail($id);

        return $this->successResponse(new FonctionResource($fonction));
    }

    public function update($id, UpdateFonctionRequest $request): JsonResponse
    {
        try {
            $fonction = Fonction::findOrFail($id);
            $anciennes = $fonction->toArray();

            $fonction->update($request->validated());

            $this->auditService->logModification('Fonction', 'Modification de la fonction ' . $fonction->nom, $fonction, $anciennes, $fonction->fresh()->toArray());

            return $this->successResponse(new FonctionResource($fonction->fresh()->loadCount('agents')), 'Fonction modifiée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification de la fonction: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $fonction = Fonction::findOrFail($id);

            if ($fonction->agents()->count() > 0) {
                return $this->errorResponse('Impossible de supprimer cette fonction car elle est liée à des agents.', null, 409);
            }

            $fonctionData = $fonction->toArray();
            $fonction->delete();

            $this->auditService->logSuppression('Fonction', 'Suppression de la fonction ' . $fonction->nom, $fonction, $fonctionData);

            return $this->successResponse(null, 'Fonction supprimée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la fonction: ' . $e->getMessage(), null, 500);
        }
    }
}
