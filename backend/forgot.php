<?php
// forgot_password.php — reçoit le formulaire "j'ai oublié mon mot de passe"
require 'config.php';

$message = '';
$error   = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Adresse email invalide.";
    } else {
        $pdo = getDB();

        // Vérifie si l'email existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            // Génère un token sécurisé
            $token     = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Supprime les anciens tokens non utilisés pour cet email
            $pdo->prepare("DELETE FROM password_resets WHERE email = ? AND used = 0")
                ->execute([$email]);

            // Insère le nouveau token
            $pdo->prepare(
                "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)"
            )->execute([$email, $token, $expiresAt]);

            // Envoie l'email
            $resetLink = BASE_URL . "/reset_password.php?token=" . $token;
            sendResetEmail($email, $resetLink);
        }

        // Message générique — ne pas révéler si l'email existe ou non
        $message = "Si cet email est enregistré, un lien de réinitialisation vous a été envoyé.";
    }
}

function sendResetEmail($email, $resetLink) {
    $subject = "Réinitialisation de votre mot de passe";

    // Charge le template HTML
    $body = file_get_contents('email_template.html');
    $body = str_replace('{{RESET_LINK}}', $resetLink, $body);
    $body = str_replace('{{YEAR}}', date('Y'), $body);

    $headers  = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
    $headers .= "Reply-To: " . MAIL_FROM . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    mail($email, $subject, $body, $headers);
    // En production, remplace mail() par PHPMailer ou Mailgun pour plus de fiabilité
}
?>
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Mot de passe oublié</title>
<link rel="stylesheet" href="style.css"></head>
<body>
<?php include 'forgot_form.html'; ?>
</body>
</html>