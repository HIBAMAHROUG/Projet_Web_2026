<?php
// config.php — à inclure dans tous les fichiers
define('DB_HOST', 'localhost');
define('DB_NAME', 'ton_projet');
define('DB_USER', 'root');
define('DB_PASS', '');
define('BASE_URL', 'http://localhost/ton_projet');
define('MAIL_FROM', 'noreply@tonsite.com');
define('MAIL_FROM_NAME', 'Ton Site');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8",
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }
    return $pdo;
}