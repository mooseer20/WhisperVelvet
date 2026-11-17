<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = json_decode(file_get_contents('php://input') ?: '[]', true);
if (!is_array($body)) {
    $body = $_POST;
}

$email = strtolower(trim((string) ($body['email'] ?? '')));
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
    json_error('Email and password are required', 422);
}

try {
    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT id, email, username, password_hash FROM users WHERE email = :email LIMIT 1'
    );
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_error('Invalid email or password', 401);
    }

    $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = :id')
        ->execute(['id' => $user['id']]);

    unset($user['password_hash']);
    json_ok(['ok' => true, 'user' => $user]);
} catch (PDOException $e) {
    json_error('Login failed: ' . $e->getMessage(), 500);
} catch (Throwable $e) {
    json_error('Login failed: ' . $e->getMessage(), 500);
}
