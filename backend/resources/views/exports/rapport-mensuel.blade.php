<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport Mensuel de Paie</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 9px; color: #333; }
        .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #1a5276; padding-bottom: 8px; }
        .header h1 { color: #1a5276; font-size: 14px; margin: 0 0 3px 0; }
        .header h2 { color: #2e86c1; font-size: 12px; margin: 0; }
        .header p { margin: 2px 0; font-size: 10px; color: #666; }
        .summary { margin-bottom: 15px; }
        .summary table { width: 100%; border-collapse: collapse; }
        .summary td { padding: 4px 8px; border: 1px solid #ddd; font-size: 10px; }
        .summary td.label { background: #f8f9fa; font-weight: bold; width: 25%; }
        .summary td.amount { text-align: right; font-weight: bold; }
        .main-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .main-table th { background: #2e86c1; color: white; padding: 4px 6px; font-size: 9px; text-align: center; }
        .main-table td { padding: 3px 6px; border: 1px solid #ddd; font-size: 9px; text-align: center; }
        .main-table tr:nth-child(even) { background: #f8f9fa; }
        .main-table tr.total-row { background: #eaf2f8; font-weight: bold; }
        .main-table td.right { text-align: right; }
        .main-table td.left { text-align: left; }
        .footer { text-align: center; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 8px; font-size: 8px; color: #888; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="header">
        <h1>HÔPITAL MILITAIRE CENTRAL CAMP KOKOLO</h1>
        <h2>RAPPORT MENSUEL DE PAIE</h2>
        <p>Période : {{ str_pad($periode->mois, 2, '0', STR_PAD_LEFT) }}/{{ $periode->annee }}</p>
        <p>Date de génération : {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <div class="summary">
        <table>
            <tr>
                <td class="label">Total Brut</td>
                <td class="amount">{{ number_format($periode->total_brut, 2, ',', ' ') }} FC</td>
                <td class="label">Total Primes</td>
                <td class="amount">{{ number_format($periode->total_primes, 2, ',', ' ') }} FC</td>
            </tr>
            <tr>
                <td class="label">Total Retenues</td>
                <td class="amount">{{ number_format($periode->total_retenues, 2, ',', ' ') }} FC</td>
                <td class="label">Total Net</td>
                <td class="amount">{{ number_format($periode->total_net, 2, ',', ' ') }} FC</td>
            </tr>
            <tr>
                <td class="label">Nombre d'agents</td>
                <td>{{ $periode->nombre_agents }}</td>
                <td class="label">Statut</td>
                <td>{{ strtoupper($periode->statut) }}</td>
            </tr>
        </table>
    </div>

    <table class="main-table">
        <thead>
            <tr>
                <th>N°</th>
                <th>Matricule</th>
                <th>Nom complet</th>
                <th>Grade</th>
                <th>Fonction</th>
                <th>Salaire Base</th>
                <th>Primes</th>
                <th>Brut</th>
                <th>Retenues</th>
                <th>Net</th>
                <th>Net à Payer</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bulletins as $index => $bulletin)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $bulletin->matricule }}</td>
                <td class="left">{{ $bulletin->nom_complet }}</td>
                <td>{{ $bulletin->grade_nom }}</td>
                <td>{{ $bulletin->fonction_nom }}</td>
                <td class="right">{{ number_format($bulletin->salaire_base, 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->total_primes, 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->salaire_brut, 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->total_retenues, 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->salaire_net, 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->net_a_payer, 2, ',', ' ') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="5" style="text-align: right">TOTAUX</td>
                <td class="right">{{ number_format($bulletins->sum('salaire_base'), 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('total_primes'), 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('salaire_brut'), 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('total_retenues'), 0, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('salaire_net'), 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('net_a_payer'), 2, ',', ' ') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Hôpital Militaire Central Camp Kokolo - Système de Gestion de Paie</p>
        <p>Document généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>
</body>
</html>
