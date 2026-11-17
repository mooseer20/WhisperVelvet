<?php
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/_helpers.php';   // loads bootstrap → db()

try {
    $pdo = db();

    // 1. Basic connectivity
    $ping = $pdo->query('SELECT NOW() AS server_time, current_database() AS db_name, version() AS pg_version');
    $info = $ping->fetch();

    // 2. Check your main table exists + row count
    $count = $pdo->query('SELECT COUNT(*) AS total FROM movies_series')->fetch();

    // 3. Grab one sample row to confirm columns are readable
    $sample = $pdo->query('SELECT id, title, category FROM movies_series LIMIT 1')->fetch();

    echo json_encode([
        'status'     => 'connected',
        'server_time'=> $info['server_time'],
        'database'   => $info['db_name'],
        'pg_version' => explode(' ', $info['pg_version'])[0] . ' ' . explode(' ', $info['pg_version'])[1],
        'table'      => [
            'name'        => 'movies_series',
            'total_rows'  => (int) $count['total'],
            'sample_row'  => $sample ?: 'table is empty'
        ]
    ], JSON_PRETTY_PRINT);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => $e->getMessage(),
        'hint'    => 'Check backend/config/bootstrap.php — DB credentials in .env'
    ], JSON_PRETTY_PRINT);
}