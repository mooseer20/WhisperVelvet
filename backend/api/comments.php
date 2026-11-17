<?php
// backend/api/comments.php
// Handles GET (load paginated comments) and POST (submit a comment)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── DB config — adjust to match your existing connection setup ──
require_once __DIR__ . '/../db.php'; // expects: $pdo (PDO instance)
// If you use mysqli, swap to: require_once __DIR__ . '/../db_mysqli.php';

// ── Helpers ──
function jsonError(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

function sanitize(string $str, int $max = 1000): string {
    return mb_substr(trim(strip_tags($str)), 0, $max);
}

// ─────────────────────────────────────────────────────────────
// GET — load paginated comments for a title
// ?title=Lucifer&page=1&limit=8
// ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $title = isset($_GET['title']) ? trim($_GET['title']) : '';
    $page  = max(1, (int)($_GET['page']  ?? 1));
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 8)));
    if (!$title) jsonError('title is required');

    $offset = ($page - 1) * $limit;

    try {
        $stmt = $pdo->prepare(
            "SELECT id, username, avatar_url, `text`, rating,
                    DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') AS created_at
             FROM comments
             WHERE movie_title = :title
             ORDER BY created_at DESC
             LIMIT :limit OFFSET :offset"
        );
        $stmt->bindValue(':title',  $title,  PDO::PARAM_STR);
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(['comments' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (PDOException $e) {
        jsonError('DB error: ' . $e->getMessage(), 500);
    }
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST — insert a new comment
// Body: { title, username, text, rating }
// ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body     = json_decode(file_get_contents('php://input'), true);
    if (!$body) jsonError('Invalid JSON body');

    $title    = sanitize($body['title']    ?? '', 255);
    $username = sanitize($body['username'] ?? 'Anonymous', 100);
    $text     = sanitize($body['text']     ?? '', 1000);
    $rating   = isset($body['rating']) ? (int)$body['rating'] : null;

    if (!$title)  jsonError('title is required');
    if (!$text)   jsonError('comment text is required');
    if ($rating !== null && ($rating < 1 || $rating > 5)) {
        jsonError('rating must be between 1 and 5');
    }

    // Optional: pull avatar from your users table if username matches
    $avatarUrl = null;
    try {
        $uStmt = $pdo->prepare("SELECT avatar_url FROM users WHERE username = :u LIMIT 1");
        $uStmt->execute([':u' => $username]);
        $user = $uStmt->fetch(PDO::FETCH_ASSOC);
        if ($user) $avatarUrl = $user['avatar_url'];
    } catch (PDOException $_) { /* users table query is optional */ }

    try {
        $stmt = $pdo->prepare(
            "INSERT INTO comments (movie_title, username, avatar_url, `text`, rating)
             VALUES (:title, :username, :avatar, :text, :rating)"
        );
        $stmt->execute([
            ':title'    => $title,
            ':username' => $username,
            ':avatar'   => $avatarUrl,
            ':text'     => $text,
            ':rating'   => $rating,
        ]);

        echo json_encode(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
    } catch (PDOException $e) {
        jsonError('DB error: ' . $e->getMessage(), 500);
    }
    exit;
}

jsonError('Method not allowed', 405);