<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HospitalSetting;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ParametreController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(): JsonResponse
    {
        $settings = HospitalSetting::all()->groupBy('group');

        return $this->successResponse($settings);
    }

    public function show($key): JsonResponse
    {
        $setting = HospitalSetting::where('key', $key)->first();

        if (!$setting) {
            return $this->errorResponse('Paramètre non trouvé.', null, 404);
        }

        return $this->successResponse([
            'key' => $setting->key,
            'value' => $setting->value,
            'type' => $setting->type,
            'group' => $setting->group,
        ]);
    }

    public function update(Request $request, $key): JsonResponse
    {
        $validated = $request->validate([
            'value' => 'required',
            'type' => 'sometimes|string|in:text,boolean,integer,float,json',
            'group' => 'sometimes|string|max:50',
        ]);

        try {
            $setting = HospitalSetting::where('key', $key)->first();

            if (!$setting) {
                return $this->errorResponse('Paramètre non trouvé.', null, 404);
            }

            $ancienneValeur = $setting->value;
            $setting->update($validated);

            $this->auditService->logModification('Parametre', 'Modification du paramètre ' . $key, $setting, ['key' => $key, 'value' => $ancienneValeur], ['key' => $key, 'value' => $validated['value']]);

            return $this->successResponse([
                'key' => $setting->key,
                'value' => $setting->fresh()->value,
                'type' => $setting->type,
                'group' => $setting->group,
            ], 'Paramètre mis à jour avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour du paramètre: ' . $e->getMessage(), null, 500);
        }
    }

    public function updateLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        ]);

        try {
            $path = $request->file('logo')->store('parametres', 'public');

            $setting = HospitalSetting::updateOrCreate(
                ['key' => 'hopital_logo'],
                ['value' => $path, 'type' => 'text', 'group' => 'hopital']
            );

            $this->auditService->log('modification', 'Parametre', 'Mise à jour du logo de l\'hôpital', $setting);

            return $this->successResponse([
                'key' => 'hopital_logo',
                'url' => asset('storage/' . $path),
            ], 'Logo mis à jour avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour du logo: ' . $e->getMessage(), null, 500);
        }
    }

    public function updateSignature(Request $request): JsonResponse
    {
        $request->validate([
            'signature' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
        ]);

        try {
            $path = $request->file('signature')->store('parametres', 'public');

            $setting = HospitalSetting::updateOrCreate(
                ['key' => 'signature_rh'],
                ['value' => $path, 'type' => 'text', 'group' => 'hopital']
            );

            $this->auditService->log('modification', 'Parametre', 'Mise à jour de la signature RH', $setting);

            return $this->successResponse([
                'key' => 'signature_rh',
                'url' => asset('storage/' . $path),
            ], 'Signature mise à jour avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de la signature: ' . $e->getMessage(), null, 500);
        }
    }

    public function updateCachet(Request $request): JsonResponse
    {
        $request->validate([
            'cachet' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
        ]);

        try {
            $path = $request->file('cachet')->store('parametres', 'public');

            $setting = HospitalSetting::updateOrCreate(
                ['key' => 'cachet_hopital'],
                ['value' => $path, 'type' => 'text', 'group' => 'hopital']
            );

            $this->auditService->log('modification', 'Parametre', 'Mise à jour du cachet de l\'hôpital', $setting);

            return $this->successResponse([
                'key' => 'cachet_hopital',
                'url' => asset('storage/' . $path),
            ], 'Cachet mis à jour avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour du cachet: ' . $e->getMessage(), null, 500);
        }
    }
}
