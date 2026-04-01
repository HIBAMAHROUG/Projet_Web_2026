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

function getResetRecord($pdo, $token) {
    if (!$token) {
        return false;
    }

    $stmt = $pdo->prepare(
        "SELECT * FROM password_resets
         WHERE token = ? AND used = 0 AND expires_at > NOW()"
    );
    $stmt->execute([$token]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET' && (($_GET['validate'] ?? '') === '1')) {
    $token = $_GET['token'] ?? '';
    $reset = getResetRecord($pdo, $token);

    if (!$reset) {
        respondJson(false, 'Lien invalide ou expire.', 400);
    }

    respondJson(true, 'Lien valide.', 200, ['email' => $reset['email']]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);

    $token = trim($payload['token'] ?? ($_POST['token'] ?? ''));
    $password = $payload['password'] ?? ($_POST['password'] ?? '');
    $password2 = $payload['confirmPassword'] ?? ($payload['password2'] ?? ($_POST['password2'] ?? ''));

    $reset = getResetRecord($pdo, $token);
    if (!$reset) {
        respondJson(false, 'Lien invalide ou expire.', 400);
    }

    if (strlen($password) < 8) {
        respondJson(false, 'Le mot de passe doit contenir au moins 8 caracteres.', 422);
    }

    if ($password !== $password2) {
        respondJson(false, 'Les mots de passe ne correspondent pas.', 422);
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);

    $pdo->prepare("UPDATE users SET password = ? WHERE email = ?")
        ->execute([$hashed, $reset['email']]);

    $pdo->prepare("UPDATE password_resets SET used = 1 WHERE token = ?")
        ->execute([$token]);

    respondJson(true, 'Mot de passe mis a jour avec succes.');
}

respondJson(false, 'Methode non autorisee.', 405);