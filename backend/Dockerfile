FROM php:8.4-cli-bookworm

RUN apt-get update -qq && apt-get install -y -qq libpq-dev && docker-php-ext-install -q pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json .env.example.prod ./
RUN cp .env.example.prod .env && composer install -q --no-dev --optimize-autoloader --no-interaction

COPY . .

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
