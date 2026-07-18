<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . '/public' . $uri;

if (in_array($uri, ['/health.php', '/info.php']) && file_exists($file)) {
    require $file;
    return true;
}

if (file_exists($file) && !is_dir($file)) {
    return false;
}

require __DIR__ . '/public/index.php';
