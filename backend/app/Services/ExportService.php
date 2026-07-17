<?php

namespace App\Services;

use App\Exports\AgentsExport;
use App\Exports\RapportMensuelExport;
use App\Models\BulletinPaie;
use App\Models\PeriodePaie;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class ExportService
{
    public function exportBulletinPDF(BulletinPaie $bulletin): \Barryvdh\DomPDF\PDF
    {
        $bulletin->load(['agent.grade', 'agent.fonction', 'agent.departement', 'agent.service', 'periodePaie']);

        $pdf = Pdf::loadView('exports.bulletin-paie', [
            'bulletin' => $bulletin,
        ]);

        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'defaultFont' => 'DejaVu Sans',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => false,
        ]);

        return $pdf;
    }

    public function exportRapportMensuelPDF(PeriodePaie $periode): \Barryvdh\DomPDF\PDF
    {
        $periode->load(['bulletinsPaie.agent.grade', 'bulletinsPaie.agent.fonction']);

        $pdf = Pdf::loadView('exports.rapport-mensuel', [
            'periode' => $periode,
            'bulletins' => $periode->bulletinsPaie,
        ]);

        $pdf->setPaper('A4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'DejaVu Sans',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => false,
        ]);

        return $pdf;
    }

    public function exportListeAgentsExcel($agents): \Maatwebsite\Excel\Excel
    {
        return (new AgentsExport($agents))->download('liste_agents.xlsx');
    }

    public function exportRapportMensuelExcel(PeriodePaie $periode): \Maatwebsite\Excel\Excel
    {
        return (new RapportMensuelExport($periode))->download('rapport_mensuel_' . $periode->mois . '_' . $periode->annee . '.xlsx');
    }
}
