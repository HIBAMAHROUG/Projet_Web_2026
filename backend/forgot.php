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

function sendResetEmail($email, $resetLink) {
    $subject = "Reinitialisation de votre mot de passe";
    $body = "
      <div style='font-family:Arial,sans-serif;line-height:1.6'>
        <h2>Reinitialisation du mot de passe</h2>
        <p>Pour definir un nouveau mot de passe, cliquez sur ce lien :</p>
        <p><a href='{$resetLink}'>{$resetLink}</a></p>
        <p>Ce lien expire dans 1 heure.</p>
      </div>
    ";

    $headers  = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
    $headers .= "Reply-To: " . MAIL_FROM . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    @mail($email, $subject, $body, $headers);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(false, 'Methode non autorisee.', 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
$email = trim($payload['email'] ?? ($_POST['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respondJson(false, 'Adresse email invalide.', 422);
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $pdo->prepare("DELETE FROM password_resets WHERE email = ? AND used = 0")
        ->execute([$email]);

    $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)")
        ->execute([$email, $token, $expiresAt]);

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/backend'));
    $projectPath = rtrim(dirname($scriptPath), '/');
    $resetLink = $scheme . '://' . $host . ($projectPath ?: '') . '/reset-password.html?token=' . urlencode($token);

    sendResetEmail($email, $resetLink);
}

respondJson(true, 'Si cet email est enregistre, un lien de reinitialisation a ete envoye.');