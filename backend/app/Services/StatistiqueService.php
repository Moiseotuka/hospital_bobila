<?php

namespace App\Services;

use App\Models\Agent;
use App\Models\BulletinPaie;
use App\Models\Departement;
use App\Models\Grade;
use App\Models\Paiement;
use App\Models\PeriodePaie;
use App\Enums\StatutPaiementEnum;
use Illuminate\Support\Facades\DB;

class StatistiqueService
{
    public function getDashboardData(): array
    {
        $totalAgents = Agent::count();
        $militaires = Agent::militaires()->count();
        $civils = Agent::civils()->count();
        $actifs = Agent::actifs()->count();

        $masseSalariale = PeriodePaie::sum('total_net');

        $paiementsEffectues = Paiement::where('statut', StatutPaiementEnum::PAYE->value)->sum('montant');
        $paiementsEnAttente = Paiement::where('statut', StatutPaiementEnum::EN_ATTENTE->value)->sum('montant');

        $dernierePeriode = PeriodePaie::orderBy('annee', 'desc')->orderBy('mois', 'desc')->first();
        $retenuesTotales = $dernierePeriode ? $dernierePeriode->total_retenues : 0;
        $primesTotales = $dernierePeriode ? $dernierePeriode->total_primes : 0;

        return [
            'total_agents' => $totalAgents,
            'militaires' => $militaires,
            'civils' => $civils,
            'actifs' => $actifs,
            'masse_salariale' => round($masseSalariale, 2),
            'paiements_effectues' => round($paiementsEffectues, 2),
            'paiements_en_attente' => round($paiementsEnAttente, 2),
            'retenues_totales' => round($retenuesTotales, 2),
            'primes_totales' => round($primesTotales, 2),
            'derniere_periode' => $dernierePeriode ? [
                'mois' => $dernierePeriode->mois,
                'annee' => $dernierePeriode->annee,
                'statut' => $dernierePeriode->statut,
                'total_net' => $dernierePeriode->total_net,
                'nombre_agents' => $dernierePeriode->nombre_agents,
            ] : null,
        ];
    }

    public function getEvolutionMensuelle(int $annee): array
    {
        $periodes = PeriodePaie::where('annee', $annee)
            ->orderBy('mois')
            ->get(['mois', 'total_brut', 'total_primes', 'total_retenues', 'total_net', 'nombre_agents']);

        $evolution = [];
        foreach ($periodes as $periode) {
            $evolution[] = [
                'mois' => $periode->mois,
                'total_brut' => (float) $periode->total_brut,
                'total_primes' => (float) $periode->total_primes,
                'total_retenues' => (float) $periode->total_retenues,
                'total_net' => (float) $periode->total_net,
                'nombre_agents' => $periode->nombre_agents,
            ];
        }

        return $evolution;
    }

    public function getRepartitionParGrade(): array
    {
        return Grade::withCount('agents')
            ->where('is_active', true)
            ->get()
            ->map(fn($grade) => [
                'grade' => $grade->nom,
                'code' => $grade->code,
                'nombre_agents' => $grade->agents_count,
            ])
            ->toArray();
    }

    public function getRepartitionParDepartement(): array
    {
        return Departement::withCount('agents')
            ->where('is_active', true)
            ->get()
            ->map(fn($departement) => [
                'departement' => $departement->nom,
                'code' => $departement->code,
                'nombre_agents' => $departement->agents_count,
            ])
            ->toArray();
    }

    public function getMasseSalarialeParMois(int $annee): array
    {
        $periodes = PeriodePaie::where('annee', $annee)
            ->orderBy('mois')
            ->get(['mois', 'total_brut', 'total_net', 'total_primes', 'total_retenues']);

        $data = [];
        for ($mois = 1; $mois <= 12; $mois++) {
            $periode = $periodes->firstWhere('mois', $mois);
            $data[] = [
                'mois' => $mois,
                'total_brut' => $periode ? (float) $periode->total_brut : 0,
                'total_net' => $periode ? (float) $periode->total_net : 0,
                'total_primes' => $periode ? (float) $periode->total_primes : 0,
                'total_retenues' => $periode ? (float) $periode->total_retenues : 0,
            ];
        }

        return $data;
    }

    public function getStatistiquesPaiements(?int $mois = null, ?int $annee = null): array
    {
        $query = Paiement::query();

        if ($mois) {
            $query->whereMonth('date_paiement', $mois);
        }
        if ($annee) {
            $query->whereYear('date_paiement', $annee);
        }

        $totalPaye = (clone $query)->where('statut', StatutPaiementEnum::PAYE->value)->sum('montant');
        $totalEnAttente = (clone $query)->where('statut', StatutPaiementEnum::EN_ATTENTE->value)->sum('montant');
        $totalAnnule = (clone $query)->where('statut', StatutPaiementEnum::ANNULE->value)->sum('montant');

        $nombrePaye = (clone $query)->where('statut', StatutPaiementEnum::PAYE->value)->count();
        $nombreEnAttente = (clone $query)->where('statut', StatutPaiementEnum::EN_ATTENTE->value)->count();
        $nombreAnnule = (clone $query)->where('statut', StatutPaiementEnum::ANNULE->value)->count();

        $repartitionParMode = (clone $query)
            ->select('mode_paiement', DB::raw('COUNT(*) as nombre'), DB::raw('SUM(montant) as total'))
            ->groupBy('mode_paiement')
            ->get()
            ->map(fn($item) => [
                'mode' => $item->mode_paiement,
                'nombre' => $item->nombre,
                'total' => (float) $item->total,
            ])
            ->toArray();

        return [
            'montants' => [
                'paye' => round($totalPaye, 2),
                'en_attente' => round($totalEnAttente, 2),
                'annule' => round($totalAnnule, 2),
                'total' => round($totalPaye + $totalEnAttente + $totalAnnule, 2),
            ],
            'nombres' => [
                'paye' => $nombrePaye,
                'en_attente' => $nombreEnAttente,
                'annule' => $nombreAnnule,
                'total' => $nombrePaye + $nombreEnAttente + $nombreAnnule,
            ],
            'repartition_par_mode' => $repartitionParMode,
        ];
    }
}
