<?php
// ============================================================
// login.php — Connexion utilisateur
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

// --- Méthode ---
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'GET'], true)) {
    respondJson(false, 'Méthode non autorisée.', 405);
}

// --- Lecture des paramètres (JSON body, POST ou GET) ---
$payload  = json_decode(file_get_contents('php://input'), true) ?? [];
$email    = strtolower(trim($payload['email']    ?? ($_POST['email']    ?? ($_GET['email']    ?? ''))));
$password =            trim($payload['password'] ?? ($_POST['password'] ?? ($_GET['password'] ?? '')));

// --- Validation ---
if ($email === '' || $password === '') {
    appendStartSubmission($email, false, 'Email et mot de passe obligatoires.');
    respondJson(false, 'Email et mot de passe obligatoires.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    appendStartSubmission($email, false, 'Adresse email invalide.');
    respondJson(false, 'Adresse email invalide.', 422);
}

// --- Vérification des identifiants ---
$user = verifyUserCredentials($email, $password);

if (!$user) {
    appendStartSubmission($email, false, 'Identifiants invalides.');
    respondJson(false, 'Email ou mot de passe incorrect.', 401);
}

// --- Succès ---
updateUserLastLoginByEmail($email);
appendStartSubmission($email, true, 'Connexion réussie.');

respondJson(true, 'Connexion réussie.', 200, [
    'user' => [
        'id'       => $user['id'],
        'fullName' => $user['full_name'] ?? '',
        'email'    => $user['email'],
    ],
]);