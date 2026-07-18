FROM php:8.4-cli-alpine
RUN apk add --no-cache postgresql-dev
RUN docker-php-ext-install -j4 pdo_pgsql
CMD php -m | grep -i pdo
