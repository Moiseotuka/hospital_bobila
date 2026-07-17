<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class AuditController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('user:id,name,email');

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->action) {
            $query->where('action', $request->action);
        }

        if ($request->module) {
            $query->where('module', $request->module);
        }

        if ($request->date_debut) {
            $query->where('created_at', '>=', $request->date_debut);
        }

        if ($request->date_fin) {
            $query->where('created_at', '<=', $request->date_fin . ' 23:59:59');
        }

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('module', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%");
            });
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(15);

        return $this->successResponse($logs->through(fn($l) => new AuditLogResource($l)));
    }

    public function show($id): JsonResponse
    {
        $log = AuditLog::with('user:id,name,email')->findOrFail($id);

        return $this->successResponse(new AuditLogResource($log));
    }

    public function exportExcel(Request $request): JsonResponse
    {
        $query = AuditLog::with('user:id,name,email');

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->module) {
            $query->where('module', $request->module);
        }

        if ($request->date_debut) {
            $query->where('created_at', '>=', $request->date_debut);
        }

        if ($request->date_fin) {
            $query->where('created_at', '<=', $request->date_fin . ' 23:59:59');
        }

        $logs = $query->orderBy('created_at', 'desc')->get();

        $filePath = 'exports/audit_logs_' . now()->format('Ymd_His') . '.xlsx';

        Excel::store(new class($logs) implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings {
            protected $logs;

            public function __construct($logs)
            {
                $this->logs = $logs;
            }

            public function headings(): array
            {
                return ['ID', 'Utilisateur', 'Action', 'Module', 'Description', 'Adresse IP', 'Date'];
            }

            public function array(): array
            {
                return $this->logs->map(fn($log) => [
                    $log->id,
                    $log->user?->name ?? 'N/A',
                    $log->action,
                    $log->module,
                    $log->description,
                    $log->ip_address,
                    $log->created_at?->format('Y-m-d H:i:s'),
                ])->toArray();
            }
        }, $filePath, 'public');

        return $this->successResponse([
            'url' => asset('storage/' . $filePath),
            'filename' => 'audit_logs.xlsx',
        ]);
    }
}
