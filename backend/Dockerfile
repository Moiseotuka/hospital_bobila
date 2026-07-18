FROM php:8.4-cli-alpine

RUN apk add --no-cache postgresql-dev && docker-php-ext-install pdo_pgsql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

WORKDIR /app
COPY composer.json .env.example.prod ./
RUN cp .env.example.prod .env && composer install --no-dev --optimize-autoloader --no-interaction

COPY . .

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
