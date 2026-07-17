<?php

namespace App\Exports;

use App\Models\PeriodePaie;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class RapportMensuelExport implements FromView, WithTitle, ShouldAutoSize
{
    protected $periode;

    public function __construct(PeriodePaie $periode)
    {
        $this->periode = $periode->load('bulletinsPaie.agent.grade', 'bulletinsPaie.agent.fonction');
    }

    public function view(): View
    {
        return view('exports.rapport-mensuel-excel', [
            'periode' => $this->periode,
            'bulletins' => $this->periode->bulletinsPaie,
        ]);
    }

    public function title(): string
    {
        $mois = str_pad($this->periode->mois, 2, '0', STR_PAD_LEFT);
        return 'Rapport ' . $mois . '/' . $this->periode->annee;
    }
}
