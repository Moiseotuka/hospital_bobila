<?php

namespace App\Http\Controllers\Api;

use App\Enums\StatutPeriodePaieEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\BulletinPaieResource;
use App\Http\Resources\PeriodePaieResource;
use App\Models\PeriodePaie;
use App\Services\AuditService;
use App\Services\CalculPaieService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaieController extends Controller
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
        $query = PeriodePaie::withCount('bulletinsPaie')->with('createdBy:id,name');

        if ($request->annee) {
            $query->where('annee', $request->annee);
        }

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        $periodes = $query->orderBy('annee', 'desc')->orderBy('mois', 'desc')->paginate(15);

        return $this->successResponse($periodes->through(fn($p) => new PeriodePaieResource($p)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mois' => 'required|integer|min:1|max:12',
            'annee' => 'required|integer|min:2020|max:2100',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        $exists = PeriodePaie::where('mois', $validated['mois'])
            ->where('annee', $validated['annee'])
            ->exists();

        if ($exists) {
            return $this->errorResponse('Une période de paie existe déjà pour ce mois et cette année.', null, 409);
        }

        try {
            $periode = PeriodePaie::create(array_merge($validated, [
                'statut' => StatutPeriodePaieEnum::EN_ATTENTE->value,
                'created_by' => Auth::id(),
            ]));

            $this->auditService->logCreation('Paie', 'Création de la période de paie ' . $periode->mois . '/' . $periode->annee, $periode, $validated);

            return $this->successResponse(new PeriodePaieResource($periode), 'Période de paie créée avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la période: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $periode = PeriodePaie::withCount('bulletinsPaie')
            ->with(['createdBy:id,name', 'valideBy:id,name', 'verrouilleBy:id,name'])
            ->findOrFail($id);

        return $this->successResponse(new PeriodePaieResource($periode));
    }

    public function generate($id): JsonResponse
    {
        try {
            $periode = PeriodePaie::findOrFail($id);

            if ($periode->statut !== StatutPeriodePaieEnum::EN_ATTENTE->value) {
                return $this->errorResponse('Cette période ne peut pas être générée. Statut actuel: ' . $periode->statut, null, 409);
            }

            $this->calculPaieService->genererPaieMensuelle($periode);

            $this->auditService->log('generation', 'Paie', 'Génération des bulletins pour la période ' . $periode->mois . '/' . $periode->annee, $periode);

            return $this->successResponse(
                new PeriodePaieResource($periode->fresh()->loadCount('bulletinsPaie')),
                'Bulletins générés avec succès.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la génération des bulletins: ' . $e->getMessage(), null, 500);
        }
    }

    public function validate($id): JsonResponse
    {
        try {
            $periode = PeriodePaie::findOrFail($id);

            $user = Auth::user();
            if (!$user->isChefRh() && !$user->isAdministrateur()) {
                return $this->errorResponse('Seul le Chef RH ou l\'Administrateur peut valider une période.', null, 403);
            }

            if ($periode->statut !== StatutPeriodePaieEnum::GENERE->value) {
                return $this->errorResponse('La période doit être générée avant d\'être validée.', null, 409);
            }

            $periode->update([
                'statut' => StatutPeriodePaieEnum::VALIDE->value,
                'valide_by' => Auth::id(),
            ]);

            $this->auditService->log('validation', 'Paie', 'Validation de la période ' . $periode->mois . '/' . $periode->annee, $periode);

            return $this->successResponse(new PeriodePaieResource($periode->fresh()), 'Période validée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la validation: ' . $e->getMessage(), null, 500);
        }
    }

    public function lock($id): JsonResponse
    {
        try {
            $periode = PeriodePaie::findOrFail($id);

            if ($periode->statut !== StatutPeriodePaieEnum::VALIDE->value) {
                return $this->errorResponse('La période doit être validée avant d\'être verrouillée.', null, 409);
            }

            $periode->update([
                'statut' => StatutPeriodePaieEnum::VERROUILLE->value,
                'verrouille_by' => Auth::id(),
            ]);

            $this->auditService->log('verrouillage', 'Paie', 'Verrouillage de la période ' . $periode->mois . '/' . $periode->annee, $periode);

            return $this->successResponse(new PeriodePaieResource($periode->fresh()), 'Période verrouillée avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du verrouillage: ' . $e->getMessage(), null, 500);
        }
    }

    public function getBulletins($id, Request $request): JsonResponse
    {
        $periode = PeriodePaie::findOrFail($id);

        $query = $periode->bulletinsPaie()->with(['agent.grade', 'agent.fonction']);

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom_complet', 'like', "%{$search}%")
                  ->orWhere('matricule', 'like', "%{$search}%");
            });
        }

        if ($request->agent_id) {
            $query->where('agent_id', $request->agent_id);
        }

        $bulletins = $query->orderBy('nom_complet')->paginate(15);

        return $this->successResponse($bulletins->through(fn($b) => new BulletinPaieResource($b)));
    }

    public function getStats($id): JsonResponse
    {
        $periode = PeriodePaie::withCount('bulletinsPaie')->findOrFail($id);

        $stats = [
            'total_brut' => (float) $periode->total_brut,
            'total_primes' => (float) $periode->total_primes,
            'total_retenues' => (float) $periode->total_retenues,
            'total_net' => (float) $periode->total_net,
            'nombre_agents' => $periode->bulletins_paie_count ?? $periode->nombre_agents,
            'moyenne_brut' => $periode->nombre_agents > 0 ? round($periode->total_brut / $periode->nombre_agents, 2) : 0,
            'moyenne_net' => $periode->nombre_agents > 0 ? round($periode->total_net / $periode->nombre_agents, 2) : 0,
            'mois' => $periode->mois,
            'annee' => $periode->annee,
            'statut' => $periode->statut,
        ];

        return $this->successResponse($stats);
    }
}
