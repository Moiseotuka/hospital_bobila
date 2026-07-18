FROM php:8.4-cli-alpine

RUN apk add --no-cache postgresql-dev unzip && \
    docker-php-ext-install -j4 pdo_pgsql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

WORKDIR /app
COPY composer.json .env.example.prod ./
RUN cp .env.example.prod .env && \
    composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist 2>&1

CMD echo "build complete"
