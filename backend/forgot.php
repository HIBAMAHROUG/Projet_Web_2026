<?php
// ============================================================
// forgot.php — Demande de réinitialisation du mot de passe
//
//  POST  email=  mode=(code|link)
//        → Envoie un code OTP ou un lien de réinitialisation
// ============================================================

ob_start();
require_once __DIR__ . '/config.php';

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
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(false, 'Méthode non autorisée.', 405);
}

// --- Paramètres ---
$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$email   = strtolower(getParam($payload, 'email', getParam($_POST, 'email', ''), '/^[^@\s]+@[^@\s]+\.[^@\s]+$/'));
$mode    = strtolower(getParam($payload, 'mode',  getParam($_POST, 'mode',  'code'), '/^(link|code)$/'));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respondJson(false, 'Adresse email invalide.', 422);
}

if (!in_array($mode, ['link', 'code'], true)) {
    $mode = 'code'; // valeur par défaut sûre
}

$user       = findUserByEmail($email);
$mailSent   = false;
$mailStatus = 'not_attempted';
$debugOtp   = null;
$debugExtra = [];

if ($user) {
    deleteActiveResetsByEmail($email);

    if ($mode === 'code') {
        // --- MODE CODE (OTP 6 chiffres) ---
        $otpCode   = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $otpHash   = password_hash($otpCode, PASSWORD_BCRYPT);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        createPasswordReset($email, $otpHash, $expiresAt);

        $result     = sendResetCodeEmail($email, $otpCode);
        $mailSent   = (bool)($result['sent']   ?? false);
        $mailStatus = $result['status'] ?? 'failed';

        // Exposer le code en local/debug si l'email n'est pas parti
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

// Toujours répondre avec le même message (anti-énumération d'emails)
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