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

function failWithLog($fullName, $email, $message, $status) {
    appendSignupSubmission($fullName, $email, false, $message);
    respondJson(false, $message, $status);
}

if ($fullName === '' || $email === '' || $password === '' || $confirmPassword === '') {
    failWithLog($fullName, $email, 'Tous les champs sont obligatoires.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    failWithLog($fullName, $email, 'Adresse email invalide.', 422);
}

if (strlen($password) < 8) {
    failWithLog($fullName, $email, 'Le mot de passe doit contenir au moins 8 caracteres.', 422);
}

if ($password !== $confirmPassword) {
    failWithLog($fullName, $email, 'Les mots de passe ne correspondent pas.', 422);
}

$existing = findUserByEmail($email);
if ($existing) {
    failWithLog($fullName, $email, 'Cet email est deja utilise.', 409);
}

$hashed = password_hash($password, PASSWORD_BCRYPT);
$user = createUser($fullName, $email, $hashed);
if (!$user) {
    failWithLog($fullName, $email, 'Cet email est deja utilise.', 409);
}

appendSignupSubmission($fullName, $email, true, 'Compte cree avec succes.');

respondJson(true, 'Compte cree avec succes.', 201, [
    'user' => [
        'id' => $user['id'],
        'fullName' => $user['full_name'],
        'email' => $user['email'],
    ],
]);
