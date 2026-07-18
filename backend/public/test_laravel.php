<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

try {
    require __DIR__ . '/../vendor/autoload.php';

    $app = require_once __DIR__ . '/../bootstrap/app.php';

    $manifest = $app->make(\Illuminate\Foundation\PackageManifest::class);

    $results = [];

    // Get manifest path via reflection if needed
    $ref = new ReflectionClass($manifest);
    $mp = $ref->getProperty('manifestPath');
    $mp->setAccessible(true);
    $results['manifest_path'] = $mp->getValue($manifest);
    $results['manifest_exists'] = file_exists($results['manifest_path']);

    $vp = $ref->getProperty('vendorPath');
    $vp->setAccessible(true);
    $results['vendor_path'] = $vp->getValue($manifest);

    // Get all providers
    $pm = $ref->getMethod('providers');
    $pm->setAccessible(true);
    $allProviders = $pm->invoke($manifest);
    $results['discovered_providers_count'] = count($allProviders);
    $results['discovered_providers'] = array_slice($allProviders, 0, 30);

    // Check ViewServiceProvider
    $found = array_filter($allProviders, fn($p) => str_contains($p, 'ViewService'));
    $results['view_provider'] = !empty($found) ? reset($found) : 'NOT FOUND';

    // Check other View-related providers
    $viewRelated = array_filter($allProviders, fn($p) => str_contains($p, 'View'));
    $results['view_related'] = array_values($viewRelated);

    // Check loaded providers
    $results['loaded_providers_count'] = count($app->getLoadedProviders());
    $loadedKeys = array_keys($app->getLoadedProviders());
    $viewLoaded = array_filter($loadedKeys, fn($k) => str_contains($k, 'View'));
    $results['loaded_view_providers'] = array_values($viewLoaded);

} catch (Throwable $e) {
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'error' => get_class($e) . ': ' . $e->getMessage(),
        'file' => $e->getFile() . ':' . $e->getLine(),
        'trace' => explode("\n", substr($e->getTraceAsString(), 0, 2000)),
    ]);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true, 'results' => $results], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
