<?php

declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

try {
    json_ok(fetch_movies());
} catch (Throwable $e) {
    json_error('Failed to load movies: ' . $e->getMessage(), 500);
}
