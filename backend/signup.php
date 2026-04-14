<?php
// ============================================================
// signup.php — Création de compte
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

function failWithLog($fullName, $email, $message, $status) {
    appendSignupSubmission($fullName, $email, false, $message);
    respondJson(false, $message, $status);
}

// --- Méthode ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(false, 'Méthode non autorisée.', 405);
}

// --- Lecture des paramètres ---
$payload         = json_decode(file_get_contents('php://input'), true) ?? [];
$fullName        = trim($payload['fullName']        ?? ($_POST['fullName']        ?? ''));
$email           = strtolower(trim($payload['email'] ?? ($_POST['email']          ?? '')));
$password        =            $payload['password']   ?? ($_POST['password']       ?? '');
$confirmPassword =            $payload['confirmPassword'] ?? ($_POST['confirmPassword'] ?? '');

// --- Validations ---
if ($fullName === '' || $email === '' || $password === '' || $confirmPassword === '') {
    failWithLog($fullName, $email, 'Tous les champs sont obligatoires.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    failWithLog($fullName, $email, 'Adresse email invalide.', 422);
}

if (strlen($password) < 8) {
    failWithLog($fullName, $email, 'Le mot de passe doit contenir au moins 8 caractères.', 422);
}

if ($password !== $confirmPassword) {
    failWithLog($fullName, $email, 'Les mots de passe ne correspondent pas.', 422);
}

// --- Vérification unicité ---
if (findUserByEmail($email)) {
    failWithLog($fullName, $email, 'Cet email est déjà utilisé.', 409);
}

// --- Création du compte ---
$hashed = password_hash($password, PASSWORD_BCRYPT);
$user   = createUser($fullName, $email, $hashed);

if (!$user) {
    failWithLog($fullName, $email, 'Cet email est déjà utilisé.', 409);
}

appendSignupSubmission($fullName, $email, true, 'Compte créé avec succès.');

respondJson(true, 'Compte créé avec succès.', 201, [
    'user' => [
        'id'       => $user['id'],
        'fullName' => $user['full_name'],
        'email'    => $user['email'],
    ],
]);