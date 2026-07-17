# Guide d'Installation - Système de Gestion de Paie
## Hôpital Militaire Central Camp Kokolo

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation Backend (Laravel)](#installation-backend-laravel)
3. [Installation Frontend (Next.js)](#installation-frontend-nextjs)
4. [Configuration PostgreSQL](#configuration-postgresql)
5. [Configuration du Serveur Web](#configuration-du-serveur-web)
6. [Déploiement en Production](#déploiement-en-production)
7. [Maintenance](#maintenance)
8. [Dépannage](#dépannage)

---

## Prérequis

Avant de commencer l'installation, assurez-vous d'avoir les éléments suivants installés sur votre environnement :

| Logiciel | Version minimale | Recommandé |
|----------|-----------------|------------|
| PHP | 8.4+ | 8.4 |
| Composer | 2.x | 2.8+ |
| Node.js | 22+ | 22.x LTS |
| PostgreSQL | 16+ | 16.x |
| Git | 2.x | 2.47+ |
| Serveur Web | - | Nginx 1.26+ / Apache 2.4+ |
| Supervisor | - | 4.x (optionnel, pour les queues) |
| Redis | 7+ | 7.4+ (optionnel, pour cache et sessions) |

### Extensions PHP requises

- `ext-ctype`
- `ext-curl`
- `ext-dom`
- `ext-fileinfo`
- `ext-filter`
- `ext-hash`
- `ext-intl`
- `ext-json`
- `ext-mbstring`
- `ext-openssl`
- `ext-pcre`
- `ext-pdo`
- `ext-pdo_pgsql`
- `ext-session`
- `ext-tokenizer`
- `ext-xml`
- `ext-xmlwriter`
- `ext-gd` (pour la génération de QR codes)
- `ext-bcmath` (pour les calculs de précision)

---

## Installation Backend (Laravel)

### 1. Cloner le projet

```bash
git clone <url-du-depot> gestion-paie-hopital
cd gestion-paie-hopital/backend
```

### 2. Installer les dépendances PHP

```bash
composer install --no-interaction --prefer-dist
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos paramètres :

```env
APP_NAME="Gestion Paie - Hôpital Militaire"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gestion_paie
DB_USERNAME=postgres
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DRIVER=file
CACHE_STORE=file
```

### 4. Générer la clé d'application

```bash
php artisan key:generate
```

### 5. Créer la base de données PostgreSQL

Connectez-vous à PostgreSQL :

```bash
psql -U postgres
```

Créez la base de données :

```sql
CREATE DATABASE gestion_paie WITH ENCODING 'UTF8';
CREATE USER paie_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE gestion_paie TO paie_user;
\c gestion_paie
GRANT ALL ON SCHEMA public TO paie_user;
\q
```

### 6. Exécuter les migrations

```bash
php artisan migrate --force
```

### 7. Exécuter les seeders

```bash
php artisan db:seed --class=AdminUserSeeder
php artisan db:seed --class=RolePermissionSeeder
php artisan db:seed --class=DepartementSeeder
php artisan db:seed --class=ServiceSeeder
php artisan db:seed --class=GradeSeeder
php artisan db:seed --class=FonctionSeeder
php artisan db:seed --class=CategorieSalarialeSeeder
php artisan db:seed --class=PrimeSeeder
php artisan db:seed --class=RetenueSeeder
php artisan db:seed --class=HospitalSettingSeeder
php artisan db:seed --class=AgentSeeder
```

Pour exécuter tous les seeders en une seule commande :

```bash
php artisan db:seed
```

### 8. Configurer Sanctum

Publiez la configuration de Sanctum si nécessaire :

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Assurez-vous que le fichier `config/sanctum.php` contient :

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000')),
```

### 9. Optimiser Laravel

```bash
php artisan optimize
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 10. Configurer le serveur de développement

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

---

## Installation Frontend (Next.js)

### 1. Installer les dépendances Node.js

```bash
cd gestion-paie-hopital/frontend
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.local.example .env.local
```

Éditez le fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Gestion Paie - Hôpital Militaire"
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Accédez à l'application sur `http://localhost:3000`.

### 4. Construire pour la production

```bash
npm run build
npm start
```

---

## Configuration PostgreSQL

### Fichier de configuration recommandé (`postgresql.conf`)

```ini
# Connexions
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 768MB
work_mem = 6553kB
maintenance_work_mem = 64MB

# Écriture
wal_level = replica
synchronous_commit = on
checkpoint_completion_target = 0.9

# Locale
lc_messages = 'fr_FR.UTF-8'
lc_monetary = 'fr_CD.UTF-8'
lc_numeric = 'fr_CD.UTF-8'
lc_time = 'fr_FR.UTF-8'
```

### Optimisation des performances

```sql
-- Analyse des tables
VACUUM ANALYZE;

-- Mise à jour des statistiques
ANALYZE;

-- Index recommandés (créés automatiquement par les migrations)
CREATE INDEX IF NOT EXISTS idx_agents_matricule ON agents(matricule);
CREATE INDEX IF NOT EXISTS idx_agents_statut ON agents(situation);
CREATE INDEX IF NOT EXISTS idx_bulletins_periode ON bulletins_paie(periode_paie_id);
CREATE INDEX IF NOT EXISTS idx_paiements_statut ON paiements(statut);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
```

---

## Configuration du Serveur Web

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name paie.hopital-militaire.cd;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name paie.hopital-militaire.cd;

    root /var/www/gestion-paie/backend/public;
    index index.php;

    # Certificats SSL
    ssl_certificate /etc/ssl/certs/hopital-militaire.crt;
    ssl_certificate_key /etc/ssl/private/hopital-militaire.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend (Next.js)
    location /_next {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Backend
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
    }

    # Sécurité
    location ~ /\.(?!well-known) {
        deny all;
    }

    location ~ /(config|database|resources|storage/app/public) {
        deny all;
        return 404;
    }

    # Cache des assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript image/svg+xml;
}
```

### Configuration Apache

```apache
<VirtualHost *:80>
    ServerName paie.hopital-militaire.cd
    Redirect permanent / https://paie.hopital-militaire.cd/
</VirtualHost>

<VirtualHost *:443>
    ServerName paie.hopital-militaire.cd
    DocumentRoot /var/www/gestion-paie/backend/public

    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/hopital-militaire.crt
    SSLCertificateKeyFile /etc/ssl/private/hopital-militaire.key

    <Directory /var/www/gestion-paie/backend/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Frontend proxy
    ProxyPass /_next http://localhost:3000/_next
    ProxyPassReverse /_next http://localhost:3000/_next

    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/gestion-paie-error.log
    CustomLog ${APACHE_LOG_DIR}/gestion-paie-access.log combined
</VirtualHost>
```

---

## Déploiement en Production

### 1. Variables d'environnement de production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://paie.hopital-militaire.cd

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=gestion_paie
DB_USERNAME=paie_user
DB_PASSWORD=your_secure_password

SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

### 2. Configuration SSL

```bash
# Avec Certbot (Let's Encrypt)
certbot --nginx -d paie.hopital-militaire.cd

# Ou avec un certificat personnalisé
cp votre-certificat.crt /etc/ssl/certs/
cp votre-cle-privee.key /etc/ssl/private/
```

### 3. Optimisation de Laravel

```bash
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 4. Configuration Supervisor (Queues)

Créez le fichier `/etc/supervisor/conf.d/gestion-paie-worker.conf` :

```ini
[program:gestion-paie-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/gestion-paie/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/gestion-paie/backend/storage/logs/worker.log
stopwaitsecs=3600
```

Rechargez Supervisor :

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start gestion-paie-worker:*
```

### 5. Configuration du stockage

```bash
php artisan storage:link
```

Assurez-vous que les permissions sont correctes :

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 6. Script de déploiement automatisé

Créez un script `deploy.sh` :

```bash
#!/bin/bash
set -e

echo "Déploiement du système de gestion de paie..."

cd /var/www/gestion-paie

# Backend
cd backend
git pull origin main
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
php artisan migrate --force
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo supervisorctl restart gestion-paie-worker:*

# Frontend
cd ../frontend
git pull origin main
npm ci --production
npm run build

# Redémarrage
pm2 restart gestion-paie-frontend

echo "Déploiement terminé avec succès."
```

---

## Maintenance

### Sauvegarde

#### Script de sauvegarde de la base de données

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/gestion-paie"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="gestion_paie"
DB_USER="paie_user"

mkdir -p "$BACKUP_DIR"

# Sauvegarde PostgreSQL
pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Sauvegarde des fichiers
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" \
    -C /var/www/gestion-paie \
    backend/storage/app \
    backend/storage/logs

# Nettoyage des sauvegardes de plus de 30 jours
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete

echo "Sauvegarde terminée : $DATE"
```

Ajoutez une tâche cron pour la sauvegarde automatique :

```cron
0 2 * * * /var/www/gestion-paie/scripts/backup.sh
```

### Mise à jour

```bash
# Backend
cd backend
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize:clear
php artisan optimize

# Frontend
cd ../frontend
git pull
npm ci --production
npm run build
```

### Journalisation

Les logs sont accessibles dans :

- Logs Laravel : `backend/storage/logs/laravel.log`
- Logs Worker : `backend/storage/logs/worker.log`
- Logs Nginx : `/var/log/nginx/gestion-paie-*.log`
- Logs PostgreSQL : `/var/log/postgresql/postgresql-*.log`

### Surveillance

- **Application** : Vérifiez l'état de santé via `GET /api/health` (à implémenter)
- **Queue** : Horizon dashboard accessible via `GET /horizon` (si configuré)
- **Base de données** : Utilisez `pg_stat_activity` pour surveiller les connexions

---

## Dépannage

### Problèmes courants

#### 1. Erreur de connexion à la base de données

**Symptôme :** `SQLSTATE[08006] [7] could not connect to server`

**Solutions :**
```bash
# Vérifier que PostgreSQL est en cours d'exécution
sudo systemctl status postgresql

# Vérifier les identifiants dans .env
# Vérifier que le port est correct (5432 par défaut)
# Vérifier que pg_hba.conf autorise les connexions
```

#### 2. Erreur 419 Page Expired (Sanctum)

**Symptôme :** Les requêtes API retournent une erreur 419

**Solutions :**
```bash
# Vérifier la configuration SESSION_DRIVER
# S'assurer que SANCTUM_STATEFUL_DOMAINS est correct
# Supprimer le cache
php artisan optimize:clear
```

#### 3. Erreur 500 - Internal Server Error

**Solutions :**
```bash
# Vérifier les logs Laravel
tail -f storage/logs/laravel.log

# Vérifier les permissions
chmod -R 775 storage bootstrap/cache

# Vérifier les extensions PHP
php -m | grep -E "pdo|pgsql|xml|gd|mbstring"
```

#### 4. Problèmes de permissions

```bash
# Corriger les permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
sudo chmod -R 775 public/uploads
```

#### 5. QR Code non généré

**Symptôme :** Les bulletins de paie n'affichent pas le QR code

**Solutions :**
```bash
# Vérifier que l'extension GD est installée
php -m | grep gd

# Vérifier la configuration du stockage
php artisan storage:link
```

---

## Contacts

Pour toute assistance technique :

- **Développeur** : [À compléter]
- **Administrateur système** : [À compléter]
- **Support technique** : [À compléter]

---

*Document mis à jour le : Juillet 2026*
*Version 1.0.0*
