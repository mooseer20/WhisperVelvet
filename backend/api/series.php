<?php

declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

try {
    json_ok(fetch_series());
} catch (Throwable $e) {
    json_error('Failed to load series: ' . $e->getMessage(), 500);
}
