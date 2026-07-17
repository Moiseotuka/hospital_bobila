<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePrimeRequest;
use App\Http\Requests\UpdatePrimeRequest;
use App\Http\Resources\PrimeResource;
use App\Models\Agent;
use App\Models\Prime;
use App\Services\AuditService;
use App\Services\CalculPaieService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrimeController extends Controller
{
    protected AuditService $auditService;
    protected CalculPaieService $calculPaieService;

    public function __construct(AuditService $auditService, CalculPaieService $calculPaieService)
    {
        $this->auditService = $auditService;
        $this->calculPaieService = $calculPaieService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Prime::query();

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $primes = $query->orderBy('nom')->paginate(15);

        return $this->successResponse($primes->through(fn($p) => new PrimeResource($p)));
    }

    public function store(StorePrimeRequest $request): JsonResponse
    {
        try {
            $prime = Prime::create($request->validated());

            $this->auditService->logCreation('Prime', 'Création de la prime ' . $prime->nom, $prime, $request->validated());

            return $this->successResponse(new PrimeResource($prime), 'Prime créée avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la prime: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $prime = Prime::findOrFail($id);

        return $this->successResponse(new PrimeResource($prime));
    }

    public function update($id, UpdatePrimeRequest $request): JsonResponse
    {
        try {
            $prime = Prime::findOrFail($id);
            $anciennes = $prime->toArray();

            $prime->update($request->validated());

            $this->auditService->logModification('Prime', 'Modification de la prime ' . $prime->nom, $prime, $anciennes, $prime->fresh()->toArray());

            return $this->successResponse(new PrimeResource($prime->fresh()), 'Prime modifiée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification de la prime: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $prime = Prime::findOrFail($id);
            $primeData = $prime->toArray();
            $prime->delete();

            $this->auditService->logSuppression('Prime', 'Suppression de la prime ' . $prime->nom, $prime, $primeData);

            return $this->successResponse(null, 'Prime supprimée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la prime: ' . $e->getMessage(), null, 500);
        }
    }

    public function calculatePrime(Agent $agent): JsonResponse
    {
        try {
            $agent->load(['grade', 'fonction', 'categorieSalariale']);

            $primesActives = Prime::where('is_active', true)->get();
            $salaireBase = $agent->grade ? $agent->grade->salaire_base : 0;

            $details = [];
            $total = 0;

            foreach ($primesActives as $prime) {
                $montant = 0;
                if ($prime->est_pourcentage) {
                    $montant = round($salaireBase * ($prime->pourcentage / 100), 2);
                } else {
                    $montant = $prime->montant;
                }

                $details[] = [
                    'id' => $prime->id,
                    'code' => $prime->code,
                    'nom' => $prime->nom,
                    'type' => $prime->type,
                    'montant' => $montant,
                    'est_pourcentage' => $prime->est_pourcentage,
                    'pourcentage' => $prime->pourcentage,
                ];

                $total += $montant;
            }

            return $this->successResponse([
                'agent' => [
                    'id' => $agent->id,
                    'matricule' => $agent->matricule,
                    'nom_complet' => $agent->nom_complet,
                    'salaire_base' => (float) $salaireBase,
                ],
                'primes' => $details,
                'total_primes' => round($total, 2),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du calcul des primes: ' . $e->getMessage(), null, 500);
        }
    }
}
