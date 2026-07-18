FROM php:8.4-cli-alpine

RUN apk add --no-cache postgresql-dev unzip && \
    docker-php-ext-install -j4 pdo_pgsql

ADD https://getcomposer.org/download/latest-stable/composer.phar /usr/local/bin/composer
RUN chmod +x /usr/local/bin/composer

WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist --no-audit

COPY . .
RUN php artisan key:generate --force

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
