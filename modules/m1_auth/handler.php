<?php
declare(strict_types=1);

// m1_auth - register, login, logout, me
// contract: contracts/auth.md

$rest = $GLOBALS['__route']['rest'] ?? '';
$method = http_method();
$pdo = db()

// REGISTER
// POST /api/auth/register
if ($method == 'POST' && $rest == '/register') {
    $data = json_body();
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $isAdmin = empty($data['is_admin']) ? 0 : 1;

    // check empty fields
    $errors = [];
    if ($username == '') {
        $errors['username'] = 'required';
    }
    if ($password == '') {
        $errors['password'] = 'required';
    }
    if (count($errors) > 0) {
        send_error(422, 'VALIDATION', ['fields' => $errors]);
    }

    // check if username already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        send_error(409, 'USERNAME_TAKEN');
    }

    // save the user with a hashed password
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $id = db_insert_and_get_id($pdo, 'users', [
        'username' => $username,
        'password_hash' => $hash,
        'is_admin' => $isAdmin
    ]);

    send_json(201, ['id' => $id, 'username' => $username, 'is_admin' => $isAdmin]);
}

// LOGIN 
// POST /api/auth/login
if ($method == 'POST' && $rest == '/login') {
    $data = json_body();
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // wrong username or wrong password
    if (!$user || !password_verify($password, $user['password_hash'])) {
        send_error(401, 'INVALID_CREDENTIALS');
    }

    // new session id after login (stops session fixation)
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['username'] = $user['username'];

    send_json(200, [
        'id' => (int) $user['id'],
        'username' => $user['username'],
        'is_admin' => (int) $user['is_admin'],
        'token' => session_id()
    ]);
}



// any other URL
send_error(404, 'NOT_FOUND');