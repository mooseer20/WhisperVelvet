<?php

declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$title = trim((string) ($_GET['title'] ?? ''));

if ($title === '') {
    json_error('Missing ?title', 422);
}

try {
    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT b.*
         FROM books b
         INNER JOIN movies_series m ON m.id = b.movie_id
         WHERE m.title = :title
         ORDER BY b.title ASC'
    );
    $stmt->execute(['title' => $title]);
    json_ok($stmt->fetchAll());
} catch (PDOException) {
    json_ok([]);
} catch (Throwable $e) {
    json_error('Failed to load books: ' . $e->getMessage(), 500);
}
