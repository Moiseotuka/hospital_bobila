<?php

namespace App\Services;

use App\Enums\StatutPaiementEnum;
use App\Models\BulletinPaie;
use App\Models\Paiement;
use App\Models\PeriodePaie;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaiementService
{
    public function effectuerPaiement(BulletinPaie $bulletin, array $data): Paiement
    {
        return DB::transaction(function () use ($bulletin, $data) {
            $reference = $data['reference'] ?? $this->genererReference();

            $paiement = Paiement::create([
                'bulletin_paie_id' => $bulletin->id,
                'agent_id' => $bulletin->agent_id,
                'periode_paie_id' => $bulletin->periode_paie_id,
                'montant' => $bulletin->net_a_payer,
                'date_paiement' => $data['date_paiement'] ?? Carbon::today(),
                'mode_paiement' => $data['mode_paiement'],
                'reference' => $reference,
                'banque' => $data['banque'] ?? $bulletin->agent?->banque,
                'statut' => StatutPaiementEnum::PAYE->value,
                'motif_annulation' => null,
                'traite_par' => Auth::id(),
            ]);

            if ($bulletin->periodePaie) {
                $bulletin->periodePaie->increment('total_net', $paiement->montant * -1);
            }

            return $paiement;
        });
    }

    public function effectuerPaiementCollectif(PeriodePaie $periode, array $data): Collection
    {
        return DB::transaction(function () use ($periode, $data) {
            $bulletins = $periode->bulletinsPaie()
                ->whereDoesntHave('paiement', function ($query) {
                    $query->where('statut', StatutPaiementEnum::PAYE->value);
                })
                ->get();

            $paiements = new Collection();

            foreach ($bulletins as $bulletin) {
                $paiement = $this->effectuerPaiement($bulletin, $data);
                $paiements->push($paiement);
            }

            return $paiements;
        });
    }

    public function annulerPaiement(Paiement $paiement, string $motif): bool
    {
        return DB::transaction(function () use ($paiement, $motif) {
            $paiement->update([
                'statut' => StatutPaiementEnum::ANNULE->value,
                'motif_annulation' => $motif,
            ]);

            return true;
        });
    }

    public function verifierStatutPaiements(PeriodePaie $periode): array
    {
        $totalBulletins = $periode->bulletinsPaie()->count();
        $payes = Paiement::where('periode_paie_id', $periode->id)
            ->where('statut', StatutPaiementEnum::PAYE->value)
            ->count();
        $enAttente = Paiement::where('periode_paie_id', $periode->id)
            ->where('statut', StatutPaiementEnum::EN_ATTENTE->value)
            ->count();
        $annules = Paiement::where('periode_paie_id', $periode->id)
            ->where('statut', StatutPaiementEnum::ANNULE->value)
            ->count();

        $nonPayes = $totalBulletins - $payes - $enAttente - $annules;

        return [
            'total_bulletins' => $totalBulletins,
            'payes' => $payes,
            'en_attente' => $enAttente,
            'annules' => $annules,
            'non_payes' => max($nonPayes, 0),
            'taux_paiement' => $totalBulletins > 0
                ? round(($payes / $totalBulletins) * 100, 2)
                : 0,
            'montant_total_paye' => Paiement::where('periode_paie_id', $periode->id)
                ->where('statut', StatutPaiementEnum::PAYE->value)
                ->sum('montant'),
        ];
    }

    private function genererReference(): string
    {
        $prefix = 'PAY-' . now()->format('Ymd');
        $suffix = strtoupper(Str::random(6));
        $reference = $prefix . '-' . $suffix;

        while (Paiement::where('reference', $reference)->exists()) {
            $suffix = strtoupper(Str::random(6));
            $reference = $prefix . '-' . $suffix;
        }

        return $reference;
    }
}
