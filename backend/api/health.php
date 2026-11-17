<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/bootstrap.php';

try {
    $pdo = db();
    $count = (int) $pdo->query('SELECT COUNT(*) FROM movies_series')->fetchColumn();
    $users = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();

    json_ok([
        'status' => 'ok',
        'database' => env('DB_NAME', 'vampires'),
        'movies_series_count' => $count,
        'users_count' => $users,
    ]);
} catch (Throwable $e) {
    json_error('Database connection failed: ' . $e->getMessage(), 500);
}
