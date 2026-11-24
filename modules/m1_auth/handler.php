<?php
declare(strict_types=1);

// m1_auth - register, login, logout, me
// contract: contracts/auth.md

$rest = $GLOBALS['__route']['rest'] ?? '';
$method = http_method();
$pdo = db()

// any other URL
send_error(404, 'NOT_FOUND');