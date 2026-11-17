<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/bootstrap.php';

/** @return array<int, array<string, mixed>> */
function fetch_by_category(?string $category): array
{
    $pdo = db();

    if ($category === null) {
        $stmt = $pdo->query('SELECT * FROM movies_series ORDER BY title ASC');
        return $stmt->fetchAll();
    }

    $stmt = $pdo->prepare(
        'SELECT * FROM movies_series
         WHERE LOWER(category) = LOWER(:category)
         ORDER BY title ASC'
    );
    $stmt->execute(['category' => $category]);
    return $stmt->fetchAll();
}

function fetch_movies(): array
{
    $rows = fetch_by_category('movie');
    if ($rows !== []) {
        return $rows;
    }
    // If category values differ (e.g. "Movie"), return non-series rows
    $all = fetch_by_category(null);
    return array_values(array_filter($all, static function (array $row): bool {
        $cat = strtolower((string) ($row['category'] ?? ''));
        return !in_array($cat, ['series', 'tv', 'tv show', 'show'], true);
    }));
}

function fetch_series(): array
{
    $pdo = db();
    $stmt = $pdo->prepare(
        "SELECT * FROM movies_series
         WHERE LOWER(category) IN ('series', 'tv', 'tv show', 'show')
         ORDER BY title ASC"
    );
    $stmt->execute();
    $rows = $stmt->fetchAll();
    if ($rows !== []) {
        return $rows;
    }
    $all = fetch_by_category(null);
    return array_values(array_filter($all, static function (array $row): bool {
        $cat = strtolower((string) ($row['category'] ?? ''));
        return in_array($cat, ['series', 'tv', 'tv show', 'show'], true);
    }));
}

function fetch_related_by_title(string $title, int $limit = 8): array
{
    $pdo = db();
    $stmt = $pdo->prepare('SELECT * FROM movies_series WHERE title = :title LIMIT 1');
    $stmt->execute(['title' => $title]);
    $current = $stmt->fetch();

    if (!$current) {
        return [];
    }

    $limit = max(1, min($limit, 20));
    $rel = $pdo->prepare(
        'SELECT * FROM movies_series
         WHERE LOWER(category) = LOWER(:category)
           AND id <> :id
         ORDER BY is_featured DESC, rating_score DESC NULLS LAST, title ASC
         LIMIT ' . $limit
    );
    $rel->execute([
        'category' => (string) $current['category'],
        'id' => (int) $current['id'],
    ]);

    return $rel->fetchAll();
}
