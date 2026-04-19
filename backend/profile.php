<?php
// profile.php : Affiche les informations du profil utilisateur
session_start();
header('Content-Type: application/json');

// Fonction utilitaire pour récupérer un paramètre GET de façon sécurisée
function getParam($key, $default = null) {
    if (isset($_GET[$key])) {
        return htmlspecialchars(trim($_GET[$key]), ENT_QUOTES, 'UTF-8');
    }
    return $default;
}

// Simuler une base de données utilisateur (à remplacer par une vraie requête SQL)
$users = [
    'ahmed' => [
        'username' => 'ahmed',
        'fullname' => 'Ahmed Ben Salah',
        'email' => 'ahmed@example.com',
        'role' => 'Utilisateur',
        'joined' => '2024-01-15'
    ],
    // Ajouter d'autres utilisateurs ici
];

// Récupérer le nom d'utilisateur depuis la session ou la requête GET (sécurisé)
$username = isset($_SESSION['username']) ? $_SESSION['username'] : getParam('username');

// Validation stricte : uniquement lettres, chiffres, underscore
if ($username && !preg_match('/^[a-zA-Z0-9_]{3,32}$/', $username)) {
    echo json_encode([
        'success' => false,
        'error' => 'Nom d\'utilisateur invalide.'
    ]);
    exit;
}

if ($username && isset($users[$username])) {
    echo json_encode([
        'success' => true,
        'profile' => $users[$username]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Utilisateur non trouvé ou non connecté.'
    ]);
}
