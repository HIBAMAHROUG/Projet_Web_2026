<?php
require 'confi.php';

function respondJson($success, $message, $status = 200, $extra = []) {
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message,
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(false, 'Methode non autorisee.', 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
$fullName = trim($payload['fullName'] ?? ($_POST['fullName'] ?? ''));
$email = strtolower(trim($payload['email'] ?? ($_POST['email'] ?? '')));
$password = $payload['password'] ?? ($_POST['password'] ?? '');
$confirmPassword = $payload['confirmPassword'] ?? ($_POST['confirmPassword'] ?? '');

if ($fullName === '' || $email === '' || $password === '' || $confirmPassword === '') {
    respondJson(false, 'Tous les champs sont obligatoires.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respondJson(false, 'Adresse email invalide.', 422);
}

if (strlen($password) < 8) {
    respondJson(false, 'Le mot de passe doit contenir au moins 8 caracteres.', 422);
}

if ($password !== $confirmPassword) {
    respondJson(false, 'Les mots de passe ne correspondent pas.', 422);
}

$existing = findUserByEmail($email);
if ($existing) {
    respondJson(false, 'Cet email est deja utilise.', 409);
}

$hashed = password_hash($password, PASSWORD_BCRYPT);
$user = createUser($fullName, $email, $hashed);
if (!$user) {
    respondJson(false, 'Cet email est deja utilise.', 409);
}

respondJson(true, 'Compte cree avec succes.', 201, [
    'user' => [
        'id' => $user['id'],
        'fullName' => $user['full_name'],
        'email' => $user['email'],
    ],
]);
