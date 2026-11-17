<?php

declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$title = trim((string) ($_GET['title'] ?? ''));

if ($title === '') {
    json_error('Missing ?title', 422);
}

try {
    json_ok(fetch_related_by_title($title));
} catch (Throwable $e) {
    json_error('Failed to load related titles: ' . $e->getMessage(), 500);
}
