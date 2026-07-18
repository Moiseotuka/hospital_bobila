<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

try {
    // Read installed.json directly
    $installedJson = __DIR__ . '/../vendor/composer/installed.json';
    $installed = json_decode(file_get_contents($installedJson), true);

    $results = [
        'installed_json_exists' => file_exists($installedJson),
        'installed_size' => file_exists($installedJson) ? filesize($installedJson) : 0,
    ];

    if (!file_exists($installedJson)) {
        $results['error'] = 'installed.json not found';
        echo json_encode(['success' => false, 'results' => $results], JSON_PRETTY_PRINT);
        exit;
    }

    // Count packages with laravel providers
    $packagesWithProviders = [];
    $packagesWithAliases = [];
    foreach ($installed as $package) {
        if (isset($package['extra']['laravel']['providers'])) {
            $packagesWithProviders[$package['name']] = $package['extra']['laravel']['providers'];
        }
        if (isset($package['extra']['laravel']['aliases'])) {
            $packagesWithAliases[$package['name']] = array_keys($package['extra']['laravel']['aliases']);
        }
    }

    $results['total_packages'] = count($installed);
    $results['packages_with_providers'] = array_keys($packagesWithProviders);
    $results['all_providers'] = array_values(array_merge(...array_values($packagesWithProviders)));

    // Check specifically for illuminate packages
    $illuminatePackages = array_filter($installed, fn($p) => str_starts_with($p['name'], 'illuminate/'));
    $results['illuminate_count'] = count($illuminatePackages);
    $illuminateProviders = [];
    foreach ($illuminatePackages as $p) {
        if (isset($p['extra']['laravel']['providers'])) {
            $illuminateProviders[$p['name']] = $p['extra']['laravel']['providers'];
        }
    }
    $results['illuminate_with_providers'] = $illuminateProviders;

    // Read packages.php
    $manifestPath = __DIR__ . '/../bootstrap/cache/packages.php';
    $results['packages_php_exists'] = file_exists($manifestPath);
    if (file_exists($manifestPath)) {
        $manifestContent = require $manifestPath;
        $results['packages_php_providers'] = $manifestContent['providers'] ?? [];
        $results['packages_php_aliases'] = $manifestContent['aliases'] ?? [];
        $results['packages_php_how_many'] = count($manifestContent['providers'] ?? []);
    }

    // Also check if there's a packages.php generation mechanism
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $manifest = $app->make(\Illuminate\Foundation\PackageManifest::class);

    // Force manifest rebuild to see what would be generated
    try {
        $manifest->build();
        $results['after_rebuild'] = file_exists($manifestPath) ? 'exists' : 'not exists';
        if (file_exists($manifestPath)) {
            $after = require $manifestPath;
            $results['rebuild_providers_count'] = count($after['providers'] ?? []);
            $results['rebuild_providers'] = $after['providers'] ?? [];
        }
    } catch (Throwable $e) {
        $results['rebuild_error'] = $e->getMessage();
    }

} catch (Throwable $e) {
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'error' => get_class($e) . ': ' . $e->getMessage(),
        'file' => $e->getFile() . ':' . $e->getLine(),
    ]);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true, 'results' => $results], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
