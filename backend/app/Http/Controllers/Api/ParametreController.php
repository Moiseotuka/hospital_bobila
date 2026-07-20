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

    private const GROUP_NAMES = [1 => 'hopital', 2 => 'paie', 3 => 'taxes', 4 => 'general'];

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    private function resolveGroup($group): string
    {
        if (is_numeric($group) && isset(self::GROUP_NAMES[(int) $group])) {
            return self::GROUP_NAMES[(int) $group];
        }
        return $group;
    }

    public function index(): JsonResponse
    {
        $settings = HospitalSetting::all()->groupBy('group');

        return $this->successResponse($settings);
    }

    public function showGroup($group): JsonResponse
    {
        $group = $this->resolveGroup($group);
        $settings = HospitalSetting::where('group', $group)->get();

        if ($settings->isEmpty()) {
            return $this->errorResponse('Groupe de paramètres non trouvé.', null, 404);
        }

        $data = [];
        foreach ($settings as $setting) {
            $data[$setting->key] = $setting->value;
        }

        return $this->successResponse($data);
    }

    public function updateGroup(Request $request, $group): JsonResponse
    {
        $request->validate([
            '*' => 'required',
        ]);

        $group = $this->resolveGroup($group);

        try {
            $updated = [];
            foreach ($request->all() as $key => $value) {
                $setting = HospitalSetting::updateOrCreate(
                    ['key' => $key, 'group' => $group],
                    ['value' => $value, 'type' => 'text']
                );
                $updated[$key] = $setting->fresh()->value;
            }

            $this->auditService->logModification('Parametre', 'Mise à jour du groupe ' . $group, null, [], $request->all());

            return $this->successResponse($updated, 'Paramètres mis à jour avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour des paramètres: ' . $e->getMessage(), null, 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:100|unique:hospital_settings,key',
            'value' => 'required',
            'type' => 'sometimes|string|in:text,boolean,integer,float,json',
            'group' => 'sometimes|string|max:50',
        ]);

        try {
            $setting = HospitalSetting::create($validated);

            $this->auditService->logCreation('Parametre', 'Création du paramètre ' . $validated['key'], $setting, $validated);

            return $this->successResponse([
                'key' => $setting->key,
                'value' => $setting->value,
                'type' => $setting->type,
                'group' => $setting->group,
            ], 'Paramètre créé avec succès.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création du paramètre: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy($key): JsonResponse
    {
        try {
            $setting = HospitalSetting::where('key', $key)->firstOrFail();
            $setting->delete();

            $this->auditService->logSuppression('Parametre', 'Suppression du paramètre ' . $key, $setting, $setting->toArray());

            return $this->successResponse(null, 'Paramètre supprimé avec succès.');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression du paramètre: ' . $e->getMessage(), null, 500);
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
