FROM php:8.4-cli-alpine

RUN apk add --no-cache postgresql-dev unzip && \
    docker-php-ext-install -j4 pdo_pgsql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist --no-audit

COPY .env.example.prod ./
RUN cp .env.example.prod .env

COPY . .
RUN mkdir -p bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache && \
    chmod -R 777 bootstrap/cache storage

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
