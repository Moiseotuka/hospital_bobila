<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BulletinPaieResource;
use App\Models\BulletinPaie;
use App\Services\AuditService;
use App\Services\ExportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BulletinController extends Controller
{
    protected AuditService $auditService;
    protected ExportService $exportService;

    public function __construct(AuditService $auditService, ExportService $exportService)
    {
        $this->auditService = $auditService;
        $this->exportService = $exportService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = BulletinPaie::with(['agent.grade', 'agent.fonction', 'periodePaie', 'paiement']);

        if ($request->agent_id) {
            $query->where('agent_id', $request->agent_id);
        }

        if ($request->periode_paie_id) {
            $query->where('periode_paie_id', $request->periode_paie_id);
        }

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom_complet', 'like', "%{$search}%")
                  ->orWhere('matricule', 'like', "%{$search}%");
            });
        }

        $bulletins = $query->orderBy('created_at', 'desc')->paginate(15);

        return $this->successResponse($bulletins->through(fn($b) => new BulletinPaieResource($b)));
    }

    public function show($id): JsonResponse
    {
        $bulletin = BulletinPaie::with(['agent.grade', 'agent.fonction', 'agent.departement', 'agent.service', 'periodePaie', 'paiement'])->findOrFail($id);

        return $this->successResponse(new BulletinPaieResource($bulletin));
    }

    public function downloadPDF($id): JsonResponse
    {
        try {
            $bulletin = BulletinPaie::with(['agent.grade', 'agent.fonction', 'agent.departement', 'agent.service', 'periodePaie'])->findOrFail($id);

            $pdf = $this->exportService->exportBulletinPDF($bulletin);
            $output = $pdf->output();
            $base64 = base64_encode($output);

            $this->auditService->logImpression('Bulletin', 'Téléchargement du bulletin PDF de ' . $bulletin->nom_complet, $bulletin);

            return $this->successResponse([
                'pdf' => $base64,
                'filename' => 'bulletin_paie_' . $bulletin->matricule . '_' . $bulletin->periodePaie->mois . '_' . $bulletin->periodePaie->annee . '.pdf',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la génération du PDF: ' . $e->getMessage(), null, 500);
        }
    }

    public function print($id): JsonResponse
    {
        try {
            $bulletin = BulletinPaie::with(['agent.grade', 'agent.fonction', 'agent.departement', 'agent.service', 'periodePaie'])->findOrFail($id);

            $pdf = $this->exportService->exportBulletinPDF($bulletin);
            $output = $pdf->output();
            $base64 = base64_encode($output);

            $this->auditService->logImpression('Bulletin', 'Impression du bulletin de ' . $bulletin->nom_complet, $bulletin);

            return $this->successResponse([
                'pdf' => $base64,
                'filename' => 'bulletin_paie_' . $bulletin->matricule . '_' . $bulletin->periodePaie->mois . '_' . $bulletin->periodePaie->annee . '.pdf',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la génération pour impression: ' . $e->getMessage(), null, 500);
        }
    }

    public function sendByEmail($id): JsonResponse
    {
        try {
            $bulletin = BulletinPaie::with(['agent', 'periodePaie'])->findOrFail($id);

            if (!$bulletin->agent || !$bulletin->agent->email) {
                return $this->errorResponse('Cet agent n\'a pas d\'adresse email renseignée.', null, 400);
            }

            $pdf = $this->exportService->exportBulletinPDF($bulletin);

            Mail::send([], [], function ($message) use ($bulletin, $pdf) {
                $message->to($bulletin->agent->email)
                    ->subject('Bulletin de Paie - ' . $bulletin->nom_complet . ' - ' . $bulletin->periodePaie->mois . '/' . $bulletin->periodePaie->annee)
                    ->attachData($pdf->output(), 'bulletin_paie.pdf', ['mime' => 'application/pdf'])
                    ->setBody('<p>Bonjour ' . $bulletin->nom_complet . ',</p><p>Veuillez trouver ci-joint votre bulletin de paie pour la période ' . $bulletin->periodePaie->mois . '/' . $bulletin->periodePaie->annee . '.</p><p>Cordialement,<br>Département RH</p>', 'text/html');
            });

            $this->auditService->log('envoi_email', 'Bulletin', 'Envoi du bulletin par email à ' . $bulletin->agent->email, $bulletin);

            return $this->successResponse(null, 'Bulletin envoyé par email à ' . $bulletin->agent->email);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'envoi de l\'email: ' . $e->getMessage(), null, 500);
        }
    }
}
