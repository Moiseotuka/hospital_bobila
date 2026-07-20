FROM php:8.4-fpm-alpine

RUN apk add --no-cache postgresql-dev unzip nginx supervisor && \
    docker-php-ext-install -j4 pdo_pgsql && \
    docker-php-ext-enable pdo_pgsql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist

COPY . .

RUN mkdir -p bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache storage/logs && \
    chmod -R 777 bootstrap/cache storage

COPY nginx.conf /etc/nginx/http.d/default.conf

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
