<?php
// backend/api/ratings.php
// GET ?title=X&action=avg  → { average, count }
// POST { title, rating, username }  → upsert (one rating per user per title)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../db.php'; // expects $pdo

function jsonError(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// GET — average rating + count for a title
// ?title=Lucifer&action=avg
// ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $title  = trim($_GET['title']  ?? '');
    $action = trim($_GET['action'] ?? 'avg');
    if (!$title) jsonError('title is required');

    try {
        $stmt = $pdo->prepare(
            "SELECT ROUND(AVG(rating), 1) AS average, COUNT(*) AS count
             FROM user_ratings
             WHERE movie_title = :title"
        );
        $stmt->execute([':title' => $title]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'average' => $row['average'] ?? null,
            'count'   => (int)($row['count'] ?? 0),
        ]);
    } catch (PDOException $e) {
        jsonError('DB error: ' . $e->getMessage(), 500);
    }
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST — upsert a user's rating
// Body: { title, rating (1-5), username }
// One rating per (movie_title, username) — updates if exists
// ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body     = json_decode(file_get_contents('php://input'), true);
    if (!$body) jsonError('Invalid JSON body');

    $title    = mb_substr(trim($body['title']    ?? ''), 0, 255);
    $rating   = (int)($body['rating'] ?? 0);
    $username = mb_substr(trim($body['username'] ?? ''), 0, 100);

    if (!$title)                         jsonError('title is required');
    if ($rating < 1 || $rating > 5)      jsonError('rating must be 1–5');

    // Use IP as anonymous identifier if no username supplied
    if (!$username) {
        $ip       = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'anon';
        $username = 'guest_' . md5($ip . $title);
    }

    try {
        // INSERT … ON DUPLICATE KEY UPDATE handles the upsert cleanly
        $stmt = $pdo->prepare(
            "INSERT INTO user_ratings (movie_title, username, rating)
             VALUES (:title, :username, :rating)
             ON DUPLICATE KEY UPDATE rating = VALUES(rating)"
        );
        $stmt->execute([
            ':title'    => $title,
            ':username' => $username,
            ':rating'   => $rating,
        ]);

        // Return fresh average after upsert
        $avg = $pdo->prepare("SELECT ROUND(AVG(rating),1) AS avg, COUNT(*) AS cnt FROM user_ratings WHERE movie_title = :title");
        $avg->execute([':title' => $title]);
        $row = $avg->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'ok'      => true,
            'average' => $row['avg'] ?? $rating,
            'count'   => (int)($row['cnt'] ?? 1),
        ]);
    } catch (PDOException $e) {
        jsonError('DB error: ' . $e->getMessage(), 500);
    }
    exit;
}

jsonError('Method not allowed', 405);