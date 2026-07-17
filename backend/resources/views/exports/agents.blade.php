<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Liste des Agents</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 9px; }
        .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #1a5276; padding-bottom: 8px; }
        .header h1 { color: #1a5276; font-size: 14px; margin: 0 0 3px 0; }
        .header p { margin: 2px 0; font-size: 10px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th { background: #2e86c1; color: white; padding: 4px 6px; font-size: 9px; text-align: center; }
        td { padding: 3px 6px; border: 1px solid #ddd; font-size: 9px; text-align: center; }
        tr:nth-child(even) { background: #f8f9fa; }
        td.left { text-align: left; }
        .total-row { background: #eaf2f8; font-weight: bold; }
        .footer { text-align: center; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 8px; font-size: 8px; color: #888; }
    </style>
</head>
<body>
    <div class="header">
        <h1>HÔPITAL MILITAIRE CENTRAL CAMP KOKOLO</h1>
        <p>LISTE DES AGENTS</p>
        <p>Date de génération : {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>N°</th>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Postnom</th>
                <th>Prénom</th>
                <th>Sexe</th>
                <th>Statut</th>
                <th>Grade</th>
                <th>Fonction</th>
                <th>Département</th>
                <th>Situation</th>
                <th>Téléphone</th>
            </tr>
        </thead>
        <tbody>
            @foreach($agents as $index => $agent)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $agent->matricule }}</td>
                <td class="left">{{ $agent->nom }}</td>
                <td class="left">{{ $agent->postnom }}</td>
                <td class="left">{{ $agent->prenom }}</td>
                <td>{{ $agent->sexe }}</td>
                <td>{{ $agent->statut }}</td>
                <td>{{ $agent->grade?->nom }}</td>
                <td>{{ $agent->fonction?->nom }}</td>
                <td class="left">{{ $agent->departement?->nom }}</td>
                <td>{{ $agent->situation }}</td>
                <td>{{ $agent->telephone }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="12" style="text-align: right">Total : {{ $agents->count() }} agent(s)</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Hôpital Militaire Central Camp Kokolo - Système de Gestion de Paie</p>
    </div>
</body>
</html>
