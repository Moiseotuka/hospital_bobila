FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_pgsql zip gd \
    && pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN if [ -f composer.lock ]; then cp composer.lock .; fi && \
    cp .env.example .env && \
    composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
