<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\BulletinPaie;
use App\Models\Paiement;
use App\Models\PeriodePaie;
use App\Services\StatistiqueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected StatistiqueService $statistiqueService;

    public function __construct(StatistiqueService $statistiqueService)
    {
        $this->statistiqueService = $statistiqueService;
    }

    public function index(): JsonResponse
    {
        $data = $this->statistiqueService->getDashboardData();

        return $this->successResponse($data);
    }

    public function evolutionMensuelle(Request $request): JsonResponse
    {
        $annee = $request->annee ?? now()->year;
        $data = $this->statistiqueService->getEvolutionMensuelle((int) $annee);

        return $this->successResponse($data);
    }

    public function repartitionGrade(): JsonResponse
    {
        $data = $this->statistiqueService->getRepartitionParGrade();

        return $this->successResponse($data);
    }

    public function repartitionDepartement(): JsonResponse
    {
        $data = $this->statistiqueService->getRepartitionParDepartement();

        return $this->successResponse($data);
    }

    public function derniersPaiements(): JsonResponse
    {
        $paiements = Paiement::with(['agent:id,matricule,nom,postnom,prenom', 'periodePaie'])
            ->where('statut', 'paye')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'reference' => $p->reference,
                'agent' => $p->agent?->nom_complet,
                'matricule' => $p->agent?->matricule,
                'montant' => (float) $p->montant,
                'mode_paiement' => $p->mode_paiement,
                'date_paiement' => $p->date_paiement?->format('Y-m-d'),
                'periode' => $p->periodePaie ? $p->periodePaie->mois . '/' . $p->periodePaie->annee : null,
            ]);

        return $this->successResponse($paiements);
    }

    public function alertes(): JsonResponse
    {
        $alertes = [];

        $agentsSansPaie = Agent::actifs()
            ->where('is_active', true)
            ->whereDoesntHave('bulletinsPaie', function ($query) {
                $query->whereHas('periodePaie', function ($q) {
                    $q->where('mois', now()->month)->where('annee', now()->year);
                });
            })
            ->count();

        if ($agentsSansPaie > 0) {
            $alertes[] = [
                'type' => 'warning',
                'message' => "{$agentsSansPaie} agent(s) actif(s) sans bulletin pour le mois en cours.",
                'module' => 'Paie',
            ];
        }

        $periodeEnAttente = PeriodePaie::where('statut', 'en_attente')->count();
        if ($periodeEnAttente > 0) {
            $alertes[] = [
                'type' => 'info',
                'message' => "{$periodeEnAttente} période(s) de paie en attente de génération.",
                'module' => 'Paie',
            ];
        }

        $paiementsEnAttente = Paiement::where('statut', 'en_attente')->count();
        if ($paiementsEnAttente > 0) {
            $alertes[] = [
                'type' => 'warning',
                'message' => "{$paiementsEnAttente} paiement(s) en attente de traitement.",
                'module' => 'Paiement',
            ];
        }

        $agentsInactifs = Agent::where('situation', 'suspendu')->where('is_active', true)->count();
        if ($agentsInactifs > 0) {
            $alertes[] = [
                'type' => 'info',
                'message' => "{$agentsInactifs} agent(s) suspendu(s) toujours actifs dans le système.",
                'module' => 'Agent',
            ];
        }

        $periodeRetard = PeriodePaie::where('statut', 'generé')
            ->where('created_at', '<', now()->subDays(7))
            ->count();
        if ($periodeRetard > 0) {
            $alertes[] = [
                'type' => 'danger',
                'message' => "{$periodeRetard} période(s) de paie en attente de validation depuis plus de 7 jours.",
                'module' => 'Paie',
            ];
        }

        return $this->successResponse($alertes);
    }
}
