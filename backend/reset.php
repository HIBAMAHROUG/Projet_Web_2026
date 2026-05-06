<?php
// ============================================================
// reset.php — Réinitialisation du mot de passe
//
//  GET  ?action=validate&token=XXX         → Valide un lien token
//  POST action=reset  token=XXX            → Reset via lien
//  POST action=reset  email= code= (6 ch.) → Reset via code OTP
// ============================================================

ob_start();
require __DIR__ . '/config.php';

function respondJson($success, $message, $status = 200, $extra = []) {
    if (ob_get_level()) ob_end_clean();
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    echo json_encode(
        array_merge(['success' => $success, 'message' => $message], $extra),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

// --- OPTIONS preflight ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

$method  = $_SERVER['REQUEST_METHOD'];
$payload = json_decode(file_get_contents('php://input'), true) ?? [];

$action = strtolower(getParam($payload, 'action',
    getParam($_POST, 'action',
        getParam($_GET, 'action', '', '/^[a-zA-Z0-9_]{1,32}$/'),
    '/^[a-zA-Z0-9_]{1,32}$/'),
'/^[a-zA-Z0-9_]{1,32}$/'));

// ============================================================
// GET ?action=validate&token=XXX
// ============================================================
if ($method === 'GET' && $action === 'validate') {
    $token = getParam($_GET, 'token', '', '/^[a-zA-Z0-9]+$/');

    if ($token === '') {
        respondJson(false, 'Token manquant.', 400);
    }

    $reset = getValidResetByToken($token);

    if (!$reset) {
        respondJson(false, 'Lien invalide ou expiré.', 400);
    }

    respondJson(true, 'Lien valide.', 200, ['email' => $reset['email']]);
}

// ============================================================
// POST action=reset — Appliquer le nouveau mot de passe
// ============================================================
if ($method === 'POST' && ($action === 'reset' || $action === '')) {

    $token           = getParam($payload, 'token',           getParam($_POST, 'token',           ''), '/^[a-zA-Z0-9]+$/');
    $email           = strtolower(getParam($payload, 'email', getParam($_POST, 'email',           ''), '/^[^@\s]+@[^@\s]+\.[^@\s]+$/'));
    $code            = getParam($payload, 'code',            getParam($_POST, 'code',            ''), '/^\d{6}$/');
    $password        = getParam($payload, 'password',        getParam($_POST, 'password',        ''));
    $confirmPassword = getParam($payload, 'confirmPassword', getParam($_POST, 'confirmPassword', ''));

    // --- Trouver l'enregistrement de réinitialisation ---
    $reset = null;

    if ($token !== '') {
        $reset = getValidResetByToken($token);
    } elseif ($email !== '' && $code !== '') {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            respondJson(false, 'Adresse email invalide.', 422);
        }
        if (!preg_match('/^\d{6}$/', $code)) {
            respondJson(false, 'Le code doit contenir exactement 6 chiffres.', 422);
        }
        $reset = getValidResetByCode($email, $code);
    }

    if (!$reset) {
        respondJson(false, 'Code ou lien invalide ou expiré.', 400);
    }

    // --- Validation du mot de passe ---
    if (strlen($password) < 8) {
        respondJson(false, 'Le mot de passe doit contenir au moins 8 caractères.', 422);
    }

    if ($password !== $confirmPassword) {
        respondJson(false, 'Les mots de passe ne correspondent pas.', 422);
    }

    // --- Mise à jour ---
    $hashed  = password_hash($password, PASSWORD_BCRYPT);
    $updated = updateUserPasswordByEmail($reset['email'], $hashed);

    if (!$updated) {
        respondJson(false, 'Compte utilisateur introuvable.', 404);
    }

    markResetUsedById($reset['id']);

    respondJson(true, 'Mot de passe mis à jour avec succès.');
}

// --- Fallback ---
respondJson(false, 'Action non reconnue. Utilisez GET ?action=validate ou POST action=reset.', 400);