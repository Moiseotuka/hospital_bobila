FROM php:8.4-cli-alpine

RUN apk add --no-cache postgresql-dev unzip && \
    docker-php-ext-install -j4 pdo_pgsql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

RUN composer create-project laravel/laravel skeleton --no-dev --no-interaction --prefer-dist --no-install 2>&1 && \
    cp -r skeleton/public/index.php public/index.php && \
    cp skeleton/artisan . && \
    cp -r skeleton/bootstrap/* bootstrap/ && \
    cp -r skeleton/config/* config/ && \
    cp -r skeleton/resources/views/* resources/views/ && \
    cp -r skeleton/database/migrations/* database/migrations/ && \
    rm -rf skeleton

WORKDIR /app
COPY . .

RUN mkdir -p bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache && \
    chmod -R 777 bootstrap/cache storage

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist --no-audit 2>&1

RUN cp .env.example.prod .env || true

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
