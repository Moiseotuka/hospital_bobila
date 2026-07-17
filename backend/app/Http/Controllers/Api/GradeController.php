<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Http\Resources\GradeResource;
use App\Models\Grade;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Grade::withCount('agents');

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $grades = $query->orderBy('nom')->paginate(15);

        return $this->successResponse($grades->through(fn($grade) => new GradeResource($grade)));
    }

    public function store(StoreGradeRequest $request): JsonResponse
    {
        try {
            $grade = Grade::create($request->validated());

            $this->auditService->logCreation('Grade', 'Création du grade ' . $grade->nom, $grade, $request->validated());

            return $this->successResponse(new GradeResource($grade), 'Grade créé avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création du grade: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $grade = Grade::withCount('agents')->findOrFail($id);

        return $this->successResponse(new GradeResource($grade));
    }

    public function update($id, UpdateGradeRequest $request): JsonResponse
    {
        try {
            $grade = Grade::findOrFail($id);
            $anciennes = $grade->toArray();

            $grade->update($request->validated());

            $this->auditService->logModification('Grade', 'Modification du grade ' . $grade->nom, $grade, $anciennes, $grade->fresh()->toArray());

            return $this->successResponse(new GradeResource($grade->fresh()->loadCount('agents')), 'Grade modifié avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification du grade: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $grade = Grade::findOrFail($id);

            if ($grade->agents()->count() > 0) {
                return $this->errorResponse('Impossible de supprimer ce grade car il est lié à des agents.', null, 409);
            }

            $gradeData = $grade->toArray();
            $grade->delete();

            $this->auditService->logSuppression('Grade', 'Suppression du grade ' . $grade->nom, $grade, $gradeData);

            return $this->successResponse(null, 'Grade supprimé avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression du grade: ' . $e->getMessage(), null, 500);
        }
    }
}
