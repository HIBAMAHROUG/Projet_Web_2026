<?php
// reset_password.php — formulaire de nouveau mot de passe (via le lien reçu par email)
require 'config.php';

$token   = $_GET['token'] ?? '';
$message = '';
$error   = '';
$valid   = false;

if (empty($token)) {
    $error = "Lien invalide.";
} else {
    $pdo  = getDB();
    $stmt = $pdo->prepare(
        "SELECT * FROM password_resets
         WHERE token = ? AND used = 0 AND expires_at > NOW()"
    );
    $stmt->execute([$token]);
    $reset = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reset) {
        $error = "Ce lien est invalide ou a expiré. Veuillez faire une nouvelle demande.";
    } else {
        $valid = true;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $valid) {
    $password  = $_POST['password']  ?? '';
    $password2 = $_POST['password2'] ?? '';

    if (strlen($password) < 8) {
        $error = "Le mot de passe doit contenir au moins 8 caractères.";
    } elseif ($password !== $password2) {
        $error = "Les mots de passe ne correspondent pas.";
    } else {
        $hashed = password_hash($password, PASSWORD_BCRYPT);

        // Met à jour le mot de passe
        $pdo->prepare("UPDATE users SET password = ? WHERE email = ?")
            ->execute([$hashed, $reset['email']]);

        // Marque le token comme utilisé
        $pdo->prepare("UPDATE password_resets SET used = 1 WHERE token = ?")
            ->execute([$token]);

        $message = "Mot de passe mis à jour avec succès ! <a href='login.php'>Se connecter</a>";
        $valid   = false;
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouveau mot de passe</title>
<link rel="stylesheet" href="style.css"></head>
<body>
<div class="auth-container">
    <h2>Nouveau mot de passe</h2>

    <?php if ($error): ?>
        <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <?php if ($message): ?>
        <div class="alert alert-success"><?= $message ?></div>
    <?php endif; ?>

    <?php if ($valid): ?>
    <form method="POST" action="reset_password.php?token=<?= htmlspecialchars($token) ?>">
        <div class="form-group">
            <label for="password">Nouveau mot de passe</label>
            <input type="password" id="password" name="password"
                   placeholder="8 caractères minimum" required>
        </div>
        <div class="form-group">
            <label for="password2">Confirmer le mot de passe</label>
            <input type="password" id="password2" name="password2"
                   placeholder="Répétez le mot de passe" required>
        </div>
        <button type="submit" class="btn-primary">Enregistrer le mot de passe</button>
    </form>
    <?php endif; ?>
</div>
</body>
</html>