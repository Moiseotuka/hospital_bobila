<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Service::with('departement')->withCount('agents');

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->departement_id) {
            $query->where('departement_id', $request->departement_id);
        }

        $services = $query->orderBy('nom')->paginate(15);

        return $this->successResponse($services->through(fn($s) => new ServiceResource($s)));
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        try {
            $service = Service::create($request->validated());

            $this->auditService->logCreation('Service', 'Création du service ' . $service->nom, $service, $request->validated());

            return $this->successResponse(new ServiceResource($service->load('departement')), 'Service créé avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création du service: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $service = Service::with('departement', 'chef')->withCount('agents')->findOrFail($id);

        return $this->successResponse(new ServiceResource($service));
    }

    public function update($id, UpdateServiceRequest $request): JsonResponse
    {
        try {
            $service = Service::findOrFail($id);
            $anciennes = $service->toArray();

            $service->update($request->validated());

            $this->auditService->logModification('Service', 'Modification du service ' . $service->nom, $service, $anciennes, $service->fresh()->toArray());

            return $this->successResponse(new ServiceResource($service->fresh()->load('departement')->loadCount('agents')), 'Service modifié avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification du service: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $service = Service::findOrFail($id);

            if ($service->agents()->count() > 0) {
                return $this->errorResponse('Impossible de supprimer ce service car il contient des agents.', null, 409);
            }

            $serviceData = $service->toArray();
            $service->delete();

            $this->auditService->logSuppression('Service', 'Suppression du service ' . $service->nom, $service, $serviceData);

            return $this->successResponse(null, 'Service supprimé avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression du service: ' . $e->getMessage(), null, 500);
        }
    }
}
