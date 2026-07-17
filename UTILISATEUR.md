# Manuel d'Utilisation - Système de Gestion de Paie
## Hôpital Militaire Central Camp Kokolo

---

## Table des matières

1. [Connexion et Premier Pas](#1-connexion-et-premier-pas)
2. [Tableau de Bord](#2-tableau-de-bord)
3. [Gestion des Agents](#3-gestion-des-agents)
4. [Gestion des Grades, Fonctions, Départements](#4-gestion-des-grades-fonctions-départements)
5. [Gestion des Primes et Retenues](#5-gestion-des-primes-et-retenues)
6. [Calcul et Génération de la Paie](#6-calcul-et-génération-de-la-paie)
7. [Paiements](#7-paiements)
8. [Bulletins de Paie](#8-bulletins-de-paie)
9. [Rapports et Statistiques](#9-rapports-et-statistiques)
10. [Journal d'Audit](#10-journal-daudit)
11. [Paramètres](#11-paramètres)
12. [FAQ et Dépannage](#12-faq-et-dépannage)

---

## 1. Connexion et Premier Pas

### 1.1 Accès à l'application

1. Ouvrez votre navigateur web (Chrome, Firefox, Edge)
2. Accédez à l'URL : `https://paie.hopital-militaire.cd`
3. La page de connexion s'affiche

### 1.2 Connexion

![Page de connexion](*à insérer*)

**Étapes :**
1. Saisissez votre **adresse email** (ex : `admin@hopital-militaire.cd`)
2. Saisissez votre **mot de passe**
3. Cliquez sur le bouton **"Se connecter"**

**Accès par défaut (après installation) :**

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | `admin@hopital-militaire.cd` | `password` (à modifier) |
| Chef RH | `chef-rh@hopital-militaire.cd` | `password` (à modifier) |
| Comptable | `comptable@hopital-militaire.cd` | `password` (à modifier) |

> **Important :** Changez immédiatement votre mot de passe après la première connexion.

### 1.3 Navigation

L'interface se compose de :

- **Barre latérale** (à gauche) : Menu de navigation principal
- **Barre supérieure** : Recherche rapide, notifications, profil utilisateur
- **Zone de contenu** (au centre) : Affichage des données et actions

### 1.4 Profil utilisateur

Pour modifier votre profil :
1. Cliquez sur votre avatar ou nom dans la barre supérieure
2. Sélectionnez **"Mon profil"**
3. Modifiez vos informations (nom, email, mot de passe)
4. Cliquez sur **"Enregistrer"**

### 1.5 Déconnexion

1. Cliquez sur votre avatar
2. Sélectionnez **"Se déconnecter"**

---

## 2. Tableau de Bord

### 2.1 Présentation

Le tableau de bord est la page d'accueil après connexion. Il offre une vue d'ensemble de l'activité de paie.

![Tableau de bord](*à insérer*)

### 2.2 Indicateurs clés

La première rangée affiche 4 cartes statistiques :

| Carte | Description |
|-------|-------------|
| **Total Agents** | Nombre total d'agents enregistrés |
| **Militaires** | Nombre d'agents militaires |
| **Civils** | Nombre d'agents civils |
| **Masse Salariale du Mois** | Total des salaires nets du mois en cours |

La deuxième rangée affiche :

| Carte | Description |
|-------|-------------|
| **Paiements Effectués** | Montant total des paiements effectués |
| **En Attente** | Montant total des paiements en attente |
| **Retenues Totales** | Montant total des retenues |
| **Primes Totales** | Montant total des primes |

### 2.3 Graphiques

- **Évolution mensuelle** (graphique en lignes) : Évolution de la masse salariale sur l'année
- **Répartition par grade** (graphique circulaire) : Ventilation des agents par grade
- **Répartition par département** (graphique à barres) : Effectifs par département

### 2.4 Alertes

La section **"Alertes"** affiche :

- Agents sans compte bancaire renseigné
- Bulletins en attente de validation
- Paiements en retard
- Agents dont le contrat expire bientôt

### 2.5 Derniers paiements

Liste des 5 derniers paiements effectués avec :

- Agent concerné
- Montant
- Mode de paiement
- Date
- Statut

---

## 3. Gestion des Agents

### 3.1 Liste des agents

**Accès :** Menu latéral > Gestion > **Agents**

La page affiche la liste paginée des agents avec :

- **Colonnes** : Matricule, Nom complet, Grade, Fonction, Département, Service, Statut, Actions
- **Recherche** : Barre de recherche par matricule ou nom
- **Filtres** : Par grade, département, service, statut, type (militaire/civil)
- **Tri** : Cliquez sur les en-têtes de colonnes pour trier

### 3.2 Créer un agent

1. Cliquez sur le bouton **"+ Nouvel agent"** (haut de page)
2. Remplissez le formulaire :

**Informations personnelles :**
- Matricule (généré automatiquement ou saisi)
- Nom, Postnom, Prénom
- Sexe (Masculin / Féminin)
- Date et lieu de naissance
- État civil
- Nationalité
- Adresse, Téléphone, Email

**Informations professionnelles :**
- Type d'agent (Militaire / Civil)
- Catégorie salariale
- Grade
- Fonction
- Département
- Service
- Date d'engagement
- Date de prise de service
- Date de fin de contrat (si applicable)

**Informations bancaires (optionnel) :**
- Numéro de compte
- Banque

**Autres informations :**
- Numéro CNSS/Sécurité sociale

3. Cliquez sur **"Enregistrer"**

### 3.3 Consulter un agent

1. Cliquez sur l'icône **"👁️ Afficher"** sur la ligne de l'agent
2. La page de détail affiche :
   - Toutes les informations de l'agent
   - Aperçu du grade, fonction, département
   - Historique des bulletins de paie
   - Historique des paiements

### 3.4 Modifier un agent

1. Cliquez sur l'icône **"✏️ Modifier"**
2. Modifiez les champs nécessaires
3. Cliquez sur **"Enregistrer"**

> **Note :** La modification d'informations comme le grade ou la fonction affecte les prochains calculs de paie.

### 3.5 Supprimer un agent

1. Cliquez sur l'icône **"🗑️ Supprimer"**
2. Confirmez la suppression dans la boîte de dialogue
3. L'agent est désactivé (suppression logique)

> **Note :** La suppression est logique, l'agent peut être restauré ultérieurement.

### 3.6 Restaurer un agent

1. Utilisez l'option **"Restaurer"** depuis la vue détail d'un agent supprimé
2. L'agent est réactivé avec toutes ses données

### 3.7 Exporter la liste

- **PDF** : Cliquez sur **"PDF"** pour exporter la liste au format PDF
- **Excel** : Cliquez sur **"Excel"** pour exporter la liste au format Excel

### 3.8 Gestion par lots

Non disponible dans cette version.

---

## 4. Gestion des Grades, Fonctions, Départements

### 4.1 Grades

**Accès :** Menu latéral > Gestion > **Grades**

Les grades définissent le salaire de base des agents.

**Actions possibles :**

| Action | Description |
|--------|-------------|
| **Ajouter** | Créer un nouveau grade (code, nom, salaire de base, prime éventuelle) |
| **Modifier** | Mettre à jour le salaire de base ou la prime |
| **Supprimer** | Désactiver un grade (s'il n'est pas utilisé) |

**Champs d'un grade :**

| Champ | Description | Exemple |
|-------|-------------|---------|
| Code | Identifiant court | GRD-01 |
| Nom | Intitulé du grade | Colonel |
| Salaire de base | Salaire mensuel de base | 2 500 000 FC |
| Prime | Prime liée au grade | 500 000 FC |
| Actif | Grade utilisable | Oui/Non |

### 4.2 Fonctions

**Accès :** Menu latéral > Gestion > **Fonctions**

Les fonctions définissent les postes occupés par les agents.

**Champs d'une fonction :**

| Champ | Description | Exemple |
|-------|-------------|---------|
| Code | Identifiant court | FCT-01 |
| Nom | Intitulé de la fonction | Médecin Chef |
| Prime de fonction | Prime liée à la fonction | 300 000 FC |
| Actif | Fonction utilisable | Oui/Non |

### 4.3 Départements

**Accès :** Menu latéral > Gestion > **Départements**

Les départements représentent les grandes divisions de l'hôpital.

**Champs d'un département :**

| Champ | Description | Exemple |
|-------|-------------|---------|
| Code | Identifiant court | DEP-01 |
| Nom | Nom du département | Chirurgie |
| Chef de département | Agent responsable (optionnel) | Dr. Mukendi |
| Actif | Département utilisable | Oui/Non |

### 4.4 Services

**Accès :** Menu latéral > Gestion > **Services**

Les services sont rattachés à un département.

**Champs d'un service :**

| Champ | Description | Exemple |
|-------|-------------|---------|
| Code | Identifiant court | SRV-01 |
| Nom | Nom du service | Bloc opératoire |
| Département | Département de rattachement | Chirurgie |
| Chef de service | Agent responsable (optionnel) | Dr. Kabongo |
| Actif | Service utilisable | Oui/Non |

### 4.5 Catégories Salariales

**Accès :** Menu latéral > Gestion > **Catégories Salariales**

Les catégories salariales définissent des grilles indiciaires.

**Champs d'une catégorie :**

| Champ | Description | Exemple |
|-------|-------------|---------|
| Code | Identifiant court | CAT-A1 |
| Nom | Nom de la catégorie | Cadre supérieur |
| Salaire de base | Salaire indiciaire | 1 500 000 FC |
| Indemnités | Indemnités de la catégorie | 200 000 FC |
| Actif | Catégorie utilisable | Oui/Non |

---

## 5. Gestion des Primes et Retenues

### 5.1 Primes

**Accès :** Menu latéral > Paie > **Primes**

Gérez les primes et indemnités applicables à tous les agents.

**Types de primes :**

| Type | Description | Exemple |
|------|-------------|---------|
| Fixe | Montant fixe pour tous | Prime de transport : 50 000 FC |
| Pourcentage | Pourcentage du salaire de base | Prime de logement : 10% |

**Créer une prime :**

1. Cliquez sur **"+ Nouvelle prime"**
2. Renseignez :
   - Code
   - Nom (ex : "Prime de risque", "Indemnité de logement")
   - Type (fixe / pourcentage)
   - Montant (pour les fixes) ou Pourcentage (pour les %)
   - Description (optionnelle)
3. Cliquez sur **"Enregistrer"**

### 5.2 Retenues

**Accès :** Menu latéral > Paie > **Retenues**

Gérez les retenues et déductions.

**Types de retenues :**

| Type | Description | Exemple |
|------|-------------|---------|
| Fixe | Montant fixe pour tous | Cotisation syndicale : 10 000 FC |
| Pourcentage | Pourcentage du salaire brut | Assurance : 2% |
| Impôt | Impôt sur le revenu (calcul automatique) | 15% au-dessus de 500 000 FC |
| CNSS | Cotisation sécurité sociale (calcul automatique) | 3,5% |

**Créer une retenue :**

1. Cliquez sur **"+ Nouvelle retenue"**
2. Renseignez :
   - Code
   - Nom (ex : "INPP", "Cotisation mutuelle")
   - Type
   - Montant ou Pourcentage
   - Description (optionnelle)
3. Cliquez sur **"Enregistrer"**

> **Note :** Les retenues de type "impôt" et "cnss" sont calculées automatiquement selon les règles fiscales configurées dans le code.

---

## 6. Calcul et Génération de la Paie

### 6.1 Créer une période de paie

**Accès :** Menu latéral > Paie > **Paie** > **"Nouvelle période"**

1. Cliquez sur **"Créer une période"**
2. Renseignez :
   - **Mois** et **Année**
   - **Date de début** et **Date de fin** de la période
3. Cliquez sur **"Créer"**

La période est créée avec le statut **"En attente"**.

### 6.2 Générer les bulletins

Une fois la période créée, générez les bulletins de paie :

1. Sélectionnez la période dans la liste
2. Cliquez sur le bouton **"Générer la paie"**
3. Confirmez l'opération
4. Le système calcule automatiquement pour chaque agent actif :
   - Salaire brut (salaire de base + prime grade + prime fonction + indemnités)
   - Total des primes
   - Total des retenues (impôt, CNSS, autres retenues)
   - Salaire net
   - Net à payer
5. Les bulletins sont générés avec le statut **"Généré"**

> **Temps d'exécution :** La génération pour 1000 agents prend environ 2-5 secondes.

### 6.3 Valider la paie

1. Vérifiez les bulletins générés (section **"Bulletins"** de la période)
2. Si tout est correct, cliquez sur **"Valider la paie"**
3. La période passe au statut **"Validé"**
4. Les bulletins deviennent disponibles pour impression

### 6.4 Verrouiller la paie

1. Après validation, cliquez sur **"Verrouiller la paie"**
2. La période passe au statut **"Verrouillé"**
3. Aucune modification n'est plus possible sur les bulletins de cette période

### 6.5 Cycle de vie d'une période de paie

```
En attente  →  Généré  →  Validé  →  Verrouillé
   │              │          │            │
   │         Bulletins   Paiements    Archive
   │         créés       possibles    définitive
   └──────────┘
 Peut être
 supprimée
```

---

## 7. Paiements

### 7.1 Enregistrer un paiement individuel

**Accès :** Menu latéral > Paie > **Paie** > Sélectionner une période > **"Effectuer un paiement"**

1. Sélectionnez l'agent concerné
2. Renseignez :
   - **Date de paiement** (par défaut : aujourd'hui)
   - **Mode de paiement** : Virement bancaire, Mobile Money, Espèces, Chèque
   - **Référence** (générée automatiquement ou saisie manuellement)
   - **Banque** (pour les virements)
3. Cliquez sur **"Effectuer le paiement"**

### 7.2 Paiement collectif

Pour payer tous les agents d'une période en une seule opération :

1. Sélectionnez la période
2. Cliquez sur **"Paiement collectif"**
3. Choisissez le mode de paiement par défaut
4. Cliquez sur **"Confirmer"**
5. Le système crée les paiements pour chaque bulletin non encore payé

### 7.3 Annuler un paiement

1. Ouvrez la liste des paiements
2. Cliquez sur **"Annuler"** pour le paiement concerné
3. Saisissez le motif d'annulation
4. Confirmez

### 7.4 États des paiements

| Statut | Signification | Action possible |
|--------|---------------|-----------------|
| **Payé** | Paiement effectué | Annulation (avec motif) |
| **En attente** | Paiement programmé | Confirmation ou annulation |
| **Annulé** | Paiement annulé | Aucune |

---

## 8. Bulletins de Paie

### 8.1 Consulter les bulletins

**Accès :** Menu latéral > Paie > **Bulletins**

La page affiche la liste des bulletins de paie générés avec filtres par :
- Période (mois/année)
- Agent
- Statut (en attente, validé, verrouillé)

### 8.2 Détail d'un bulletin

Un bulletin de paie contient :

```
╔═══════════════════════════════════════════════════════════╗
║           HÔPITAL MILITAIRE CENTRAL CAMP KOKOLO           ║
║                 BULLETIN DE PAIE                           ║
║            Période : [Mois] [Année]                       ║
╠═══════════════════════════════════════════════════════════╣
║ Matricule : [XXXXX]                                       ║
║ Agent : [NOM Postnom Prénom]                              ║
║ Grade : [Grade] | Fonction : [Fonction]                   ║
║ Département : [Département] | Service : [Service]         ║
╠═══════════════════════════════════════════════════════════╣
║ ÉLÉMENTS DU SALAIRE                  MONTANT              ║
║ ─────────────────────────────────────────────────────     ║
║ Salaire de base                     [Salaire Base] FC    ║
║ Total des primes                    [Total Primes] FC    ║
║ ─────────────────────────────────────────────────────     ║
║ SALAIRE BRUT                        [Salaire Brut] FC    ║
║ ─────────────────────────────────────────────────────     ║
║ RETENUES                                                  ║
║ Impôt sur le revenu                 [Impôt] FC           ║
║ CNSS                                [CNSS] FC            ║
║ [Autres retenues...]                [Montant] FC         ║
║ ─────────────────────────────────────────────────────     ║
║ TOTAL RETENUES                      [Total Retenues] FC  ║
║ ─────────────────────────────────────────────────────     ║
║ SALAIRE NET                         [Salaire Net] FC     ║
║ NET À PAYER                         [Net à Payer] FC     ║
╠═══════════════════════════════════════════════════════════╣
║ DÉTAIL DES PRIMES                                         ║
║ [Prime 1]                           [Montant] FC         ║
║ [Prime 2]                           [Montant] FC         ║
╠═══════════════════════════════════════════════════════════╣
║ DÉTAIL DES RETENUES                                       ║
║ [Retenue 1]                         [Montant] FC         ║
║ [Retenue 2]                         [Montant] FC         ║
╠═══════════════════════════════════════════════════════════╣
║ [QR Code]                                                 ║
║ Généré le : [Date]                                        ║
╚═══════════════════════════════════════════════════════════╝
```

### 8.3 Télécharger un bulletin en PDF

1. Ouvrez le détail du bulletin
2. Cliquez sur **"Télécharger PDF"**
3. Le fichier PDF s'ouvre dans un nouvel onglet / se télécharge

### 8.4 Imprimer un bulletin

1. Ouvrez le détail du bulletin
2. Cliquez sur **"Imprimer"**
3. La boîte de dialogue d'impression du navigateur s'affiche

### 8.5 Envoyer un bulletin par email

1. Ouvrez le détail du bulletin
2. Cliquez sur **"Envoyer par email"**
3. Le bulletin est envoyé à l'adresse email de l'agent (si renseignée)
4. Une confirmation s'affiche

### 8.6 Validation individuelle (dépréciée)

La validation et le verrouillage s'effectuent au niveau de la période de paie.

---

## 9. Rapports et Statistiques

### 9.1 Rapport mensuel

**Accès :** Menu latéral > **Rapports** > **"Mensuel"**

Paramètres :
- Mois (1-12)
- Année

Affichage :
- Récapitulatif de la paie du mois (brut, primes, retenues, net)
- Liste des bulletins
- Totaux par grade
- Totaux par département

**Export :**
- **PDF** : Rapport complet en format PDF (paysage)
- **Excel** : Données exportables dans un tableur

### 9.2 Rapport annuel

**Accès :** Menu latéral > **Rapports** > **"Annuel"**

Paramètres :
- Année

Affichage :
- Tableau des 12 mois (brut, primes, retenues, net)
- Évolution mensuelle de la masse salariale
- Comparaison des dépenses par mois

### 9.3 Masse salariale

Analyse détaillée de la masse salariale :
- Répartition par grade
- Répartition par département
- Évolution sur l'année

### 9.4 Agents impayés

**Accès :** Menu latéral > **Rapports** > **"Agents impayés"**

Liste des agents n'ayant pas reçu leur paie pour une période donnée.
Utile pour les relances et le suivi.

### 9.5 Détail des retenues et primes

Rapports dédiés aux retenues et primes par période :
- **Retenues** : Montant par type de retenue
- **Primes** : Montant par type de prime

Permet de vérifier les déductions et avantages appliqués.

---

## 10. Journal d'Audit

### 10.1 Présentation

**Accès :** Menu latéral > Administration > **Audit**

Le journal d'audit enregistre toutes les actions importantes effectuées dans le système :

| Action | Description |
|--------|-------------|
| Connexion | Connexion/déconnexion d'un utilisateur |
| Création | Ajout d'un agent, grade, fonction, etc. |
| Modification | Mise à jour d'une donnée |
| Suppression | Suppression d'une donnée |
| Paiement | Enregistrement d'un paiement |
| Export | Export d'un rapport ou d'une liste |
| Impression | Impression d'un bulletin |

### 10.2 Consultation

La page affiche un tableau avec :
- **Date et heure** de l'action
- **Utilisateur** ayant effectué l'action
- **Action** réalisée
- **Module** concerné
- **Description** détaillée
- **Adresse IP** de l'utilisateur

### 10.3 Filtres

Filtres disponibles :
- Par type d'action
- Par module
- Par utilisateur
- Par période (date de début / date de fin)

### 10.4 Export

- **Excel** : Export du journal d'audit filtré au format Excel

---

## 11. Paramètres

### 11.1 Accès

**Accès :** Menu latéral > Administration > **Paramètres**

(Disponible uniquement pour les administrateurs)

### 11.2 Paramètres généraux

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| Nom de l'hôpital | Nom officiel | Hôpital Militaire Central Camp Kokolo |
| Adresse | Adresse de l'hôpital | [À configurer] |
| Ville | Ville de l'hôpital | Kinshasa |
| Pays | Pays | République Démocratique du Congo |
| devise | Monnaie utilisée | FC (Francs Congolais) |
| devise_symbole | Symbole de la devise | FC |

### 11.3 Paramètres de paie

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| taux_impot | Taux de l'impôt sur le revenu | 15% |
| seuil_impot | Seuil d'imposition | 500 000 FC |
| taux_cnss | Taux de la cotisation CNSS | 3,5% |
| plafond_cnss | Plafond de la cotisation CNSS | 5 000 000 FC |

### 11.4 Logo et documents

- **Logo de l'hôpital** : Image PNG/JPG (max 2 Mo)
- **Signature** : Image PNG/JPG de la signature du directeur
- **Cachet** : Image PNG/JPG du cachet officiel

> Ces éléments apparaissent sur les bulletins de paie et les rapports PDF.

### 11.5 Autres paramètres

- **Email d'administration** : Adresse email pour les notifications
- **Nombre maximal d'heures** : Pour les calculs (utile pour le personnel horaire)
- **Jour de paiement** : Jour du mois par défaut pour les paiements

---

## 12. FAQ et Dépannage

### 12.1 Questions fréquentes

**Q : Comment ajouter un nouvel utilisateur ?**
R : Seul l'administrateur peut créer des utilisateurs. Menu latéral > Administration > Utilisateurs > "+ Nouvel utilisateur"

**Q : Que faire si un bulletin est incorrect ?**
R : Si la période n'est pas verrouillée, vous pouvez corriger les données de l'agent (grade, fonction, primes) et régénérer la paie.

**Q : Puis-je modifier une période verrouillée ?**
R : Non. Une période verrouillée est définitive. Créez une note de correction ou un rappel pour la période suivante.

**Q : Comment sont calculés l'impôt et la CNSS ?**
R : L'impôt est calculé à 15% sur la partie du salaire brut dépassant 500 000 FC. La CNSS est calculée à 3,5% sur le salaire brut (plafonné à 5 000 000 FC).

**Q : Puis-je exporter les données ?**
R : Oui, les listes d'agents, les bulletins et les rapports peuvent être exportés en PDF et/ou Excel.

**Q : Comment restaurer un agent supprimé ?**
R : Ouvrez la fiche de l'agent supprimé (via recherche) et cliquez sur "Restaurer".

### 12.2 Messages d'erreur courants

| Message | Cause | Solution |
|---------|-------|----------|
| "Email déjà utilisé" | L'email est déjà attribué à un autre utilisateur | Utilisez un autre email |
| "Matricule déjà existant" | Le matricule est déjà utilisé | Générez un nouveau matricule |
| "Période déjà générée" | Les bulletins ont déjà été créés | Passez directement à la validation |
| "Impossible de valider sans bulletins" | Aucun bulletin généré | Générez d'abord les bulletins |
| "Période verrouillée" | La période est verrouillée | Aucune action possible, elle est définitive |

### 12.3 Contacts support

| Contact | Information |
|---------|-------------|
| Support technique | [À compléter] |
| Administrateur système | [À compléter] |
| Email | [À compléter] |
| Téléphone | [À compléter] |

---

## Raccourcis et Astuces

| Action | Astuce |
|--------|--------|
| Recherche rapide | Utilisez `Ctrl+K` (ou `Cmd+K` sur Mac) pour ouvrir la recherche |
| Pagination | Utilisez les flèches du clavier pour naviguer (si implémenté) |
| Rafraîchir | Actualisez la page après des modifications en masse |
| Impression écran | Utilisez `Ctrl+P` (ou `Cmd+P`) pour imprimer une page depuis le navigateur |

---

## Profils et Permissions

| Rôle | Agents | Référentiels | Paie | Paiements | Rapports | Audit | Paramètres | Utilisateurs |
|------|--------|--------------|------|-----------|----------|-------|------------|--------------|
| Administrateur | CRUD | CRUD | CRUD | CRUD | ✔️ | ✔️ | ✔️ | CRUD |
| Chef RH | CRUD | CRUD | Générer, Valider | ✔️ | ✔️ | ✔️ | ❌ | ❌ |
| Comptable | Lecture | Lecture | Lecture | CRUD | ✔️ | ❌ | ❌ | ❌ |
| Direction | Lecture | Lecture | Lecture | Lecture | ✔️ | ❌ | ❌ | ❌ |
| Auditeur | Lecture | Lecture | Lecture | Lecture | Lecture | ✔️ | ❌ | ❌ |

**Légende :** CRUD = Créer, Lire, Modifier, Supprimer | ✔️ = Accès | ❌ = Pas d'accès

---

*Document mis à jour le : Juillet 2026*
*Version 1.0.0*
