<?php

declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$q = trim((string) ($_GET['q'] ?? ''));

if ($q === '') {
    json_ok([]);
}

try {
    $stmt = db()->prepare(
        'SELECT * FROM movies_series
         WHERE LOWER(title) LIKE :q
            OR LOWER(COALESCE(original_title, \'\')) LIKE :q
            OR LOWER(COALESCE(synopsis, \'\')) LIKE :q
            OR LOWER(COALESCE(long_description, \'\')) LIKE :q
         ORDER BY title ASC'
    );
    $like = '%' . strtolower($q) . '%';
    $stmt->execute(['q' => $like]);
    json_ok($stmt->fetchAll());
} catch (Throwable $e) {
    json_error('Search failed: ' . $e->getMessage(), 500);
}
