<?php

namespace App\Http\Controllers\Api;

use App\Exports\AgentsExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAgentRequest;
use App\Http\Requests\UpdateAgentRequest;
use App\Http\Resources\AgentCollection;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use App\Services\AuditService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class AgentController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Agent::with(['grade', 'fonction', 'departement', 'service', 'categorieSalariale']);

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('matricule', 'like', "%{$search}%");
            });
        }

        if ($request->departement_id) {
            $query->where('departement_id', $request->departement_id);
        }

        if ($request->service_id) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->grade_id) {
            $query->where('grade_id', $request->grade_id);
        }

        if ($request->fonction_id) {
            $query->where('fonction_id', $request->fonction_id);
        }

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        if ($request->situation) {
            $query->where('situation', $request->situation);
        }

        $agents = $query->orderBy('created_at', 'desc')->paginate(15);

        return $this->successResponse(new AgentCollection($agents));
    }

    public function store(StoreAgentRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('photo')) {
                $data['photo'] = $request->file('photo')->store('agents/photos', 'public');
            }

            $data['is_active'] = true;

            $agent = Agent::create($data);

            $this->auditService->logCreation('Agent', 'Création de l\'agent ' . $agent->nom_complet, $agent, $data);

            return $this->successResponse(
                new AgentResource($agent->load(['grade', 'fonction', 'departement', 'service', 'categorieSalariale'])),
                'Agent créé avec succès.',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'agent: ' . $e->getMessage(), null, 500);
        }
    }

    public function show($id): JsonResponse
    {
        $agent = Agent::with(['grade', 'fonction', 'departement', 'service', 'categorieSalariale'])->findOrFail($id);

        return $this->successResponse(new AgentResource($agent));
    }

    public function update($id, UpdateAgentRequest $request): JsonResponse
    {
        try {
            $agent = Agent::findOrFail($id);
            $anciennes = $agent->toArray();

            $data = $request->validated();

            if ($request->hasFile('photo')) {
                if ($agent->photo) {
                    Storage::disk('public')->delete($agent->photo);
                }
                $data['photo'] = $request->file('photo')->store('agents/photos', 'public');
            }

            $agent->update($data);

            $this->auditService->logModification('Agent', 'Modification de l\'agent ' . $agent->nom_complet, $agent, $anciennes, $agent->fresh()->toArray());

            return $this->successResponse(
                new AgentResource($agent->fresh()->load(['grade', 'fonction', 'departement', 'service', 'categorieSalariale'])),
                'Agent modifié avec succès.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la modification de l\'agent: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $agent = Agent::findOrFail($id);
            $agentData = $agent->toArray();
            $agent->delete();

            $this->auditService->logSuppression('Agent', 'Suppression de l\'agent ' . $agent->nom_complet, $agent, $agentData);

            return $this->successResponse(null, 'Agent supprimé avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'agent: ' . $e->getMessage(), null, 500);
        }
    }

    public function restore($id): JsonResponse
    {
        try {
            $agent = Agent::withTrashed()->findOrFail($id);
            $agent->restore();

            $this->auditService->log('restauration', 'Agent', 'Restauration de l\'agent ' . $agent->nom_complet, $agent);

            return $this->successResponse(
                new AgentResource($agent->load(['grade', 'fonction', 'departement', 'service', 'categorieSalariale'])),
                'Agent restauré avec succès.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la restauration de l\'agent: ' . $e->getMessage(), null, 500);
        }
    }

    public function exportPDF(Request $request): JsonResponse
    {
        $agents = Agent::with(['grade', 'fonction', 'departement', 'service'])->get();

        $pdf = Pdf::loadView('exports.agents', ['agents' => $agents]);
        $pdf->setPaper('A4', 'landscape');
        $pdf->setOptions(['defaultFont' => 'DejaVu Sans', 'isHtml5ParserEnabled' => true, 'isRemoteEnabled' => false]);

        $this->auditService->logExport('Agent', 'Export PDF de la liste des agents');

        $output = $pdf->output();
        $base64 = base64_encode($output);

        return $this->successResponse([
            'pdf' => $base64,
            'filename' => 'liste_agents.pdf',
        ]);
    }

    public function exportExcel(Request $request): JsonResponse
    {
        $agents = Agent::with(['grade', 'fonction', 'departement', 'service'])->get();

        $this->auditService->logExport('Agent', 'Export Excel de la liste des agents');

        $export = new AgentsExport($agents);
        $filePath = 'exports/agents_' . now()->format('Ymd_His') . '.xlsx';
        Excel::store($export, $filePath, 'public');

        return $this->successResponse([
            'url' => asset('storage/' . $filePath),
            'filename' => 'liste_agents.xlsx',
        ]);
    }

    public function stats(): JsonResponse
    {
        $total = Agent::count();
        $actifs = Agent::actifs()->count();
        $suspendus = Agent::where('situation', 'suspendu')->count();
        $retraites = Agent::where('situation', 'retraite')->count();
        $decedes = Agent::where('situation', 'decede')->count();

        $parGrade = Agent::selectRaw('grade_id, count(*) as total')
            ->groupBy('grade_id')
            ->with('grade:id,nom')
            ->get()
            ->map(fn($item) => [
                'grade' => $item->grade?->nom,
                'total' => $item->total,
            ]);

        $parDepartement = Agent::selectRaw('departement_id, count(*) as total')
            ->groupBy('departement_id')
            ->with('departement:id,nom')
            ->get()
            ->map(fn($item) => [
                'departement' => $item->departement?->nom,
                'total' => $item->total,
            ]);

        $parSituation = Agent::selectRaw('situation, count(*) as total')
            ->groupBy('situation')
            ->get()
            ->pluck('total', 'situation');

        $militaires = Agent::militaires()->count();
        $civils = Agent::civils()->count();

        return $this->successResponse([
            'total' => $total,
            'actifs' => $actifs,
            'suspendus' => $suspendus,
            'retraites' => $retraites,
            'decedes' => $decedes,
            'militaires' => $militaires,
            'civils' => $civils,
            'par_grade' => $parGrade,
            'par_departement' => $parDepartement,
            'par_situation' => $parSituation,
        ]);
    }
}
