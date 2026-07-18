FROM kalidyasin/php:8.4-cli-alpine

WORKDIR /app
COPY . .

RUN cp .env.example.prod .env && \
    composer install --no-dev --optimize-autoloader --no-interaction && \
    php artisan key:generate

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
