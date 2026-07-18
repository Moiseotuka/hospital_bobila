<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

$results = [];

try {
    require __DIR__ . '/../vendor/autoload.php';
    $results['autoload'] = 'OK';

    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $results['app'] = 'OK';
    $results['app_class'] = get_class($app);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => get_class($e) . ': ' . $e->getMessage(),
        'file' => $e->getFile() . ':' . $e->getLine(),
    ]);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true, 'results' => $results]);
