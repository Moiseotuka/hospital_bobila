# Documentation Développeur - Système de Gestion de Paie
## Hôpital Militaire Central Camp Kokolo

---

## Table des matières

1. [Architecture MVC](#architecture-mvc)
2. [Structure du Projet](#structure-du-projet)
3. [Modèles de Données](#modèles-de-données)
4. [API Routes](#api-routes)
5. [Services Métier](#services-métier)
6. [Enums](#enums)
7. [Frontend Components](#frontend-components)
8. [Hooks Personnalisés](#hooks-personnalisés)
9. [Services Frontend](#services-frontend)
10. [Conventions de Code](#conventions-de-code)
11. [Tests](#tests)
12. [Workflow Git](#workflow-git)

---

## Architecture MVC

L'application suit l'architecture **MVC (Model-View-Controller)** pour le backend Laravel et une architecture **composants** pour le frontend React/Next.js.

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │   Pages   │  │ Composants│  │ Services (API Client) │ │
│  └────┬─────┘  └────┬─────┘  └───────────┬───────────┘ │
│       │              │                    │              │
│       └──────────────┴────────────────────┘              │
│                         │ HTTP (Axios)                   │
├─────────────────────────┴────────────────────────────────┤
│                     BACKEND (Laravel)                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │  Routes   │  │Controllers│  │    Middleware         │ │
│  └────┬─────┘  └────┬─────┘  └───────────────────────┘ │
│       │              │                                   │
│  ┌────┴──────────────┴────┐                              │
│  │       Services         │                              │
│  └────┬───────────────────┘                              │
│       │                                                  │
│  ┌────┴───────────────────┐                              │
│  │       Models (Eloquent) │                              │
│  └────┬───────────────────┘                              │
│       │                                                  │
│  ┌────┴───────────────────┐                              │
│  │   PostgreSQL Database  │                              │
│  └────────────────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

### Flux de données

1. L'utilisateur interagit avec un composant React
2. Le composant appelle un service frontend (axios)
3. La requête HTTP est envoyée à une route API Laravel
4. Le middleware `auth:sanctum` vérifie l'authentification
5. Le contrôleur valide la requête via un FormRequest
6. Le service métier exécute la logique
7. Le modèle Eloquent interagit avec la base de données
8. La réponse est formatée via un Resource et renvoyée au frontend

---

## Structure du Projet

### Backend (Laravel)

```
backend/
├── app/
│   ├── Console/                    # Commandes artisan personnalisées
│   ├── Enums/                      # Énumérations PHP
│   │   ├── ModePaiementEnum.php
│   │   ├── RoleEnum.php
│   │   ├── StatutAgentEnum.php
│   │   ├── StatutPaiementEnum.php
│   │   └── StatutPeriodePaieEnum.php
│   ├── Events/                     # Événements (à implémenter)
│   ├── Exceptions/                 # Gestion des exceptions
│   ├── Exports/                    # Exportations Excel
│   │   ├── AgentsExport.php
│   │   └── RapportMensuelExport.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   └── Api/
│   │   │       ├── AgentController.php
│   │   │       ├── AuditController.php
│   │   │       ├── AuthController.php
│   │   │       ├── BulletinController.php
│   │   │       ├── CategorieSalarialeController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── DepartementController.php
│   │   │       ├── FonctionController.php
│   │   │       ├── GradeController.php
│   │   │       ├── PaieController.php
│   │   │       ├── PaiementController.php
│   │   │       ├── ParametreController.php
│   │   │       ├── PrimeController.php
│   │   │       ├── RapportController.php
│   │   │       ├── RetenueController.php
│   │   │       ├── ServiceController.php
│   │   │       └── UserController.php
│   │   ├── Middleware/
│   │   │   └── RoleMiddleware.php
│   │   ├── Requests/
│   │   │   ├── StoreAgentRequest.php
│   │   │   ├── StoreCategorieSalarialeRequest.php
│   │   │   ├── StoreDepartementRequest.php
│   │   │   ├── StoreFonctionRequest.php
│   │   │   ├── StoreGradeRequest.php
│   │   │   ├── StorePrimeRequest.php
│   │   │   ├── StoreRetenueRequest.php
│   │   │   ├── StoreServiceRequest.php
│   │   │   ├── UpdateAgentRequest.php
│   │   │   ├── UpdateCategorieSalarialeRequest.php
│   │   │   ├── UpdateDepartementRequest.php
│   │   │   ├── UpdateFonctionRequest.php
│   │   │   ├── UpdateGradeRequest.php
│   │   │   ├── UpdatePrimeRequest.php
│   │   │   ├── UpdateRetenueRequest.php
│   │   │   └── UpdateServiceRequest.php
│   │   └── Resources/
│   │       ├── AgentCollection.php
│   │       ├── AgentResource.php
│   │       ├── AuditLogResource.php
│   │       ├── BulletinPaieResource.php
│   │       ├── CategorieSalarialeResource.php
│   │       ├── DepartementResource.php
│   │       ├── FonctionResource.php
│   │       ├── GradeResource.php
│   │       ├── PaiementResource.php
│   │       ├── PeriodePaieResource.php
│   │       ├── PrimeResource.php
│   │       ├── RetenueResource.php
│   │       ├── ServiceResource.php
│   │       └── UserResource.php
│   ├── Listeners/                  # Écouteurs d'événements
│   ├── Models/                     # Modèles Eloquent
│   │   ├── Agent.php
│   │   ├── AuditLog.php
│   │   ├── BulletinPaie.php
│   │   ├── CategorieSalariale.php
│   │   ├── Departement.php
│   │   ├── Fonction.php
│   │   ├── Grade.php
│   │   ├── HospitalSetting.php
│   │   ├── Paiement.php
│   │   ├── PeriodePaie.php
│   │   ├── Prime.php
│   │   ├── Retenue.php
│   │   ├── Service.php
│   │   └── User.php
│   ├── Notifications/              # Notifications (à implémenter)
│   ├── Providers/                  # Providers de services
│   ├── Rules/                      # Règles de validation personnalisées
│   └── Services/                   # Services métier
│       ├── AuditService.php
│       ├── CalculPaieService.php
│       ├── ExportService.php
│       ├── PaiementService.php
│       └── StatistiqueService.php
├── bootstrap/                      # Bootstrap de l'application
├── config/                         # Fichiers de configuration
├── database/
│   ├── factories/                  # Factory pour les tests
│   ├── migrations/                 # Migrations DB (19 fichiers)
│   └── seeders/                    # Seeders DB (16 fichiers)
├── public/                         # Point d'entrée web
├── resources/
│   └── views/
│       └── exports/                # Vues pour les exports PDF
│           ├── agents.blade.php
│           ├── bulletin-paie.blade.php
│           ├── rapport-mensuel.blade.php
│           └── rapport-mensuel-excel.blade.php
├── routes/
│   └── api.php                     # Routes API
├── storage/                        # Stockage local
├── tests/
│   ├── Feature/                    # Tests fonctionnels
│   └── Unit/                       # Tests unitaires
├── composer.json
└── artisan
```

### Frontend (Next.js)

```
frontend/
├── public/                         # Assets statiques
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Pages d'authentification
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   └── (dashboard)/            # Pages du tableau de bord
│   │       ├── agents/
│   │       │   ├── [id]/
│   │       │   ├── creer/
│   │       │   └── page.tsx
│   │       ├── audit/
│   │       ├── bulletins/
│   │       │   └── [id]/
│   │       ├── categories-salariales/
│   │       ├── dashboard/
│   │       ├── departements/
│   │       ├── fonctions/
│   │       ├── grades/
│   │       ├── paie/
│   │       │   ├── effectuer/
│   │       │   └── historique/
│   │       ├── parametres/
│   │       ├── primes/
│   │       ├── rapports/
│   │       ├── retenues/
│   │       ├── services/
│   │       ├── utilisateurs/
│   │       └── layout.tsx
│   ├── components/
│   │   ├── layout/                 # Composants de mise en page
│   │   │   ├── auth-layout.tsx
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── data-table-wrapper.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── sidebar-item.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── stat-card.tsx
│   │   ├── ui/                     # Composants UI (shadcn/ui)
│   │   │   ├── alert.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── command.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   └── tooltip.tsx
│   │   └── QueryProvider.tsx
│   ├── hooks/                      # Hooks React personnalisés
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useSidebar.ts
│   ├── lib/                        # Utilitaires
│   │   ├── api.ts                  # Instance Axios avec intercepteurs
│   │   ├── auth.ts                 # Gestion des tokens
│   │   └── utils.ts                # Fonctions utilitaires
│   ├── services/                   # Services API (frontend)
│   │   ├── agent.service.ts
│   │   ├── audit.service.ts
│   │   ├── auth.service.ts
│   │   ├── bulletin.service.ts
│   │   ├── categorieSalariale.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── departement.service.ts
│   │   ├── fonction.service.ts
│   │   ├── grade.service.ts
│   │   ├── paie.service.ts
│   │   ├── paiement.service.ts
│   │   ├── parametre.service.ts
│   │   ├── prime.service.ts
│   │   ├── rapport.service.ts
│   │   ├── retenue.service.ts
│   │   ├── service.service.ts
│   │   └── user.service.ts
│   └── types/                      # Types TypeScript
│       └── index.ts
├── .env.local
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Modèles de Données

### Diagramme Textuel des Relations

```
┌───────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│    Departement    │     │       Service        │     │    Categorie        │
├───────────────────┤     ├──────────────────────┤     │   Salariale         │
│ id (PK)           │     │ id (PK)              │     ├─────────────────────┤
│ code              │◄────│ departement_id (FK)  │     │ id (PK)             │
│ nom               │     │ code                 │     │ code                │
│ description       │     │ nom                  │     │ nom                 │
│ chef_departement  │     │ description          │     │ salaire_base        │
│ is_active         │     │ chef_service_id (FK) │     │ indemnites          │
└───────┬───────────┘     │ is_active            │     │ is_active           │
        │                 └──────────────────────┘     └──────────┬──────────┘
        │                                                        │
        │  ┌─────────────────────────────┐                       │
        │  │          Agent              │                       │
        │  ├─────────────────────────────┤                       │
        │  │ id (PK)                     │                       │
        │  │ matricule (unique)          │                       │
        ├──│ departement_id (FK)         │                       │
        │  │ service_id (FK)             │                       │
        │  │ categorie_salariale_id (FK)─┼───────────────────────┘
        │  │ grade_id (FK)               │
        │  │ fonction_id (FK)            │
        │  │ nom, postnom, prenom        │
        │  │ sexe                        │
        │  │ date_naissance              │
        │  │ telephone                   │
        │  │ adresse                     │
        │  │ statut                      │
        │  │ type_agent                  │
        │  │ date_engagement             │
        │  │ compte_bancaire             │
        │  │ numero_cnss                 │
        │  │ situation                   │
        │  │ is_active                   │
        │  └──────────┬──────────────────┘
        │             │
┌───────┴──────┐     │     ┌──────────────────────┐
│    Grade     │     │     │      Fonction        │
├──────────────┤     │     ├──────────────────────┤
│ id (PK)      │     │     │ id (PK)              │
│ code         │     │     │ code                 │
│ nom          │◄────┼─────│ nom                  │
│ salaire_base │     │     │ prime_fonction       │
│ prime        │     │     │ is_active            │
│ is_active    │     │     └──────────────────────┘
└──────────────┘     │
                     │
┌────────────────────┴──────────────────────────────────────┐
│                      PeriodePaie                           │
├───────────────────────────────────────────────────────────┤
│ id (PK)                                                    │
│ mois                                                       │
│ annee                                                      │
│ date_debut                                                 │
│ date_fin                                                   │
│ statut (en_attente, généré, valide, verrouille)            │
│ total_brut                                                 │
│ total_primes                                               │
│ total_retenues                                             │
│ total_net                                                  │
│ nombre_agents                                              │
│ created_by (FK → User)                                     │
│ valide_by (FK → User)                                      │
│ verrouille_by (FK → User)                                  │
└──────────────┬─────────────────────────────────────────────┘
               │ 1
               │
┌──────────────┴─────────────────────────────────────────────┐
│                      BulletinPaie                           │
├───────────────────────────────────────────────────────────┤
│ id (PK)                                                    │
│ agent_id (FK → Agent)                                      │
│ periode_paie_id (FK → PeriodePaie)                         │
│ matricule                                                  │
│ nom_complet                                                │
│ grade_nom                                                  │
│ fonction_nom                                               │
│ departement_nom                                            │
│ service_nom                                                │
│ salaire_base                                               │
│ total_primes                                               │
│ total_retenues                                             │
│ salaire_brut                                               │
│ salaire_net                                                │
│ net_a_payer                                                │
│ primes_detail (JSON)                                       │
│ retenues_detail (JSON)                                     │
│ date_generation                                            │
│ est_valide                                                 │
│ est_verrouille                                             │
│ qr_code                                                    │
└──────────────┬─────────────────────────────────────────────┘
               │ 1
               │
┌──────────────┴─────────────────────────────────────────────┐
│                       Paiement                              │
├───────────────────────────────────────────────────────────┤
│ id (PK)                                                    │
│ bulletin_paie_id (FK → BulletinPaie)                       │
│ agent_id (FK → Agent)                                      │
│ periode_paie_id (FK → PeriodePaie)                         │
│ montant                                                    │
│ date_paiement                                              │
│ mode_paiement (virement, mobile_money, especes, cheque)    │
│ reference                                                  │
│ banque                                                     │
│ statut (payé, en_attente, annulé)                          │
│ motif_annulation                                           │
│ traite_par (FK → User)                                     │
└────────────────────────────────────────────────────────────┘

┌───────────────────┐     ┌──────────────────────┐
│       Prime       │     │       Retenue        │
├───────────────────┤     ├──────────────────────┤
│ id (PK)           │     │ id (PK)              │
│ code              │     │ code                 │
│ nom               │     │ nom                  │
│ type              │     │ type                 │
│ montant           │     │ montant              │
│ pourcentage       │     │ pourcentage          │
│ est_pourcentage   │     │ est_pourcentage      │
│ description       │     │ description          │
│ is_active         │     │ is_active            │
└───────────────────┘     └──────────────────────┘

┌───────────────────┐     ┌──────────────────────┐
│     AuditLog      │     │        User          │
├───────────────────┤     ├──────────────────────┤
│ id (PK)           │     │ id (PK)              │
│ user_id (FK)      │◄────│ name                 │
│ action            │     │ email                │
│ module            │     │ password             │
│ description       │     │ role                 │
│ model_type        │     │ is_active            │
│ model_id          │     │ phone                │
│ anciennes_valeurs │     │ photo                │
│ nouvelles_valeurs │     │ derniere_connexion   │
│ ip_address        │     └──────────────────────┘
│ user_agent        │
│ created_at        │
└───────────────────┘

┌──────────────────────────┐
│     HospitalSetting      │
├──────────────────────────┤
│ id (PK)                  │
│ key (unique)             │
│ value                    │
│ type (text, boolean,     │
│       integer, json)     │
│ group                    │
└──────────────────────────┘
```

### Détail des migrations (ordre d'exécution)

| # | Migration | Table |
|---|-----------|-------|
| 1 | `create_cache_table` | `cache`, `cache_locks` |
| 2 | `create_personal_access_tokens_table` | `personal_access_tokens` |
| 3 | `create_permission_tables` | `permissions`, `roles`, `model_has_roles`, etc. |
| 4 | `create_hospital_settings_table` | `hospital_settings` |
| 5 | `create_departements_table` | `departements` |
| 6 | `create_services_table` | `services` |
| 7 | `create_grades_table` | `grades` |
| 8 | `create_fonctions_table` | `fonctions` |
| 9 | `create_categories_salariales_table` | `categories_salariales` |
| 10 | `create_agents_table` | `agents` |
| 11 | `add_foreign_keys_to_departements_services` | Ajout clés étrangères |
| 12 | `create_primes_table` | `primes` |
| 13 | `create_retenues_table` | `retenues` |
| 14 | `create_periode_paies_table` | `periodes_paie` |
| 15 | `create_bulletins_paie_table` | `bulletins_paie` |
| 16 | `create_paiements_table` | `paiements` |
| 17 | `create_audit_logs_table` | `audit_logs` |
| 18 | `create_notifications_table` | `notifications` |
| 19 | `create_users_table` | `users` |

---

## API Routes

### Points d'accès publics

| Méthode | URI | Description |
|---------|-----|-------------|
| POST | `/api/login` | Authentification |

### Points d'accès protégés (auth:sanctum)

#### Authentification

| Méthode | URI | Description |
|---------|-----|-------------|
| POST | `/api/logout` | Déconnexion |
| GET | `/api/me` | Informations de l'utilisateur connecté |
| PUT | `/api/profile` | Mise à jour du profil |

#### Dashboard

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/dashboard` | Statistiques principales du tableau de bord |
| GET | `/api/dashboard/evolution` | Évolution mensuelle de la masse salariale |
| GET | `/api/dashboard/repartition-grade` | Répartition des agents par grade |
| GET | `/api/dashboard/repartition-departement` | Répartition des agents par département |
| GET | `/api/dashboard/derniers-paiements` | Liste des derniers paiements |
| GET | `/api/dashboard/alertes` | Alertes et notifications |

#### Agents

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/agents-stats` | Statistiques globales des agents |
| GET | `/api/agents` | Liste paginée des agents |
| POST | `/api/agents` | Création d'un agent |
| GET | `/api/agents/{id}` | Détail d'un agent |
| PUT | `/api/agents/{id}` | Modification d'un agent |
| DELETE | `/api/agents/{id}` | Suppression (soft delete) d'un agent |
| POST | `/api/agents/{id}/restore` | Restauration d'un agent supprimé |
| GET | `/api/agents/{id}/export-pdf` | Export PDF de la fiche agent |
| GET | `/api/agents/{id}/export-excel` | Export Excel de la fiche agent |

#### Référentiels (CRUD standard)

| Ressource | Méthodes | Description |
|-----------|----------|-------------|
| `/api/grades` | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} | Grades militaires/civils |
| `/api/fonctions` | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} | Fonctions des agents |
| `/api/departements` | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} | Départements hospitaliers |
| `/api/services` | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} | Services par département |
| `/api/categories-salariales` | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} | Catégories salariales |
| `/api/primes` | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} | Primes et indemnités |
| `/api/retenues` | GET, POST, GET/{id}, PUT/{id}, DELETE/{id} | Retenues et déductions |

#### Calculs

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/primes/calculate/{agent}` | Calcul des primes d'un agent |
| GET | `/api/retenues/calculate/{agent}/{salaireBrut}` | Calcul des retenues d'un agent |

#### Paie

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/paies` | Liste des périodes de paie |
| POST | `/api/paies` | Création d'une période de paie |
| GET | `/api/paies/{id}` | Détail d'une période |
| POST | `/api/paies/{id}/generate` | Génération des bulletins de paie |
| POST | `/api/paies/{id}/validate` | Validation de la paie |
| POST | `/api/paies/{id}/lock` | Verrouillage de la paie |
| GET | `/api/paies/{id}/bulletins` | Bulletins de la période |
| GET | `/api/paies/{id}/stats` | Statistiques de la période |

#### Paiements

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/paiements` | Liste des paiements |
| POST | `/api/paiements` | Enregistrer un paiement |
| POST | `/api/paiements/collective` | Paiement collectif |
| GET | `/api/paiements/{id}` | Détail d'un paiement |
| PUT | `/api/paiements/{id}` | Modifier un paiement |
| DELETE | `/api/paiements/{id}` | Supprimer un paiement |

#### Bulletins de Paie

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/bulletins` | Liste des bulletins |
| GET | `/api/bulletins/{id}` | Détail d'un bulletin |
| GET | `/api/bulletins/{id}/download-pdf` | Télécharger le bulletin en PDF |
| GET | `/api/bulletins/{id}/print` | Imprimer le bulletin |
| POST | `/api/bulletins/{id}/send-email` | Envoyer le bulletin par email |

#### Rapports

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/rapports/mensuel/{mois}/{annee}` | Rapport mensuel |
| GET | `/api/rapports/annuel/{annee}` | Rapport annuel |
| GET | `/api/rapports/masse-salariale` | Analyse de la masse salariale |
| GET | `/api/rapports/agents-impayes/{periodeId}` | Agents non payés |
| GET | `/api/rapports/retenues/{periodeId}` | Détail des retenues |
| GET | `/api/rapports/primes/{periodeId}` | Détail des primes |
| GET | `/api/rapports/export/{type}` | Export PDF des rapports |
| GET | `/api/rapports/export-excel/{type}` | Export Excel des rapports |

#### Audit

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/audit-logs` | Liste des logs d'audit |
| GET | `/api/audit-logs/{id}` | Détail d'un log |
| GET | `/api/audit-logs/export/excel` | Export Excel des logs |

#### Paramètres

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/parametres` | Liste des paramètres |
| GET | `/api/parametres/{key}` | Valeur d'un paramètre |
| PUT | `/api/parametres/{key}` | Mettre à jour un paramètre |
| POST | `/api/parametres/logo` | Mettre à jour le logo |
| POST | `/api/parametres/signature` | Mettre à jour la signature |
| POST | `/api/parametres/cachet` | Mettre à jour le cachet |

#### Utilisateurs (admin seulement)

| Méthode | URI | Description |
|---------|-----|-------------|
| GET | `/api/users` | Liste des utilisateurs |
| POST | `/api/users` | Création d'un utilisateur |
| GET | `/api/users/{id}` | Détail d'un utilisateur |
| PUT | `/api/users/{id}` | Modification d'un utilisateur |
| DELETE | `/api/users/{id}` | Suppression d'un utilisateur |

---

## Services Métier

### `CalculPaieService`

```php
class CalculPaieService
{
    // Constantes de calcul
    const TAUX_IMPOT = 0.15;       // 15% d'impôt sur le revenu
    const TAUX_CNSS = 0.035;       // 3.5% de cotisation CNSS
    const SEUIL_IMPOT = 500000;    // Seuil d'imposition : 500 000 FC

    // Méthodes principales
    calculerSalaireBrut(Agent $agent): float
    calculerTotalPrimes(Agent $agent, array $primesSupplementaires = []): float
    calculerTotalRetenues(Agent $agent, float $salaireBrut): float
    calculerSalaireNet(float $brut, float $totalPrimes, float $totalRetenues): float
    calculerNetAPayer(float $salaireNet): float
    genererBulletin(Agent $agent, PeriodePaie $periode, array $options = []): BulletinPaie
    genererPaieMensuelle(PeriodePaie $periode): void
}
```

**Formule de calcul du salaire :**

```
Salaire Brut = Salaire de base (Grade) + Prime de grade + Prime de fonction + Indemnités (Catégorie)

Total Primes = Somme(Primes actives en % ou montant fixe) + Primes supplémentaires

Total Retenues = Impôt (si brut > 500 000 FC) + CNSS (3.5%) + Autres retenues

Salaire Net = (Salaire Brut + Total Primes) - Total Retenues

Net à Payer = Salaire Net
```

### `PaiementService`

```php
class PaiementService
{
    effectuerPaiement(BulletinPaie $bulletin, array $data): Paiement
    effectuerPaiementCollectif(PeriodePaie $periode, array $data): Collection
    annulerPaiement(Paiement $paiement, string $motif): bool
    verifierStatutPaiements(PeriodePaie $periode): array
}
```

### `AuditService`

```php
class AuditService
{
    log(string $action, string $module, string $description, ...): AuditLog
    logConnexion(): AuditLog
    logCreation(string $module, string $description, Model $model, ...): AuditLog
    logModification(string $module, string $description, Model $model, ...): AuditLog
    logSuppression(string $module, string $description, Model $model, ...): AuditLog
    logPaiement(string $description, Model $model, ...): AuditLog
    logExport(string $module, string $description): AuditLog
    logImpression(string $module, string $description, Model $model = null): AuditLog
}
```

### `StatistiqueService`

```php
class StatistiqueService
{
    getDashboardData(): array
    getEvolutionMensuelle(int $annee): array
    getRepartitionParGrade(): array
    getRepartitionParDepartement(): array
    getMasseSalarialeParMois(int $annee): array
    getStatistiquesPaiements(?int $mois, ?int $annee): array
}
```

### `ExportService`

```php
class ExportService
{
    exportBulletinPDF(BulletinPaie $bulletin): PDF
    exportRapportMensuelPDF(PeriodePaie $periode): PDF
    exportListeAgentsExcel($agents): Excel
    exportRapportMensuelExcel(PeriodePaie $periode): Excel
}
```

---

## Enums

### `RoleEnum` — Rôles des utilisateurs

| Valeur | Libellé | Description |
|--------|---------|-------------|
| `administrateur` | Administrateur | Accès complet au système |
| `chef_rh` | Chef RH | Gestion des agents et de la paie |
| `comptable` | Comptable | Gestion des paiements |
| `direction` | Direction | Consultation et rapports |
| `auditeur` | Auditeur | Consultation des logs d'audit |

### `StatutAgentEnum` — Situation des agents

| Valeur | Libellé |
|--------|---------|
| `actif` | Actif |
| `suspendu` | Suspendu |
| `retraite` | Retraité |
| `decede` | Décédé |

### `StatutPeriodePaieEnum` — Statut d'une période de paie

| Valeur | Libellé | Couleur |
|--------|---------|---------|
| `en_attente` | En attente | warning |
| `generé` | Généré | info |
| `valide` | Validé | success |
| `verrouille` | Verrouillé | secondary |

### `ModePaiementEnum` — Modes de paiement

| Valeur | Libellé |
|--------|---------|
| `virement_bancaire` | Virement bancaire |
| `mobile_money` | Mobile Money |
| `especes` | Espèces |
| `cheque` | Chèque |

### `StatutPaiementEnum` — Statut des paiements

| Valeur | Libellé | Couleur |
|--------|---------|---------|
| `paye` | Payé | success |
| `en_attente` | En attente | warning |
| `annule` | Annulé | danger |

---

## Frontend Components

### Composants UI (shadcn/ui)

La bibliothèque [shadcn/ui](https://ui.shadcn.com/) est utilisée pour les composants d'interface. Les composants sont dans `src/components/ui/` et incluent :

- **DataTable** : Tableau de données paginé, trié et filtrable avec `@tanstack/react-table`
- **Dialog/Sheet** : Modales et panneaux latéraux
- **Form** : Formulaires avec validation Zod + `react-hook-form`
- **Card** : Cartes pour les statistiques et sections
- **Tabs** : Onglets pour les sections organisées
- **DropdownMenu** : Menus déroulants pour les actions
- **Select** : Listes déroulantes pour les choix
- **Badge** : Badges pour les statuts avec code couleur
- **AlertDialog** : Dialogues de confirmation

### Composants Layout

- **`DashboardLayout`** : Layout principal avec sidebar et navbar
- **`AuthLayout`** : Layout pour les pages d'authentification
- **`Sidebar`** : Navigation latérale avec sous-menus
- **`Navbar`** : Barre de navigation supérieure
- **`PageHeader`** : En-tête de page avec titre et actions
- **`StatCard`** : Carte de statistique avec icône et valeur
- **`DataTableWrapper`** : Wrapper pour les tableaux de données
- **`Loading`** : État de chargement
- **`ErrorState`** : État d'erreur avec bouton de réessai
- **`EmptyState`** : État vide avec message et action

---

## Hooks Personnalisés

### `useAuth`

```typescript
// Hook principal d'authentification
useLogin()                 // Mutation de connexion
useLogout()                // Mutation de déconnexion
useMe()                    // Query des informations utilisateur
useUpdateProfile()         // Mutation de mise à jour du profil
```

**Fonctionnement :**
1. `useLogin` : Appelle `authService.login()` → stocke le token → invalide la query `me` → redirige vers `/dashboard`
2. `useLogout` : Appelle `authService.logout()` → vide le cache React Query → redirige vers `/login`
3. `useMe` : Récupère l'utilisateur connecté avec un staleTime de 5 minutes

### `useSidebar`

```typescript
useSidebar(): {
  isCollapsed: boolean;      // Sidebar réduite
  isMobileOpen: boolean;     // Sidebar ouverte sur mobile
  toggleCollapse: () => void; // Basculer l'état réduit
  setMobileOpen: (open: boolean) => void; // Ouvrir/fermer sur mobile
}
```

### `useDebounce`

```typescript
useDebounce<T>(value: T, delay: number = 500): T
// Retourne la valeur après un délai configurable (500ms par défaut)
// Utilisé pour la recherche en temps réel
```

---

## Services Frontend

Chaque service frontend encapsule les appels Axios vers l'API backend. Architecture type :

```typescript
// Exemple : agent.service.ts
import api from "@/lib/api";
import { Agent, PaginatedResponse, ApiResponse } from "@/types";

export const agentService = {
  getAll: (params?: any) =>
    api.get<PaginatedResponse<Agent>>("/agents", { params }),
  getById: (id: number) =>
    api.get<ApiResponse<Agent>>(`/agents/${id}`),
  create: (data: Partial<Agent>) =>
    api.post<ApiResponse<Agent>>("/agents", data),
  update: (id: number, data: Partial<Agent>) =>
    api.put<ApiResponse<Agent>>(`/agents/${id}`, data),
  delete: (id: number) =>
    api.delete(`/agents/${id}`),
  restore: (id: number) =>
    api.post(`/agents/${id}/restore`),
  getStats: () =>
    api.get("/agents-stats"),
};
```

### Liste des services

| Service | Ressource API | Pages associées |
|---------|---------------|-----------------|
| `auth.service.ts` | Authentification | Login |
| `agent.service.ts` | Agents | Agents |
| `grade.service.ts` | Grades | Grades |
| `fonction.service.ts` | Fonctions | Fonctions |
| `departement.service.ts` | Départements | Départements |
| `service.service.ts` | Services | Services |
| `categorieSalariale.service.ts` | Catégories salariales | Catégories salariales |
| `prime.service.ts` | Primes | Primes |
| `retenue.service.ts` | Retenues | Retenues |
| `paie.service.ts` | Paie | Paie (effectuer, historique) |
| `bulletin.service.ts` | Bulletins | Bulletins |
| `paiement.service.ts` | Paiements | Paiements |
| `rapport.service.ts` | Rapports | Rapports |
| `dashboard.service.ts` | Dashboard | Tableau de bord |
| `audit.service.ts` | Audit | Audit |
| `parametre.service.ts` | Paramètres | Paramètres |
| `user.service.ts` | Utilisateurs | Utilisateurs |

---

## Conventions de Code

### Générales

- **Langue** : Les commentaires, variables, fonctions et classes sont en **français**
- **Backend PHP** : Respect de PSR-12, typage strict (`declare(strict_types=1)`)
- **Frontend TypeScript** : Strict mode, types explicites, pas de `any` sauf exception
- **Nommage** : camelCase pour les variables/méthodes, PascalCase pour les classes, snake_case pour les colonnes DB

### Backend Laravel

```php
// Contrôleur - respect du pattern REST
class AgentController extends Controller
{
    public function index(Request $request) { /* ... */ }
    public function store(StoreAgentRequest $request) { /* ... */ }
    public function show(Agent $agent) { /* ... */ }
    public function update(UpdateAgentRequest $request, Agent $agent) { /* ... */ }
    public function destroy(Agent $agent) { /* ... */ }
    public function restore(int $id) { /* ... */ }
}

// Service - logique métier
class CalculPaieService
{
    public function calculerSalaireBrut(Agent $agent): float { /* ... */ }
    public function genererBulletin(Agent $agent, PeriodePaie $periode): BulletinPaie { /* ... */ }
}

// Model - relations Eloquent
class Agent extends Model
{
    public function grade(): BelongsTo { /* ... */ }
    public function bulletinsPaie(): HasMany { /* ... */ }
    public function getNomCompletAttribute(): string { /* ... */ }
    public function scopeActifs($query) { /* ... */ }
}
```

### Frontend TypeScript/React

```typescript
// Composant - convention nommage PascalCase
export function AgentList() { /* ... */ }

// Hook - préfixe "use"
export function useAuth() { /* ... */ }

// Service - camelCase
export const agentService = { getAll, getById, create, update, delete };

// Types - interfaces PascalCase
export interface Agent { id: number; nom: string; /* ... */ }

// Fonctions utilitaires - camelCase
export function formatCurrency(value: number): string { /* ... */ }
```

### Règles de validation Backend

Les requêtes de validation utilisent des FormRequest :

```php
// StoreAgentRequest.php
public function rules(): array
{
    return [
        'matricule' => 'required|string|max:20|unique:agents,matricule',
        'nom' => 'required|string|max:100',
        'prenom' => 'required|string|max:100',
        'date_naissance' => 'required|date|before:today',
        'email' => 'nullable|email|max:255',
        'telephone' => 'nullable|string|max:20',
        'grade_id' => 'nullable|exists:grades,id',
        'fonction_id' => 'nullable|exists:fonctions,id',
        'departement_id' => 'nullable|exists:departements,id',
        'service_id' => 'nullable|exists:services,id',
        'categorie_salariale_id' => 'nullable|exists:categories_salariales,id',
    ];
}
```

### Gestion des erreurs API

```json
// Réponse de succès
{
  "success": true,
  "data": { /* ... */ },
  "message": "Agent créé avec succès"
}

// Réponse d'erreur
{
  "success": false,
  "message": "Erreur de validation",
  "errors": {
    "email": ["L'email est déjà utilisé."]
  }
}

// Réponse paginée
{
  "success": true,
  "data": [ /* ... */ ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 145,
    "from": 1,
    "to": 15
  }
}
```

---

## Tests

### Backend

Les tests sont dans `backend/tests/` :

```bash
# Exécuter tous les tests
php artisan test

# Exécuter les tests unitaires
php artisan test --testsuite=Unit

# Exécuter les tests fonctionnels
php artisan test --testsuite=Feature
```

### Structure des tests

```
tests/
├── Feature/
│   ├── AgentTest.php
│   ├── GradeTest.php
│   ├── PaieTest.php
│   └── ...
└── Unit/
    ├── CalculPaieServiceTest.php
    ├── AuditServiceTest.php
    └── ...
```

### Frontend

Le frontend utilise les outils suivants pour les tests (à configurer) :

```bash
# Linting
npm run lint
```

### Commandes de vérification

```bash
# Backend
cd backend
./vendor/bin/phpstan analyse app --level=8
./vendor/bin/pint --test

# Frontend
cd frontend
npm run typecheck
npm run lint
```

---

## Workflow Git

### Branches

```
main            → Production (déploiement automatique)
├── develop     → Développement (intégration)
│   ├── feature/*   → Nouvelles fonctionnalités
│   ├── fix/*       → Corrections de bugs
│   ├── refactor/*  → Refactoring
│   └── docs/*      → Documentation
```

### Convention de commits

```
type(scope): message impératif en français

Types: feat, fix, refactor, style, docs, test, chore, perf

Exemples:
feat(agents): ajouter l'export PDF des fiches agents
fix(paie): corriger le calcul des retenues CNSS
refactor(services): extraire la logique de calcul dans CalculPaieService
docs(api): mettre à jour la documentation des routes
```

### Processus de développement

1. Créer une branche depuis `develop`
2. Développer la fonctionnalité/correction
3. Exécuter les tests et le lint
4. Créer une Pull Request vers `develop`
5. Revue de code par un pair
6. Merge dans `develop`
7. Tests d'intégration
8. Merge vers `main` pour le déploiement

### Pré-commit hooks (suggestions)

```bash
# Installer Husky
npx husky install

# .husky/pre-commit
npm run lint
cd backend && ./vendor/bin/pint --test
cd backend && php artisan test --group=current
```

---

## Technologies Utilisées

### Backend

| Technologie | Version | Usage |
|-------------|---------|-------|
| PHP | 8.4 | Langage |
| Laravel | 12.0 | Framework |
| Laravel Sanctum | 4.0 | Authentification API |
| Spatie Laravel Permission | 6.0 | Gestion des rôles et permissions |
| Spatie Activitylog | 4.9 | Journalisation (alternatif) |
| Laravel DomPDF (Barryvdh) | 3.0 | Génération PDF |
| Laravel Excel (Maatwebsite) | 3.1 | Export Excel |
| Simple QRCode | 4.2 | Génération QR Code |
| Laravel Horizon | 5.29 | Gestion des queues |
| PostgreSQL | 16+ | Base de données |

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 15.0 | Framework React |
| React | 19.0 | Bibliothèque UI |
| TypeScript | 5.7 | Langage |
| Tailwind CSS | 3.4 | Styling |
| TanStack React Query | 5.60 | Gestion d'état serveur |
| TanStack React Table | 8.21 | Tableaux de données |
| Axios | 1.7 | HTTP Client |
| React Hook Form | 7.54 | Gestion des formulaires |
| Zod | 3.24 | Validation de schémas |
| Recharts | 2.15 | Graphiques |
| Framer Motion | 11.11 | Animations |
| shadcn/ui | - | Composants UI |
| Lucide React | 0.460 | Icônes |
| Sonner | 1.7 | Notifications toast |

---

*Document mis à jour le : Juillet 2026*
*Version 1.0.0*
