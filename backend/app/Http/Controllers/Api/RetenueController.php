<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRetenueRequest;
use App\Http\Requests\UpdateRetenueRequest;
use App\Http\Resources\RetenueResource;
use App\Models\Agent;
use App\Models\Retenue;
use App\Services\AuditService;
use App\Services\CalculPaieService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RetenueController extends Controller
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
        $query = Retenue::query();

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

        $retenues = $query->orderBy('nom')->paginate(15);

        return $this->successResponse($retenues->through(fn($r) => new RetenueResource($r)));
    }

    public function store(StoreRetenueRequest $request): JsonResponse
    {
        try {
            $retenue = Retenue::create($request->validated());

            $this->auditService->logCreation('Retenue', 'Création de la retenue ' . $retenue->nom, $retenue, $request->validated());

            return $this->successResponse(new RetenueResource($retenue), 'Retenue créée avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la retenue: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $retenue = Retenue::findOrFail($id);

        return $this->successResponse(new RetenueResource($retenue));
    }

    public function update($id, UpdateRetenueRequest $request): JsonResponse
    {
        try {
            $retenue = Retenue::findOrFail($id);
            $anciennes = $retenue->toArray();

            $retenue->update($request->validated());

            $this->auditService->logModification('Retenue', 'Modification de la retenue ' . $retenue->nom, $retenue, $anciennes, $retenue->fresh()->toArray());

            return $this->successResponse(new RetenueResource($retenue->fresh()), 'Retenue modifiée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification de la retenue: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $retenue = Retenue::findOrFail($id);
            $retenueData = $retenue->toArray();
            $retenue->delete();

            $this->auditService->logSuppression('Retenue', 'Suppression de la retenue ' . $retenue->nom, $retenue, $retenueData);

            return $this->successResponse(null, 'Retenue supprimée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la retenue: ' . $e->getMessage(), null, 500);
        }
    }

    public function calculateRetenue(Agent $agent, float $salaireBrut): JsonResponse
    {
        try {
            $agent->load(['grade', 'fonction', 'categorieSalariale']);

            $total = $this->calculPaieService->calculerTotalRetenues($agent, $salaireBrut);
            $impot = $this->calculPaieService->calculerImpot($salaireBrut);
            $cnss = $this->calculPaieService->calculerCnss($salaireBrut);

            $retenuesActives = Retenue::where('is_active', true)
                ->where('type', '!=', 'impot')
                ->where('type', '!=', 'cnss')
                ->get();

            $details = [];

            $details[] = [
                'code' => 'IMPOT',
                'nom' => 'Impôt sur le revenu',
                'type' => 'impot',
                'montant' => $impot,
                'est_pourcentage' => true,
                'pourcentage' => 15,
            ];

            $details[] = [
                'code' => 'CNSS',
                'nom' => 'Cotisation CNSS',
                'type' => 'cnss',
                'montant' => $cnss,
                'est_pourcentage' => true,
                'pourcentage' => 3.5,
            ];

            foreach ($retenuesActives as $retenue) {
                $montant = 0;
                if ($retenue->est_pourcentage && $retenue->pourcentage) {
                    $montant = round($salaireBrut * ($retenue->pourcentage / 100), 2);
                } elseif ($retenue->montant) {
                    $montant = $retenue->montant;
                }

                $details[] = [
                    'id' => $retenue->id,
                    'code' => $retenue->code,
                    'nom' => $retenue->nom,
                    'type' => $retenue->type,
                    'montant' => $montant,
                    'est_pourcentage' => $retenue->est_pourcentage,
                    'pourcentage' => $retenue->pourcentage,
                ];
            }

            return $this->successResponse([
                'agent' => [
                    'id' => $agent->id,
                    'matricule' => $agent->matricule,
                    'nom_complet' => $agent->nom_complet,
                ],
                'salaire_brut' => $salaireBrut,
                'retenues' => $details,
                'total_retenues' => round($total, 2),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du calcul des retenues: ' . $e->getMessage(), null, 500);
        }
    }
}
