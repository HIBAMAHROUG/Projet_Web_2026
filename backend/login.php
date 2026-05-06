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
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit;
    }
    
    echo json_encode(
        array_merge(['success' => $success, 'message' => $message], $extra),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

// Gérer les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    respondJson(true, 'OK');
}

// --- Méthode ---
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'GET'], true)) {
    respondJson(false, 'Méthode non autorisée.', 405);
}

// --- Lecture des paramètres (JSON body, POST ou GET) ---
$payload = [];

// Lire le body JSON si présent
$inputJSON = file_get_contents('php://input');
if (!empty($inputJSON)) {
    $payload = json_decode($inputJSON, true) ?? [];
}

// Récupérer l'email et le mot de passe
$email = '';
$password = '';

// Priorité: POST > GET > JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
}

if (empty($email) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = isset($_GET['email']) ? trim($_GET['email']) : '';
    $password = isset($_GET['password']) ? $_GET['password'] : '';
}

if (empty($email) && !empty($payload)) {
    $email = isset($payload['email']) ? trim($payload['email']) : '';
    $password = isset($payload['password']) ? $payload['password'] : '';
}

$email = strtolower($email);

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

// --- Succès - Enregistrer la connexion ---
// Démarrer la session pour garder l'utilisateur connecté
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_fullname'] = $user['full_name'] ?? '';
$_SESSION['logged_in'] = true;

// Mettre à jour la dernière connexion
updateUserLastLoginByEmail($email);

// Enregistrer la tentative de connexion réussie
appendStartSubmission($email, true, 'Connexion réussie.');

// Optionnel: Enregistrer dans un log de connexions
logUserConnection($user['id'], $email);

respondJson(true, 'Connexion réussie.', 200, [
    'user' => [
        'id'       => $user['id'],
        'fullName' => $user['full_name'] ?? '',
        'email'    => $user['email'],
    ],
    'session' => [
        'logged_in' => true
    ]
]);

/**
 * Enregistrer la connexion de l'utilisateur dans un log séparé
 */
function logUserConnection($userId, $email) {
    $logFile = __DIR__ . '/logs/connections.log';
    $logDir = dirname($logFile);
    
    // Créer le dossier logs s'il n'existe pas
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $logEntry = sprintf(
        "[%s] User ID: %d | Email: %s | IP: %s | UA: %s\n",
        $timestamp,
        $userId,
        $email,
        $ip,
        $userAgent
    );
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Fonction utilitaire pour sécuriser les entrées utilisateur
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
?>