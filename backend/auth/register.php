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
$username = trim((string) ($body['username'] ?? $body['fullname'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('Valid email is required', 422);
}
if (strlen($password) < 6) {
    json_error('Password must be at least 6 characters', 422);
}
if ($username === '' || strlen($username) < 3) {
    json_error('Username must be at least 3 characters', 422);
}
if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    json_error('Username may only contain letters, numbers, and underscores', 422);
}

try {
    $pdo = db();

    $checkEmail = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $checkEmail->execute(['email' => $email]);
    if ($checkEmail->fetch()) {
        json_error('Email already registered', 409);
    }

    $checkUser = $pdo->prepare('SELECT id FROM users WHERE username = :username LIMIT 1');
    $checkUser->execute(['username' => $username]);
    if ($checkUser->fetch()) {
        json_error('Username already taken', 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $insert = $pdo->prepare(
        'INSERT INTO users (email, username, password_hash)
         VALUES (:email, :username, :password_hash)
         RETURNING id, email, username, created_at'
    );
    $insert->execute([
        'email' => $email,
        'username' => $username,
        'password_hash' => $hash,
    ]);

    $user = $insert->fetch();
    json_ok(['ok' => true, 'user' => $user], 201);
} catch (Throwable $e) {
    json_error('Registration failed: ' . $e->getMessage(), 500);
}
