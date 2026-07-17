<?php

namespace App\Services;

use App\Models\Agent;
use App\Models\BulletinPaie;
use App\Models\PeriodePaie;
use App\Models\Prime;
use App\Models\Retenue;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CalculPaieService
{
    private const TAUX_IMPOT = 0.15;
    private const TAUX_CNSS = 0.035;
    private const SEUIL_IMPOT = 500000;

    public function calculerSalaireBrut(Agent $agent): float
    {
        $base = 0;

        if ($agent->grade) {
            $base += $agent->grade->salaire_base;
        }

        if ($agent->grade) {
            $base += $agent->grade->prime;
        }

        if ($agent->fonction) {
            $base += $agent->fonction->prime_fonction;
        }

        if ($agent->categorieSalariale) {
            $base += $agent->categorieSalariale->indemnites;
        }

        return round($base, 2);
    }

    public function calculerTotalPrimes(Agent $agent, array $primesSupplementaires = []): float
    {
        $total = 0;

        $primesActives = Prime::where('is_active', true)->get();

        foreach ($primesActives as $prime) {
            if ($prime->est_pourcentage) {
                $salaireBase = $agent->grade ? $agent->grade->salaire_base : 0;
                $total += $salaireBase * ($prime->pourcentage / 100);
            } else {
                $total += $prime->montant;
            }
        }

        foreach ($primesSupplementaires as $primeData) {
            $montant = $primeData['montant'] ?? 0;
            $total += $montant;
        }

        return round($total, 2);
    }

    public function calculerTotalRetenues(Agent $agent, float $salaireBrut): float
    {
        $total = 0;

        $impot = $this->calculerImpot($salaireBrut);
        $total += $impot;

        $cnss = $this->calculerCnss($salaireBrut);
        $total += $cnss;

        $retenuesActives = Retenue::where('is_active', true)
            ->where('type', '!=', 'impot')
            ->where('type', '!=', 'cnss')
            ->get();

        foreach ($retenuesActives as $retenue) {
            if ($retenue->est_pourcentage && $retenue->pourcentage) {
                $total += $salaireBrut * ($retenue->pourcentage / 100);
            } elseif ($retenue->montant) {
                $total += $retenue->montant;
            }
        }

        return round($total, 2);
    }

    private function calculerImpot(float $salaireBrut): float
    {
        if ($salaireBrut <= self::SEUIL_IMPOT) {
            return 0;
        }
        $imposable = $salaireBrut - self::SEUIL_IMPOT;
        return round($imposable * self::TAUX_IMPOT, 2);
    }

    private function calculerCnss(float $salaireBrut): float
    {
        $plafondCnss = 5000000;
        $baseCnss = min($salaireBrut, $plafondCnss);
        return round($baseCnss * self::TAUX_CNSS, 2);
    }

    public function calculerSalaireNet(float $brut, float $totalPrimes, float $totalRetenues): float
    {
        $net = ($brut + $totalPrimes) - $totalRetenues;
        return round(max($net, 0), 2);
    }

    public function calculerNetAPayer(float $salaireNet): float
    {
        return round($salaireNet, 2);
    }

    public function genererBulletin(Agent $agent, PeriodePaie $periode, array $options = []): BulletinPaie
    {
        $salaireBase = $agent->grade ? $agent->grade->salaire_base : 0;

        $primesSupplementaires = $options['primes_supplementaires'] ?? [];
        $totalPrimes = $this->calculerTotalPrimes($agent, $primesSupplementaires);

        $salaireBrut = $this->calculerSalaireBrut($agent);
        $totalRetenues = $this->calculerTotalRetenues($agent, $salaireBrut);

        $salaireNet = $this->calculerSalaireNet($salaireBrut, $totalPrimes, $totalRetenues);
        $netAPayer = $this->calculerNetAPayer($salaireNet);

        $primesDetail = [];
        foreach (Prime::where('is_active', true)->get() as $prime) {
            $primesDetail[] = [
                'id' => $prime->id,
                'code' => $prime->code,
                'nom' => $prime->nom,
                'type' => $prime->type,
                'montant' => $prime->est_pourcentage
                    ? round($salaireBase * ($prime->pourcentage / 100), 2)
                    : $prime->montant,
                'est_pourcentage' => $prime->est_pourcentage,
                'pourcentage' => $prime->pourcentage,
            ];
        }

        foreach ($primesSupplementaires as $extra) {
            $primesDetail[] = [
                'code' => $extra['code'] ?? 'EXTRA',
                'nom' => $extra['nom'] ?? 'Prime supplémentaire',
                'type' => $extra['type'] ?? 'exceptionnelle',
                'montant' => $extra['montant'] ?? 0,
                'est_pourcentage' => false,
                'pourcentage' => null,
            ];
        }

        $retenuesDetail = [];
        foreach (Retenue::where('is_active', true)->get() as $retenue) {
            $montant = 0;
            if ($retenue->type === 'impot') {
                $montant = $this->calculerImpot($salaireBrut);
            } elseif ($retenue->type === 'cnss') {
                $montant = $this->calculerCnss($salaireBrut);
            } elseif ($retenue->est_pourcentage && $retenue->pourcentage) {
                $montant = round($salaireBrut * ($retenue->pourcentage / 100), 2);
            } elseif ($retenue->montant) {
                $montant = $retenue->montant;
            }

            $retenuesDetail[] = [
                'id' => $retenue->id,
                'code' => $retenue->code,
                'nom' => $retenue->nom,
                'type' => $retenue->type,
                'montant' => $montant,
                'est_pourcentage' => $retenue->est_pourcentage,
                'pourcentage' => $retenue->pourcentage,
            ];
        }

        $bulletin = BulletinPaie::create([
            'agent_id' => $agent->id,
            'periode_paie_id' => $periode->id,
            'matricule' => $agent->matricule,
            'nom_complet' => $agent->nom_complet,
            'grade_nom' => $agent->grade?->nom,
            'fonction_nom' => $agent->fonction?->nom,
            'departement_nom' => $agent->departement?->nom,
            'service_nom' => $agent->service?->nom,
            'salaire_base' => $salaireBase,
            'total_primes' => $totalPrimes,
            'total_retenues' => $totalRetenues,
            'salaire_brut' => $salaireBrut,
            'salaire_net' => $salaireNet,
            'net_a_payer' => $netAPayer,
            'primes_detail' => $primesDetail,
            'retenues_detail' => $retenuesDetail,
            'date_generation' => Carbon::now(),
            'est_valide' => false,
            'est_verrouille' => false,
        ]);

        return $bulletin;
    }

    public function genererPaieMensuelle(PeriodePaie $periode): void
    {
        DB::transaction(function () use ($periode) {
            $agents = Agent::actifs()->where('is_active', true)->get();

            $totalBrut = 0;
            $totalPrimes = 0;
            $totalRetenues = 0;
            $totalNet = 0;
            $nombreAgents = 0;

            foreach ($agents as $agent) {
                $bulletin = $this->genererBulletin($agent, $periode);

                $totalBrut += $bulletin->salaire_brut;
                $totalPrimes += $bulletin->total_primes;
                $totalRetenues += $bulletin->total_retenues;
                $totalNet += $bulletin->net_a_payer;
                $nombreAgents++;
            }

            $periode->update([
                'statut' => 'generé',
                'total_brut' => round($totalBrut, 2),
                'total_primes' => round($totalPrimes, 2),
                'total_retenues' => round($totalRetenues, 2),
                'total_net' => round($totalNet, 2),
                'nombre_agents' => $nombreAgents,
            ]);
        });
    }
}
