# 🏥 Gestion Paie - Hôpital Militaire Central Camp Kokolo

<div align="center">

![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=flat-square&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.0-000000?style=flat-square&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/Licence-Propriétaire-red?style=flat-square)

**Système complet de gestion de paie pour l'Hôpital Militaire Central Camp Kokolo (RDC)**

</div>

---

## Description

**Gestion Paie** est une application web full-stack conçue pour automatiser et simplifier la gestion de la paie du personnel militaire et civil de l'Hôpital Militaire Central Camp Kokolo à Kinshasa, République Démocratique du Congo.

Le système permet de gérer l'ensemble du cycle de paie : gestion des agents, définition des grilles salariales, calcul automatique des salaires avec primes et retenues, génération de bulletins de paie sécurisés (QR code), traitement des paiements, et production de rapports analytiques.

---

## Fonctionnalités

### Modules principaux

| # | Module | Description |
|---|--------|-------------|
| 1 | **Authentification & Sécurité** | Connexion sécurisée via Laravel Sanctum, gestion de session, protection CSRF |
| 2 | **Tableau de bord** | Vue d'ensemble avec indicateurs clés, graphiques d'évolution et alertes |
| 3 | **Gestion des agents** | CRUD complet avec soft delete, filtres, recherche, export PDF/Excel |
| 4 | **Grades** | Grille des grades avec salaire de base et prime associée |
| 5 | **Fonctions** | Fonctions des agents avec prime de fonction |
| 6 | **Départements** | Structure organisationnelle avec chefs de département |
| 7 | **Services** | Services rattachés aux départements avec chefs de service |
| 8 | **Catégories salariales** | Grilles indiciaires avec salaire base et indemnités |
| 9 | **Primes** | Gestion des primes (montant fixe ou pourcentage) avec activation/désactivation |
| 10 | **Retenues** | Gestion des retenues (impôt, CNSS, cotisations) avec calcul automatique |
| 11 | **Calcul de la paie** | Génération automatisée des bulletins avec formules configurables |
| 12 | **Paiements** | Paiement individuel ou collectif, annulation avec motif |
| 13 | **Bulletins de paie** | Consultation, impression, téléchargement PDF, envoi email, QR code |
| 14 | **Rapports** | Rapports mensuel/annuel, masse salariale, agents impayés |
| 15 | **Journal d'audit** | Traçabilité complète de toutes les actions avec filtres et export |
| 16 | **Paramètres** | Configuration de l'hôpital, logo, signature, cachet, taux |

---

## Technologies

### Backend

