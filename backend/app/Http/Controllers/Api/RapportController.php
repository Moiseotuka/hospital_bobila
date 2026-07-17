<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Paiement;
use App\Models\PeriodePaie;
use App\Services\AuditService;
use App\Services\ExportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class RapportController extends Controller
{
    protected AuditService $auditService;
    protected ExportService $exportService;

    public function __construct(AuditService $auditService, ExportService $exportService)
    {
        $this->auditService = $auditService;
        $this->exportService = $exportService;
    }

    public function mensuel(Request $request, $mois = null, $annee = null): JsonResponse
    {
        $mois = $mois ?? now()->month;
        $annee = $annee ?? now()->year;

        $periode = PeriodePaie::where('mois', $mois)
            ->where('annee', $annee)
            ->with(['bulletinsPaie.agent.grade', 'bulletinsPaie.agent.fonction'])
            ->first();

        if (!$periode) {
            return $this->successResponse([
                'mois' => (int) $mois,
                'annee' => (int) $annee,
                'message' => 'Aucune période de paie trouvée pour ce mois.',
                'donnees' => null,
            ]);
        }

        $bulletins = $periode->bulletinsPaie;

        $data = [
            'periode' => [
                'mois' => $periode->mois,
                'annee' => $periode->annee,
                'statut' => $periode->statut,
                'date_debut' => $periode->date_debut?->format('Y-m-d'),
                'date_fin' => $periode->date_fin?->format('Y-m-d'),
            ],
            'recapitulatif' => [
                'total_brut' => (float) $periode->total_brut,
                'total_primes' => (float) $periode->total_primes,
                'total_retenues' => (float) $periode->total_retenues,
                'total_net' => (float) $periode->total_net,
                'nombre_agents' => $bulletins->count(),
                'moyenne_brut' => $bulletins->count() > 0 ? round($bulletins->avg('salaire_brut'), 2) : 0,
                'moyenne_net' => $bulletins->count() > 0 ? round($bulletins->avg('net_a_payer'), 2) : 0,
            ],
            'bulletins' => $bulletins->map(fn($b) => [
                'matricule' => $b->matricule,
                'nom_complet' => $b->nom_complet,
                'grade' => $b->grade_nom,
                'fonction' => $b->fonction_nom,
                'salaire_base' => (float) $b->salaire_base,
                'total_primes' => (float) $b->total_primes,
                'total_retenues' => (float) $b->total_retenues,
                'salaire_brut' => (float) $b->salaire_brut,
                'net_a_payer' => (float) $b->net_a_payer,
            ]),
        ];

        return $this->successResponse($data);
    }

    public function annuel($annee): JsonResponse
    {
        $annee = $annee ?? now()->year;

        $periodes = PeriodePaie::where('annee', $annee)
            ->orderBy('mois')
            ->get();

        $recapMensuel = [];
        $totalBrut = 0;
        $totalNet = 0;
        $totalPrimes = 0;
        $totalRetenues = 0;

        foreach ($periodes as $periode) {
            $recapMensuel[] = [
                'mois' => $periode->mois,
                'total_brut' => (float) $periode->total_brut,
                'total_net' => (float) $periode->total_net,
                'total_primes' => (float) $periode->total_primes,
                'total_retenues' => (float) $periode->total_retenues,
                'nombre_agents' => $periode->nombre_agents,
                'statut' => $periode->statut,
            ];

            $totalBrut += (float) $periode->total_brut;
            $totalNet += (float) $periode->total_net;
            $totalPrimes += (float) $periode->total_primes;
            $totalRetenues += (float) $periode->total_retenues;
        }

        $data = [
            'annee' => (int) $annee,
            'recap_mensuel' => $recapMensuel,
            'total_annuel' => [
                'total_brut' => round($totalBrut, 2),
                'total_net' => round($totalNet, 2),
                'total_primes' => round($totalPrimes, 2),
                'total_retenues' => round($totalRetenues, 2),
                'nombre_mois_traites' => count($periodes),
            ],
        ];

        return $this->successResponse($data);
    }

    public function masseSalariale(Request $request): JsonResponse
    {
        $query = PeriodePaie::query();

        if ($request->date_debut) {
            $query->where(function ($q) use ($request) {
                $q->whereYear('created_at', '>=', substr($request->date_debut, 0, 4))
                  ->orWhere(function ($q) use ($request) {
                      $q->whereYear('created_at', '>=', substr($request->date_debut, 0, 4))
                        ->whereMonth('created_at', '>=', substr($request->date_debut, 5, 2));
                  });
            });
        }

        if ($request->date_fin) {
            $query->where(function ($q) use ($request) {
                $q->whereYear('created_at', '<=', substr($request->date_fin, 0, 4))
                  ->orWhere(function ($q) use ($request) {
                      $q->whereYear('created_at', '<=', substr($request->date_fin, 0, 4))
                        ->whereMonth('created_at', '<=', substr($request->date_fin, 5, 2));
                  });
            });
        }

        if ($request->annee) {
            $query->where('annee', $request->annee);
        }

        $periodes = $query->orderBy('annee', 'desc')->orderBy('mois', 'desc')->get();

        $totalBrut = $periodes->sum('total_brut');
        $totalNet = $periodes->sum('total_net');
        $totalPrimes = $periodes->sum('total_primes');
        $totalRetenues = $periodes->sum('total_retenues');
        $totalAgents = $periodes->max('nombre_agents');

        $data = [
            'masse_salariale_brute' => round($totalBrut, 2),
            'masse_salariale_nette' => round($totalNet, 2),
            'total_primes' => round($totalPrimes, 2),
            'total_retenues' => round($totalRetenues, 2),
            'nombre_periodes' => $periodes->count(),
            'nombre_agents_max' => $totalAgents,
            'moyenne_mensuelle_brute' => $periodes->count() > 0 ? round($totalBrut / $periodes->count(), 2) : 0,
            'moyenne_mensuelle_nette' => $periodes->count() > 0 ? round($totalNet / $periodes->count(), 2) : 0,
            'periodes' => $periodes->map(fn($p) => [
                'mois' => $p->mois,
                'annee' => $p->annee,
                'total_brut' => (float) $p->total_brut,
                'total_net' => (float) $p->total_net,
                'nombre_agents' => $p->nombre_agents,
                'statut' => $p->statut,
            ]),
        ];

        return $this->successResponse($data);
    }

    public function agentsImpayes($periodeId): JsonResponse
    {
        $periode = PeriodePaie::findOrFail($periodeId);

        $bulletins = $periode->bulletinsPaie()
            ->whereDoesntHave('paiement', function ($query) {
                $query->where('statut', 'paye');
            })
            ->with(['agent.grade', 'agent.fonction', 'agent.departement', 'agent.service'])
            ->get();

        $data = [
            'periode' => [
                'mois' => $periode->mois,
                'annee' => $periode->annee,
            ],
            'total_impayes' => $bulletins->count(),
            'montant_total_impaye' => round($bulletins->sum('net_a_payer'), 2),
            'agents' => $bulletins->map(fn($b) => [
                'id' => $b->agent_id,
                'matricule' => $b->matricule,
                'nom_complet' => $b->nom_complet,
                'grade' => $b->grade_nom,
                'departement' => $b->departement_nom,
                'net_a_payer' => (float) $b->net_a_payer,
                'bulletin_id' => $b->id,
            ]),
        ];

        return $this->successResponse($data);
    }

    public function retenues($periodeId): JsonResponse
    {
        $periode = PeriodePaie::findOrFail($periodeId);

        $bulletins = $periode->bulletinsPaie()->get();

        $retenuesDetail = [];
        $totalRetenues = 0;

        foreach ($bulletins as $bulletin) {
            $details = $bulletin->retenues_detail ?? [];
            foreach ($details as $detail) {
                $code = $detail['code'] ?? 'AUTRE';
                if (!isset($retenuesDetail[$code])) {
                    $retenuesDetail[$code] = [
                        'code' => $code,
                        'nom' => $detail['nom'] ?? $code,
                        'type' => $detail['type'] ?? 'autre',
                        'montant_total' => 0,
                        'nombre_agents' => 0,
                    ];
                }
                $montant = $detail['montant'] ?? 0;
                $retenuesDetail[$code]['montant_total'] += $montant;
                $retenuesDetail[$code]['nombre_agents']++;
                $totalRetenues += $montant;
            }
        }

        return $this->successResponse([
            'periode' => [
                'mois' => $periode->mois,
                'annee' => $periode->annee,
            ],
            'total_retenues' => round($totalRetenues, 2),
            'details' => array_values($retenuesDetail),
        ]);
    }

    public function primes($periodeId): JsonResponse
    {
        $periode = PeriodePaie::findOrFail($periodeId);

        $bulletins = $periode->bulletinsPaie()->get();

        $primesDetail = [];
        $totalPrimes = 0;

        foreach ($bulletins as $bulletin) {
            $details = $bulletin->primes_detail ?? [];
            foreach ($details as $detail) {
                $code = $detail['code'] ?? 'AUTRE';
                if (!isset($primesDetail[$code])) {
                    $primesDetail[$code] = [
                        'code' => $code,
                        'nom' => $detail['nom'] ?? $code,
                        'type' => $detail['type'] ?? 'autre',
                        'montant_total' => 0,
                        'nombre_agents' => 0,
                    ];
                }
                $montant = $detail['montant'] ?? 0;
                $primesDetail[$code]['montant_total'] += $montant;
                $primesDetail[$code]['nombre_agents']++;
                $totalPrimes += $montant;
            }
        }

        return $this->successResponse([
            'periode' => [
                'mois' => $periode->mois,
                'annee' => $periode->annee,
            ],
            'total_primes' => round($totalPrimes, 2),
            'details' => array_values($primesDetail),
        ]);
    }

    public function exportPDF(Request $request, $type): JsonResponse
    {
        $validTypes = ['mensuel', 'annuel', 'masse_salariale'];

        if (!in_array($type, $validTypes)) {
            return $this->errorResponse('Type de rapport invalide. Types autorisés: ' . implode(', ', $validTypes), null, 400);
        }

        try {
            if ($type === 'mensuel') {
                $mois = $request->mois ?? now()->month;
                $annee = $request->annee ?? now()->year;
                $periode = PeriodePaie::where('mois', $mois)->where('annee', $annee)->firstOrFail();

                $pdf = $this->exportService->exportRapportMensuelPDF($periode);
            } else {
                $annee = $request->annee ?? now()->year;
                $periodes = PeriodePaie::where('annee', $annee)->orderBy('mois')->get();

                $pdf = Pdf::loadView('exports.rapport-mensuel', [
                    'periode' => null,
                    'bulletins' => [],
                    'type' => $type,
                    'annee' => $annee,
                    'periodes' => $periodes,
                ]);
                $pdf->setPaper('A4', 'landscape');
                $pdf->setOptions(['defaultFont' => 'DejaVu Sans', 'isHtml5ParserEnabled' => true, 'isRemoteEnabled' => false]);
            }

            $output = $pdf->output();
            $base64 = base64_encode($output);

            $this->auditService->logExport('Rapport', 'Export PDF du rapport ' . $type);

            return $this->successResponse([
                'pdf' => $base64,
                'filename' => 'rapport_' . $type . '_' . now()->format('Ymd') . '.pdf',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export PDF: ' . $e->getMessage(), null, 500);
        }
    }

    public function exportExcel(Request $request, $type): JsonResponse
    {
        $validTypes = ['mensuel', 'annuel', 'masse_salariale'];

        if (!in_array($type, $validTypes)) {
            return $this->errorResponse('Type de rapport invalide.', null, 400);
        }

        try {
            if ($type === 'mensuel') {
                $mois = $request->mois ?? now()->month;
                $annee = $request->annee ?? now()->year;
                $periode = PeriodePaie::where('mois', $mois)->where('annee', $annee)->firstOrFail();

                $export = $this->exportService->exportRapportMensuelExcel($periode);
                $filePath = 'exports/rapport_mensuel_' . now()->format('Ymd_His') . '.xlsx';
                \Maatwebsite\Excel\Facades\Excel::store(new \App\Exports\RapportMensuelExport($periode), $filePath, 'public');

                $url = asset('storage/' . $filePath);
            } else {
                $annee = $request->annee ?? now()->year;
                $periodes = PeriodePaie::where('annee', $annee)->get();
                $filePath = 'exports/rapport_annuel_' . $annee . '_' . now()->format('Ymd_His') . '.xlsx';

                \Maatwebsite\Excel\Facades\Excel::store(new \App\Exports\AgentsExport(collect([])), $filePath, 'public');
                $url = asset('storage/' . $filePath);
            }

            $this->auditService->logExport('Rapport', 'Export Excel du rapport ' . $type);

            return $this->successResponse([
                'url' => $url,
                'filename' => 'rapport_' . $type . '_' . now()->format('Ymd') . '.xlsx',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export Excel: ' . $e->getMessage(), null, 500);
        }
    }
}
