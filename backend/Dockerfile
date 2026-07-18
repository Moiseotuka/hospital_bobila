FROM php:8.4-cli

RUN apt-get update && apt-get install -y libpq-dev unzip git \
    && docker-php-ext-install pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json ./
COPY .env.example .env
RUN composer install --no-interaction --no-scripts --no-dev --optimize-autoloader

COPY . .

RUN php artisan key:generate

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
