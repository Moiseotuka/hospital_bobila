<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartementRequest;
use App\Http\Requests\UpdateDepartementRequest;
use App\Http\Resources\DepartementResource;
use App\Models\Departement;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Departement::withCount(['agents', 'services']);

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $departements = $query->orderBy('nom')->paginate(15);

        return $this->successResponse($departements->through(fn($d) => new DepartementResource($d)));
    }

    public function store(StoreDepartementRequest $request): JsonResponse
    {
        try {
            $departement = Departement::create($request->validated());

            $this->auditService->logCreation('Departement', 'Création du département ' . $departement->nom, $departement, $request->validated());

            return $this->successResponse(new DepartementResource($departement), 'Département créé avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création du département: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $departement = Departement::withCount(['agents', 'services'])->with('chef')->findOrFail($id);

        return $this->successResponse(new DepartementResource($departement));
    }

    public function update($id, UpdateDepartementRequest $request): JsonResponse
    {
        try {
            $departement = Departement::findOrFail($id);
            $anciennes = $departement->toArray();

            $departement->update($request->validated());

            $this->auditService->logModification('Departement', 'Modification du département ' . $departement->nom, $departement, $anciennes, $departement->fresh()->toArray());

            return $this->successResponse(new DepartementResource($departement->fresh()->loadCount(['agents', 'services'])), 'Département modifié avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification du département: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $departement = Departement::findOrFail($id);

            if ($departement->agents()->count() > 0) {
                return $this->errorResponse('Impossible de supprimer ce département car il contient des agents.', null, 409);
            }

            if ($departement->services()->count() > 0) {
                return $this->errorResponse('Impossible de supprimer ce département car il contient des services.', null, 409);
            }

            $departementData = $departement->toArray();
            $departement->delete();

            $this->auditService->logSuppression('Departement', 'Suppression du département ' . $departement->nom, $departement, $departementData);

            return $this->successResponse(null, 'Département supprimé avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression du département: ' . $e->getMessage(), null, 500);
        }
    }
}
