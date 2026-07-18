#!/bin/sh
set -e

php artisan migrate --force 2>&1 | tee /tmp/migrate.log || echo "Migration failed, continuing..."
php artisan db:seed --force 2>&1 | tee /tmp/seed.log || echo "Seed failed, continuing..."

exec php -S 0.0.0.0:${PORT:-10000} -t public public/index.php
