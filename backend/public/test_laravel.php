<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

try {
    require __DIR__ . '/../vendor/autoload.php';

    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // Check PackageManifest
    $manifest = $app->make(\Illuminate\Foundation\PackageManifest::class);
    $manifestPath = $manifest->manifestPath;

    $results = [
        'manifest_path' => $manifestPath,
        'manifest_exists' => file_exists($manifestPath),
        'vendor_path' => $manifest->vendorPath(),
        'installed_json_exists' => file_exists(dirname($manifest->vendorPath()) . '/composer/installed.json'),
    ];

    // List all discovered providers
    $allProviders = $manifest->providers();
    $results['discovered_providers_count'] = count($allProviders);
    $results['discovered_providers'] = array_slice($allProviders, 0, 20);

    // Check if ViewServiceProvider is discovered
    $hasViewProvider = false;
    foreach ($allProviders as $p) {
        if (str_contains($p, 'ViewServiceProvider')) {
            $hasViewProvider = true;
            $results['view_provider_found'] = $p;
            break;
        }
    }
    if (!$hasViewProvider) {
        $results['view_provider_found'] = false;
    }

    // List registered providers
    $registeredProviders = array_keys($app->getLoadedProviders());
    $results['registered_providers_count'] = count($registeredProviders);

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
echo json_encode(['success' => true, 'results' => $results], JSON_PRETTY_PRINT);
