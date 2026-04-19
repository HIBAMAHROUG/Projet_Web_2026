<?php
// contact.php — Traitement du formulaire de contact
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

function respondJson($success, $message, $status = 200) {
    http_response_code($status);
    echo json_encode([
        'success' => $success,
        'message' => $message
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

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

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$name = getParam($payload, 'name', '', '/^[\p{L} .\'-]{2,60}$/u');
$email = strtolower(getParam($payload, 'email', '', '/^[^@\s]+@[^@\s]+\.[^@\s]+$/'));
$message = getParam($payload, 'message', '', '/^.{5,1000}$/us');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(false, 'Méthode non autorisée.', 405);
}

if ($name === '' || $email === '' || $message === '') {
    respondJson(false, 'Tous les champs sont obligatoires.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respondJson(false, 'Adresse email invalide.', 422);
}

// Exemple : enregistrer le message dans un fichier (à adapter selon besoin)
file_put_contents(
    __DIR__ . '/contact-messages.log',
    json_encode([
        'name' => $name,
        'email' => $email,
        'message' => $message,
        'date' => date('Y-m-d H:i:s'),
    ], JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND
);

respondJson(true, 'Votre message a bien été envoyé !');
