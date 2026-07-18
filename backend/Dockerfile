FROM php:8.4-cli-alpine

RUN apk add --no-cache postgresql-dev build-base git unzip && \
    docker-php-ext-install -j4 pdo_pgsql && \
    apk del build-base

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer --quiet && \
    php -r "unlink('composer-setup.php');"

WORKDIR /app
COPY . .

RUN cp .env.example.prod .env && \
    composer install --no-dev --optimize-autoloader --no-interaction --quiet

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
