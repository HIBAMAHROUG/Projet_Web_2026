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
$email = strtolower(trim($payload['email'] ?? ($_POST['email'] ?? '')));
$password = $payload['password'] ?? ($_POST['password'] ?? '');

if ($email === '' || $password === '') {
    appendStartSubmission($email, false, 'Email et mot de passe obligatoires.');
    respondJson(false, 'Email et mot de passe obligatoires.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    appendStartSubmission($email, false, 'Adresse email invalide.');
    respondJson(false, 'Adresse email invalide.', 422);
}

$user = verifyUserCredentials($email, $password);
if (!$user) {
    appendStartSubmission($email, false, 'Identifiants invalides.');
    respondJson(false, 'Identifiants invalides.', 401);
}

updateUserLastLoginByEmail($email);
appendStartSubmission($email, true, 'Connexion reussie.');

respondJson(true, 'Connexion reussie.', 200, [
    'user' => [
        'id' => $user['id'],
        'fullName' => $user['full_name'] ?? '',
        'email' => $user['email'],
    ],
]);
