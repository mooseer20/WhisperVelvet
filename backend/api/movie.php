<?php
declare(strict_types=1);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/_helpers.php';

$title = trim((string)($_GET['title'] ?? ''));

if ($title === '') {
    http_response_code(400);
    echo json_encode(['error' => 'No title provided']);
    exit;
}

try {
    $pdo = db();

    // Main row
    $stmt = $pdo->prepare('
        SELECT * FROM movies_series
        WHERE LOWER(title) = LOWER(:title)
        LIMIT 1
    ');
    $stmt->execute(['title' => $title]);
    $item = $stmt->fetch();

    if (!$item) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }

    // Genres via join
    $g = $pdo->prepare('
        SELECT g.name FROM genres g
        JOIN movie_series_genres msg ON g.id = msg.genre_id
        WHERE msg.movie_series_id = :id
    ');
    $g->execute(['id' => $item['id']]);
    $item['genres'] = array_column($g->fetchAll(), 'name');

    // Cast via join
    $c = $pdo->prepare('
        SELECT cc.name, cc.role_type, cc.profile_picture_url, mcc.character_name
        FROM cast_crew cc
        JOIN movie_series_cast_crew mcc ON cc.id = mcc.person_id
        WHERE mcc.movie_series_id = :id
        ORDER BY cc.role_type, cc.name
    ');
    $c->execute(['id' => $item['id']]);
    $item['cast'] = $c->fetchAll();

    // Books linked to this movie/series
$books = $pdo->prepare('
SELECT b.title, b.author, b.synopsis, b.published_year, b.buy_link
FROM books b
JOIN movie_series_books msb ON b.id = msb.book_id
WHERE msb.movie_series_id = :id
ORDER BY b.published_year ASC
');
$books->execute(['id' => $item['id']]);
$item['books'] = $books->fetchAll();
    // Related (same category)
    $r = $pdo->prepare('
        SELECT title, poster_url, rating_score
        FROM movies_series
        WHERE LOWER(category) = LOWER(:cat)
          AND id <> :id
        ORDER BY is_featured DESC, rating_score DESC NULLS LAST
        LIMIT 8
    ');
    $r->execute(['cat' => $item['category'], 'id' => $item['id']]);
    $item['related'] = $r->fetchAll();

    // Average rating + comment count
$stats = $pdo->prepare('
SELECT 
    ROUND(AVG(rating)::numeric, 1) AS avg_rating,
    COUNT(*) AS total_comments
FROM comments
WHERE movie_series_id = :id AND rating IS NOT NULL
');
$stats->execute(['id' => $item['id']]);
$ratingStats = $stats->fetch();
$item['community_rating']  = $ratingStats['avg_rating'];
$item['community_comments'] = (int)$ratingStats['total_comments'];

    echo json_encode($item, JSON_PRETTY_PRINT);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}