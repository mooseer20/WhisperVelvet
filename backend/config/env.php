<?php
/**
 * Load environment from docs/.env (copy from env.example).
 */

declare(strict_types=1);

function env(string $key, ?string $default = null): ?string
{
    static $loaded = false;
    static $vars = [];

    if (!$loaded) {
        $paths = [
            dirname(__DIR__, 2) . '/docs/.env',
            dirname(__DIR__, 2) . '/.env',
        ];
        foreach ($paths as $path) {
            if (!is_readable($path)) {
                continue;
            }
            foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                    continue;
                }
                [$k, $v] = explode('=', $line, 2);
                $vars[trim($k)] = trim($v, " \t\"'");
            }
            break;
        }
        $loaded = true;
    }

    return $vars[$key] ?? $default;
}
