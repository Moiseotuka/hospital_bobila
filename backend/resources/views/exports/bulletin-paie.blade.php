<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bulletin de Paie - {{ $bulletin->nom_complet }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a5276; padding-bottom: 10px; }
        .header h1 { color: #1a5276; font-size: 16px; margin: 0 0 5px 0; }
        .header h2 { color: #2e86c1; font-size: 13px; margin: 0; }
        .header p { margin: 2px 0; font-size: 10px; color: #666; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .info-table td { padding: 3px 8px; border: 1px solid #ddd; font-size: 10px; }
        .info-table td.label { background: #f8f9fa; font-weight: bold; width: 25%; }
        .section-title { background: #1a5276; color: white; padding: 5px 10px; font-size: 11px; font-weight: bold; margin: 15px 0 5px 0; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .details-table th { background: #2e86c1; color: white; padding: 5px 8px; font-size: 10px; text-align: left; }
        .details-table td { padding: 4px 8px; border: 1px solid #ddd; font-size: 10px; }
        .details-table tr:nth-child(even) { background: #f8f9fa; }
        .total-row { font-weight: bold; background: #eaf2f8 !important; }
        .net-row { font-weight: bold; background: #d4efdf !important; font-size: 12px; }
        .footer { text-align: center; margin-top: 25px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #888; }
        .qr-code { text-align: right; margin-bottom: 10px; }
        .solde { text-align: right; font-size: 14px; color: #1a5276; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="qr-code">
        @if($bulletin->qr_code)
            <img src="data:image/png;base64,{{ $bulletin->qr_code }}" width="80" height="80">
        @endif
    </div>

    <div class="header">
        <h1>HÔPITAL MILITAIRE CENTRAL CAMP KOKOLO</h1>
        <h2>BULLETIN DE PAIE</h2>
        <p>Période : {{ str_pad($bulletin->periodePaie->mois, 2, '0', STR_PAD_LEFT) }}/{{ $bulletin->periodePaie->annee }}</p>
        <p>Date d'émission : {{ $bulletin->date_generation->format('d/m/Y H:i') }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Matricule</td>
            <td>{{ $bulletin->matricule }}</td>
            <td class="label">Grade</td>
            <td>{{ $bulletin->grade_nom }}</td>
        </tr>
        <tr>
            <td class="label">Nom complet</td>
            <td>{{ $bulletin->nom_complet }}</td>
            <td class="label">Fonction</td>
            <td>{{ $bulletin->fonction_nom }}</td>
        </tr>
        <tr>
            <td class="label">Département</td>
            <td>{{ $bulletin->departement_nom }}</td>
            <td class="label">Service</td>
            <td>{{ $bulletin->service_nom }}</td>
        </tr>
    </table>

    <div class="section-title">SALAIRE DE BASE</div>
    <table class="details-table">
        <tr><th>Libellé</th><th style="text-align: right">Montant (FC)</th></tr>
        <tr><td>Salaire de base</td><td style="text-align: right">{{ number_format($bulletin->salaire_base, 2, ',', ' ') }}</td></tr>
        <tr class="total-row"><td>Salaire Brut</td><td style="text-align: right">{{ number_format($bulletin->salaire_brut, 2, ',', ' ') }}</td></tr>
    </table>

    <div class="section-title">PRIMES</div>
    <table class="details-table">
        <tr><th>Code</th><th>Prime</th><th>Type</th><th style="text-align: right">Montant (FC)</th></tr>
        @forelse($bulletin->primes_detail ?? [] as $prime)
            <tr>
                <td>{{ $prime['code'] ?? '' }}</td>
                <td>{{ $prime['nom'] ?? '' }}</td>
                <td>{{ $prime['type'] ?? '' }}</td>
                <td style="text-align: right">{{ number_format($prime['montant'] ?? 0, 2, ',', ' ') }}</td>
            </tr>
        @empty
            <tr><td colspan="4" style="text-align: center">Aucune prime</td></tr>
        @endforelse
        <tr class="total-row"><td colspan="3">Total Primes</td><td style="text-align: right">{{ number_format($bulletin->total_primes, 2, ',', ' ') }}</td></tr>
    </table>

    <div class="section-title">RETENUES</div>
    <table class="details-table">
        <tr><th>Code</th><th>Retenue</th><th>Type</th><th style="text-align: right">Montant (FC)</th></tr>
        @forelse($bulletin->retenues_detail ?? [] as $retenue)
            <tr>
                <td>{{ $retenue['code'] ?? '' }}</td>
                <td>{{ $retenue['nom'] ?? '' }}</td>
                <td>{{ $retenue['type'] ?? '' }}</td>
                <td style="text-align: right">{{ number_format($retenue['montant'] ?? 0, 2, ',', ' ') }}</td>
            </tr>
        @empty
            <tr><td colspan="4" style="text-align: center">Aucune retenue</td></tr>
        @endforelse
        <tr class="total-row"><td colspan="3">Total Retenues</td><td style="text-align: right">{{ number_format($bulletin->total_retenues, 2, ',', ' ') }}</td></tr>
    </table>

    <table class="details-table">
        <tr class="net-row">
            <td colspan="3" style="text-align: right; font-size: 12px;">NET À PAYER</td>
            <td style="text-align: right; font-size: 14px; color: #1a5276;">
                {{ number_format($bulletin->net_a_payer, 2, ',', ' ') }} FC
            </td>
        </tr>
    </table>

    <div class="solde">
        <strong>Arrêté le présent bulletin à la somme de :</strong>
        {{ number_format($bulletin->net_a_payer, 2, ',', ' ') }} Francs Congolais
    </div>

    <div class="footer">
        <p>Ce bulletin est généré électroniquement et fait foi de paiement</p>
        <p>Hôpital Militaire Central Camp Kokolo - Système de Gestion de Paie</p>
        <p>Document généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>
</body>
</html>
