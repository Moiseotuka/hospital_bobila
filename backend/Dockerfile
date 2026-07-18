FROM php:8.4-cli-alpine
RUN apk add --no-cache postgresql-dev libzip-dev libxml2-dev unzip && \
    docker-php-ext-install -j4 pdo_pgsql zip dom xml
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"
WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist --ignore-platform-req=ext-* 2>&1
CMD php -v
