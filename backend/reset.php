// Vérification CSRF pour les requêtes POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = getParam($payload, 'csrf_token', getParam($_POST, 'csrf_token', ''));
    if (!$csrfToken || !verifyCsrfToken($csrfToken)) {
        respondJson(false, 'CSRF token invalide ou manquant.', 403);
    }
}
<?php
// ============================================================
// reset.php — Réinitialisation du mot de passe
//
//  GET  ?action=validate&token=XXX       → Valide un lien token
//  POST action=forgot   email=  mode=    → Envoie code ou lien
//  POST action=reset    token/code/email → Change le mot de passe
// ============================================================

ob_start();
require __DIR__ . '/config.php';

function respondJson($success, $message, $status = 200, $extra = []) {
    ob_end_clean();
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    echo json_encode(
        array_merge(['success' => $success, 'message' => $message], $extra),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

// Fonctions utilitaires pour sécuriser les entrées utilisateur
function getParam($array, $key, $default = null, $pattern = null) {
    if (isset($array[$key])) {
        $value = trim($array[$key]);
        if ($pattern && !preg_match($pattern, $value)) {
            return $default;
        }
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
    return $default;
}

$method  = $_SERVER['REQUEST_METHOD'];
$payload = json_decode(file_get_contents('php://input'), true) ?? [];

// Lecture action depuis GET ou body (filtrée)
$action = strtolower(getParam($payload, 'action',
    getParam($_POST, 'action',
        getParam($_GET, 'action', '', '/^[a-zA-Z0-9_]{3,32}$/')
    , '/^[a-zA-Z0-9_]{3,32}$/')
, '/^[a-zA-Z0-9_]{3,32}$/'));

// ============================================================
// GET ?action=validate&token=XXX
// Vérifie qu'un token de lien est encore valide
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
// POST action=forgot — Envoyer code ou lien de réinitialisation
// ============================================================
if ($method === 'POST' && $action === 'forgot') {

    $email = strtolower(getParam($payload, 'email', getParam($_POST, 'email', ''), '/^[^@\s]+@[^@\s]+\.[^@\s]+$/'));
    $mode  = strtolower(getParam($payload, 'mode', getParam($_POST, 'mode', 'code'), '/^(link|code)$/'));

    if ($mode === null) {
        respondJson(false, 'Mode invalide. Utilisez "link" ou "code".', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respondJson(false, 'Adresse email invalide.', 422);
    }

    $user       = findUserByEmail($email);
    $mailSent   = false;
    $mailStatus = 'not_attempted';
    $debugOtp   = null;
    $debugExtra = [];

    if ($user) {
        deleteActiveResetsByEmail($email);

        if ($mode === 'code') {
            // --- MODE CODE ---
            $otpCode   = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $otpHash   = password_hash($otpCode, PASSWORD_BCRYPT);
            $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

            createPasswordReset($email, $otpHash, $expiresAt);

            $result     = sendResetCodeEmail($email, $otpCode);
            $mailSent   = (bool)($result['sent']   ?? false);
            $mailStatus = $result['status'] ?? 'failed';

            // Afficher le code en debug si l'email n'est pas parti
            if (!$mailSent && (DEBUG_OTP || isLocalRequest())) {
                $debugOtp = $otpCode;
            }

        } else {
            // --- MODE LIEN ---
            $token     = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            createPasswordReset($email, $token, $expiresAt);

            $scheme     = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $host       = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $scriptDir  = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/backend'));
            $projectDir = rtrim(dirname($scriptDir), '/');
            $resetLink  = $scheme . '://' . $host . ($projectDir ?: '') . '/reset-password.html?token=' . urlencode($token);

            $result     = sendResetEmail($email, $resetLink);
            $mailSent   = (bool)($result['sent']   ?? false);
            $mailStatus = $result['status'] ?? 'failed';
        }
    }

    // Toujours répondre avec le même message (sécurité anti-énumération)
    if (DEBUG_OTP || isLocalRequest()) {
        $debugExtra['debugAccountExists'] = (bool)$user;
        $debugExtra['mailStatus']         = $mailStatus;
        $debugExtra['mailSent']           = $mailSent;
        if ($debugOtp !== null) {
            $debugExtra['debugCode'] = $debugOtp;
        }
    }

    $msg = $mode === 'code'
        ? 'Si cet email est enregistré, un code de vérification a été envoyé.'
        : 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.';

    respondJson(true, $msg, 200, $debugExtra);
}

// ============================================================
// POST action=reset — Appliquer le nouveau mot de passe
// ============================================================
if ($method === 'POST' && ($action === 'reset' || $action === '')) {

    $token           = getParam($payload, 'token', getParam($_POST, 'token', ''), '/^[a-zA-Z0-9]+$/');
    $email           = strtolower(getParam($payload, 'email', getParam($_POST, 'email', ''), '/^[^@\s]+@[^@\s]+\.[^@\s]+$/'));
    $code            = getParam($payload, 'code', getParam($_POST, 'code', ''), '/^\d{6}$/');
    $password        = getParam($payload, 'password', getParam($_POST, 'password', ''));
    $confirmPassword = getParam($payload, 'confirmPassword', getParam($payload, 'password2', getParam($_POST, 'confirmPassword', getParam($_POST, 'password2', ''))));

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
respondJson(false, 'Action non reconnue. Utilisez action=forgot ou action=reset.', 400);