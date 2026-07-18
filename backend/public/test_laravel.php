<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

$results = [];

try {
    // Read packages.php content directly
    $manifestPath = __DIR__ . '/../bootstrap/cache/packages.php';
    $results['packages_php_raw'] = file_get_contents($manifestPath);

    // Check which packages are in installed.json
    $raw = file_get_contents(__DIR__ . '/../vendor/composer/installed.json');
    $installed = json_decode($raw, true);
    $packages = $installed['packages'] ?? $installed;

    $names = [];
    foreach ($packages as $p) {
        if (is_array($p) && isset($p['name'])) {
            $names[] = $p['name'];
        }
    }
    sort($names);
    $results['package_names'] = $names;

    // Check how Application registers core providers
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // Check the base service providers
    $ref = new ReflectionClass($app);
    $baseProviders = $ref->getProperty('baseProviders');
    $baseProviders->setAccessible(true);
    $results['base_providers'] = $baseProviders->getValue($app);

    // Check loaded providers
    $results['loaded_providers'] = array_keys($app->getLoadedProviders());

    // Check bootstrap/providers.php
    $bootstrapProviders = require __DIR__ . '/../bootstrap/providers.php';
    $results['bootstrap_providers'] = $bootstrapProviders;

    // Check what the kernel uses
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    $kernelRef = new ReflectionClass($kernel);
    $bootstrappers = $kernelRef->getProperty('bootstrappers');
    $bootstrappers->setAccessible(true);
    $results['kernel_bootstrappers'] = $bootstrappers->getValue($kernel);

    // Check middleware
    $middlewareRef = $kernelRef->getProperty('middlewareGroups');
    $middlewareRef->setAccessible(true);
    $results['middleware_groups'] = array_keys($middlewareRef->getValue($kernel));

} catch (Throwable $e) {
    $results['error'] = get_class($e) . ': ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

echo json_encode(['results' => $results], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
