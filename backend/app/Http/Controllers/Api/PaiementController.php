<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaiementResource;
use App\Models\Paiement;
use App\Models\PeriodePaie;
use App\Services\AuditService;
use App\Services\PaiementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    protected AuditService $auditService;
    protected PaiementService $paiementService;

    public function __construct(AuditService $auditService, PaiementService $paiementService)
    {
        $this->auditService = $auditService;
        $this->paiementService = $paiementService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Paiement::with(['agent:id,matricule,nom,postnom,prenom', 'periodePaie', 'traitePar:id,name']);

        if ($request->periode_paie_id) {
            $query->where('periode_paie_id', $request->periode_paie_id);
        }

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        if ($request->mode_paiement) {
            $query->where('mode_paiement', $request->mode_paiement);
        }

        if ($request->agent_id) {
            $query->where('agent_id', $request->agent_id);
        }

        if ($request->date_debut) {
            $query->where('date_paiement', '>=', $request->date_debut);
        }

        if ($request->date_fin) {
            $query->where('date_paiement', '<=', $request->date_fin);
        }

        $paiements = $query->orderBy('created_at', 'desc')->paginate(15);

        return $this->successResponse($paiements->through(fn($p) => new PaiementResource($p)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bulletin_paie_id' => 'required|integer|exists:bulletins_paie,id',
            'mode_paiement' => 'required|string|in:virement_bancaire,mobile_money,especes,cheque',
            'date_paiement' => 'sometimes|date',
            'reference' => 'nullable|string|max:100',
            'banque' => 'nullable|string|max:100',
        ]);

        try {
            $bulletin = \App\Models\BulletinPaie::findOrFail($validated['bulletin_paie_id']);

            $paiement = $this->paiementService->effectuerPaiement($bulletin, $validated);

            $this->auditService->logPaiement('Paiement individuel effectué pour ' . $bulletin->nom_complet, $paiement, $validated);

            return $this->successResponse(new PaiementResource($paiement->load(['agent', 'periodePaie', 'traitePar'])), 'Paiement effectué avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du paiement: ' . $e->getMessage(), null, 500);
        }
    }

    public function storeCollective(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'periode_paie_id' => 'required|integer|exists:periode_paies,id',
            'mode_paiement' => 'required|string|in:virement_bancaire,mobile_money,especes,cheque',
            'date_paiement' => 'sometimes|date',
            'banque' => 'nullable|string|max:100',
        ]);

        try {
            $periode = PeriodePaie::findOrFail($validated['periode_paie_id']);

            $paiements = $this->paiementService->effectuerPaiementCollectif($periode, $validated);

            $this->auditService->logPaiement('Paiement collectif pour la période ' . $periode->mois . '/' . $periode->annee, $periode, $validated);

            return $this->successResponse(
                PaiementResource::collection($paiements->load(['agent', 'periodePaie', 'traitePar'])),
                count($paiements) . ' paiement(s) effectué(s) avec succès.',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du paiement collectif: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $paiement = Paiement::with(['agent', 'periodePaie', 'traitePar', 'bulletinPaie'])->findOrFail($id);

        return $this->successResponse(new PaiementResource($paiement));
    }

    public function update($id, Request $request): JsonResponse
    {
        $paiement = Paiement::findOrFail($id);

        if ($paiement->statut !== 'en_attente') {
            return $this->errorResponse('Seuls les paiements en attente peuvent être modifiés.', null, 409);
        }

        $validated = $request->validate([
            'mode_paiement' => 'sometimes|string|in:virement_bancaire,mobile_money,especes,cheque',
            'date_paiement' => 'sometimes|date',
            'reference' => 'nullable|string|max:100',
            'banque' => 'nullable|string|max:100',
        ]);

        try {
            $anciennes = $paiement->toArray();
            $paiement->update($validated);

            $this->auditService->logModification('Paiement', 'Modification du paiement ' . $paiement->reference, $paiement, $anciennes, $paiement->fresh()->toArray());

            return $this->successResponse(new PaiementResource($paiement->fresh()->load(['agent', 'periodePaie', 'traitePar'])), 'Paiement modifié avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification du paiement: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id, Request $request): JsonResponse
    {
        $request->validate([
            'motif' => 'required|string|max:255',
        ]);

        try {
            $paiement = Paiement::findOrFail($id);

            $this->paiementService->annulerPaiement($paiement, $request->motif);

            $this->auditService->logSuppression('Paiement', 'Annulation du paiement ' . $paiement->reference . ' - Motif: ' . $request->motif, $paiement, $paiement->toArray());

            return $this->successResponse(null, 'Paiement annulé avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'annulation du paiement: ' . $e->getMessage(), null, 500);
        }
    }
}
