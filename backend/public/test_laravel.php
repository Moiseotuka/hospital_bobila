<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

$results = [];

try {
    $installedJson = __DIR__ . '/../vendor/composer/installed.json';
    $results['installed_json_exists'] = file_exists($installedJson);
    $results['installed_size'] = file_exists($installedJson) ? filesize($installedJson) : 0;

    if (!file_exists($installedJson)) {
        echo json_encode(['error' => 'installed.json not found']);
        exit;
    }

    $raw = file_get_contents($installedJson);
    $installed = json_decode($raw, true);

    // Composer 2.x wraps in {packages: [...], dev: bool}
    $packages = $installed['packages'] ?? $installed;
    $results['total_packages'] = count($packages);
    $results['format'] = isset($installed['packages']) ? 'composer2' : 'composer1';

    // Find packages with laravel providers
    $allProviders = [];
    foreach ($packages as $p) {
        if (is_array($p) && isset($p['extra']['laravel']['providers'])) {
            $allProviders = array_merge($allProviders, $p['extra']['laravel']['providers']);
        }
    }
    $results['all_providers_from_installed'] = $allProviders;
    $results['provider_count'] = count($allProviders);

    // Check illuminate packages
    $illuminateWithProviders = [];
    $illuminateTotal = 0;
    foreach ($packages as $p) {
        if (is_array($p) && isset($p['name']) && str_starts_with($p['name'], 'illuminate/')) {
            $illuminateTotal++;
            if (isset($p['extra']['laravel']['providers'])) {
                $illuminateWithProviders[$p['name']] = $p['extra']['laravel']['providers'];
            }
        }
    }
    $results['illuminate_total'] = $illuminateTotal;
    $results['illuminate_with_providers'] = $illuminateWithProviders;

    // Read packages.php
    $manifestPath = __DIR__ . '/../bootstrap/cache/packages.php';
    $results['packages_php_exists'] = file_exists($manifestPath);
    if (file_exists($manifestPath)) {
        $results['packages_php_content_length'] = filesize($manifestPath);
        $manifestContent = require $manifestPath;
        $results['packages_php_providers'] = $manifestContent['providers'] ?? [];
        $results['packages_php_aliases'] = $manifestContent['aliases'] ?? [];
    }

} catch (Throwable $e) {
    $results['error'] = get_class($e) . ': ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

echo json_encode(['results' => $results], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
