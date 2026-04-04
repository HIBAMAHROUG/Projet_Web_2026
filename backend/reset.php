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

function getResetRecordByToken($token) {
    return getValidResetByToken($token);
}

function getResetRecordByCode($email, $code) {
    return getValidResetByCode($email, $code);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && (($_GET['validate'] ?? '') === '1')) {
    $token = $_GET['token'] ?? '';
    $reset = getResetRecordByToken($token);

    if (!$reset) {
        respondJson(false, 'Lien invalide ou expire.', 400);
    }

    respondJson(true, 'Lien valide.', 200, ['email' => $reset['email']]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);

    $token = trim($payload['token'] ?? ($_POST['token'] ?? ''));
    $email = trim($payload['email'] ?? ($_POST['email'] ?? ''));
    $code = trim($payload['code'] ?? ($_POST['code'] ?? ''));
    $password = $payload['password'] ?? ($_POST['password'] ?? '');
    $password2 = $payload['confirmPassword'] ?? ($payload['password2'] ?? ($_POST['password2'] ?? ''));

    $reset = false;
    if ($token !== '') {
        $reset = getResetRecordByToken($token);
    } elseif ($email !== '' || $code !== '') {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            respondJson(false, 'Adresse email invalide.', 422);
        }

        if (!preg_match('/^\d{6}$/', $code)) {
            respondJson(false, 'Code invalide. Il doit contenir 6 chiffres.', 422);
        }

        $reset = getResetRecordByCode($email, $code);
    }

    if (!$reset) {
        respondJson(false, 'Code ou lien invalide ou expire.', 400);
    }

    if (strlen($password) < 8) {
        respondJson(false, 'Le mot de passe doit contenir au moins 8 caracteres.', 422);
    }

    if ($password !== $password2) {
        respondJson(false, 'Les mots de passe ne correspondent pas.', 422);
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);

    $updated = updateUserPasswordByEmail($reset['email'], $hashed);
    if (!$updated) {
        respondJson(false, 'Compte utilisateur introuvable.', 404);
    }

    markResetUsedById($reset['id']);

    respondJson(true, 'Mot de passe mis a jour avec succes.');
}

respondJson(false, 'Methode non autorisee.', 405);