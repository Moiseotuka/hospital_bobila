FROM php:8.4-cli

RUN apt-get update && apt-get install -y libpq-dev libzip-dev unzip git \
    && docker-php-ext-install pdo_pgsql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN cp .env.example .env && composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