| Technologie | Rôle |
|-------------|------|
| [PHP 8.4](https://www.php.net/) | Langage de programmation |
| [Laravel 12](https://laravel.com/) | Framework PHP (MVC) |
| [Laravel Sanctum](https://laravel.com/docs/sanctum) | Authentification API |
| [Laravel Horizon](https://laravel.com/docs/horizon) | Gestion des queues Redis |
| [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission) | RBAC (rôles et permissions) |
| [Laravel DomPDF](https://github.com/barryvdh/laravel-dompdf) | Génération de PDF |
| [Laravel Excel](https://docs.laravel-excel.com/) | Export de fichiers Excel |
| [Simple QRCode](https://www.simplesoftware.io/docs/simple-qrcode) | Génération de QR codes |
| [PostgreSQL 16](https://www.postgresql.org/) | Base de données relationnelle |

### Frontend

| Technologie | Rôle |
|-------------|------|
| [Next.js 15](https://nextjs.org/) | Framework React (App Router) |
| [React 19](https://react.dev/) | Bibliothèque d'interface utilisateur |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Typage statique |
| [Tailwind CSS 3.4](https://tailwindcss.com/) | Framework CSS utilitaire |
| [TanStack React Query 5](https://tanstack.com/query) | Gestion d'état serveur et cache |
| [TanStack React Table 8](https://tanstack.com/table) | Tableaux de données performants |
| [React Hook Form 7](https://react-hook-form.com/) | Gestion des formulaires |
| [Zod 3](https://zod.dev/) | Validation de schémas |
| [Recharts 2](https://recharts.org/) | Graphiques et visualisation |
| [shadcn/ui](https://ui.shadcn.com/) | Composants d'interface réutilisables |
| [Framer Motion 11](https://www.framer.com/motion/) | Animations |
| [Axios](https://axios-http.com/) | Client HTTP |

---

## Installation

Consultez le guide d'installation complet :

➡️ **[INSTALLATION.md](INSTALLATION.md)**

**Prérequis rapides :**
- PHP 8.4+, Composer 2.x, Node.js 22+, PostgreSQL 16+
- Extensions PHP : pdo_pgsql, gd, bcmath, xml, mbstring

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## Documentation

| Document | Description |
|----------|-------------|
| **[INSTALLATION.md](INSTALLATION.md)** | Guide d'installation complet (prérequis, configuration, déploiement, maintenance) |
| **[DEVELOPPEUR.md](DEVELOPPEUR.md)** | Documentation technique (architecture, API, modèles, services, conventions) |
| **[UTILISATEUR.md](UTILISATEUR.md)** | Manuel utilisateur (tous les modules, captures, FAQ) |

---

## Structure du Projet

```
GESTION_HOSP/
├── backend/                         # Application Laravel
│   ├── app/
│   │   ├── Enums/                   # Énumérations PHP
│   │   ├── Exports/                 # Exportations Excel
│   │   ├── Http/
│   │   │   ├── Controllers/Api/     # 18 contrôleurs API
│   │   │   ├── Middleware/          # Middleware de rôles
│   │   │   ├── Requests/           # FormRequest de validation
│   │   │   └── Resources/          # API Resources
│   │   ├── Models/                  # 14 modèles Eloquent
│   │   └── Services/               # 5 services métier
│   ├── database/
│   │   ├── migrations/              # 19 migrations
│   │   └── seeders/                 # 11 seeders
│   ├── routes/api.php               # 60+ routes API
│   └── tests/                       # Tests Feature/Unit
├── frontend/                        # Application Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/             # Pages d'authentification
│   │   │   └── (dashboard)/        # 16 modules (pages)
│   │   ├── components/
│   │   │   ├── layout/             # 11 composants de mise en page
│   │   │   └── ui/                 # 30 composants UI (shadcn)
│   │   ├── hooks/                   # 3 hooks personnalisés
│   │   ├── lib/                     # 3 utilitaires
│   │   ├── services/                # 17 services frontend
│   │   └── types/                   # Types TypeScript
│   └── package.json
├── INSTALLATION.md                  # Guide d'installation
├── DEVELOPPEUR.md                   # Documentation développeur
├── UTILISATEUR.md                   # Manuel utilisateur
└── README.md                        # Ce fichier
```

---

## Captures d'écran

*À ajouter ultérieurement.*

---

## Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | `admin@hopital-militaire.cd` | `password` |
| Chef RH | `chef-rh@hopital-militaire.cd` | `password` |
| Comptable | `comptable@hopital-militaire.cd` | `password` |
| Direction | `direction@hopital-militaire.cd` | `password` |
| Auditeur | `auditeur@hopital-militaire.cd` | `password` |

> **⚠️ Changez immédiatement les mots de passe par défaut en production.**

---

## Rôles et Permissions

| Rôle | Accès |
|------|-------|
| **Administrateur** | Accès complet à toutes les fonctionnalités |
| **Chef RH** | Gestion des agents, paie, rapports |
| **Comptable** | Paiements, consultation des données |
| **Direction** | Consultation, rapports et statistiques |
| **Auditeur** | Consultation et export du journal d'audit |

---

## Licence

**Propriétaire** — Tous droits réservés.

© 2026 Hôpital Militaire Central Camp Kokolo — Kinshasa, République Démocratique du Congo.

Ce logiciel est la propriété exclusive de l'Hôpital Militaire Central Camp Kokolo. Toute reproduction, distribution ou modification sans autorisation écrite préalable est strictement interdite.

---

## Contact

- **Hôpital Militaire Central Camp Kokolo**
- Kinshasa / Gombe, RDC
- Email : [À compléter]
- Téléphone : [À compléter]

---

<div align="center">
Développé avec ❤️ pour l'Hôpital Militaire Central Camp Kokolo
</div>
