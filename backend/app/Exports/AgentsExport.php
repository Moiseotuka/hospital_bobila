<?php

namespace App\Exports;

use App\Models\Agent;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class AgentsExport implements FromView, WithTitle, ShouldAutoSize
{
    protected $agents;

    public function __construct($agents)
    {
        $this->agents = $agents;
    }

    public function view(): View
    {
        return view('exports.agents', [
            'agents' => $this->agents,
        ]);
    }

    public function title(): string
    {
        return 'Liste des agents';
    }
}
