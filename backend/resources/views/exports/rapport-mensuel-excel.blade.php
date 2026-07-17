<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport Mensuel {{ str_pad($periode->mois, 2, '0', STR_PAD_LEFT) }}/{{ $periode->annee }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #2e86c1; color: white; padding: 5px; font-size: 10px; text-align: center; }
        td { padding: 4px; border: 1px solid #ddd; font-size: 10px; text-align: center; }
        .left { text-align: left; }
        .right { text-align: right; }
        .total-row { background: #eaf2f8; font-weight: bold; }
        .header { background: #1a5276; color: white; text-align: center; padding: 10px; font-size: 14px; font-weight: bold; }
    </style>
</head>
<body>
    <table>
        <tr><td colspan="11" class="header">Rapport Mensuel de Paie - {{ str_pad($periode->mois, 2, '0', STR_PAD_LEFT) }}/{{ $periode->annee }}</td></tr>
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
                <td class="right">{{ number_format($bulletin->salaire_base, 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->total_primes, 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->salaire_brut, 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->total_retenues, 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->salaire_net, 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletin->net_a_payer, 2, ',', ' ') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="5" style="text-align: right">TOTAUX</td>
                <td class="right">{{ number_format($bulletins->sum('salaire_base'), 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('total_primes'), 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('salaire_brut'), 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('total_retenues'), 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('salaire_net'), 2, ',', ' ') }}</td>
                <td class="right">{{ number_format($bulletins->sum('net_a_payer'), 2, ',', ' ') }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
