<?php
// ============================================================
// config.php — Configuration centrale + accès aux données
// ============================================================

// Affichage des erreurs (désactiver en production)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('error_log', __DIR__ . '/error.log');

// --- Chargement du fichier .env ---
function loadEnvFile($filePath) {
    if (!file_exists($filePath)) return;

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) continue;

        $key   = trim($parts[0]);
        $value = trim($parts[1]);

        if ($value !== '' && ($value[0] === '"' || $value[0] === "'")) {
            $value = trim($value, "\"'");
        }

        if (getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

loadEnvFile(__DIR__ . '/.env');

// --- Constantes ---
define('BASE_URL',        getenv('BASE_URL')        ?: 'http://localhost/projet_web_2026');
define('MAIL_FROM',       getenv('MAIL_FROM')        ?: 'noreply@tonsite.com');
define('MAIL_FROM_NAME',  getenv('MAIL_FROM_NAME')   ?: 'FaithPath');
define('SMTP_HOST',       getenv('SMTP_HOST')        ?: '');
define('SMTP_PORT', (int)(getenv('SMTP_PORT')        ?: 465));
define('SMTP_USER',       getenv('SMTP_USER')        ?: '');
define('SMTP_PASS',       getenv('SMTP_PASS')        ?: '');
define('SMTP_SECURE',     strtolower(getenv('SMTP_SECURE') ?: 'ssl'));
define('NOSQL_FILE',      __DIR__ . '/nosql-data.json');
define('DEBUG_OTP',       getenv('DEBUG_RETURN_OTP') === '1');

// ============================================================
// STORE — Lecture/écriture JSON avec verrou de fichier
// ============================================================

function getInitialStore() {
    return [
        'users'              => [],
        'password_resets'    => [],
        'signup_submissions' => [],
        'start_submissions'  => [],
        'next_user_id'       => 1,
        'next_reset_id'      => 1,
        'next_submission_id' => 1,
    ];
}

function ensureStoreSchema(&$store) {
    foreach (getInitialStore() as $key => $default) {
        if (!array_key_exists($key, $store)) {
            $store[$key] = $default;
        }
    }
}

function ensureNosqlStoreExists() {
    if (!file_exists(NOSQL_FILE)) {
        file_put_contents(
            NOSQL_FILE,
            json_encode(getInitialStore(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
}

function withStore(callable $callback) {
    ensureNosqlStoreExists();

    $fp = fopen(NOSQL_FILE, 'c+');
    if (!$fp) throw new RuntimeException('Impossible d\'ouvrir le fichier NoSQL.');

    try {
        if (!flock($fp, LOCK_EX)) throw new RuntimeException('Impossible de verrouiller le fichier NoSQL.');

        $raw   = stream_get_contents($fp);
        $store = json_decode($raw ?: '{}', true);

        if (!is_array($store) || !isset($store['users'])) {
            $store = getInitialStore();
        } else {
            ensureStoreSchema($store);
        }

        $result = $callback($store);

        rewind($fp);
        ftruncate($fp, 0);
        fwrite($fp, json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);

        return $result;
    } catch (Throwable $e) {
        flock($fp, LOCK_UN);
        fclose($fp);
        throw $e;
    }
}

// ============================================================
// USERS
// ============================================================

function findUserByEmail($email) {
    return withStore(function ($store) use ($email) {
        foreach ($store['users'] as $user) {
            if (($user['email'] ?? '') === $email) return $user;
        }
        return null;
    });
}

function createUser($fullName, $email, $hashedPassword) {
    return withStore(function (&$store) use ($fullName, $email, $hashedPassword) {
        foreach ($store['users'] as $u) {
            if (($u['email'] ?? '') === $email) return null;
        }

        $id = (int)($store['next_user_id'] ?? 1);
        $store['next_user_id'] = $id + 1;

        $user = [
            'id'         => $id,
            'full_name'  => $fullName,
            'email'      => $email,
            'password'   => $hashedPassword,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $store['users'][] = $user;
        return $user;
    });
}

function verifyUserCredentials($email, $plainPassword) {
    return withStore(function ($store) use ($email, $plainPassword) {
        foreach ($store['users'] as $user) {
            if (($user['email'] ?? '') !== $email) continue;
            $hash = $user['password'] ?? '';
            if ($hash !== '' && password_verify($plainPassword, $hash)) return $user;
            return null;
        }
        return null;
    });
}

function updateUserPasswordByEmail($email, $hashedPassword) {
    return withStore(function (&$store) use ($email, $hashedPassword) {
        foreach ($store['users'] as &$user) {
            if (($user['email'] ?? '') === $email) {
                $user['password'] = $hashedPassword;
                return true;
            }
        }
        return false;
    });
}

function updateUserLastLoginByEmail($email) {
    return withStore(function (&$store) use ($email) {
        foreach ($store['users'] as &$user) {
            if (($user['email'] ?? '') === $email) {
                $user['last_login_at'] = date('Y-m-d H:i:s');
                return true;
            }
        }
        return false;
    });
}

// ============================================================
// PASSWORD RESETS
// ============================================================

function deleteActiveResetsByEmail($email) {
    withStore(function (&$store) use ($email) {
        $store['password_resets'] = array_values(array_filter(
            $store['password_resets'],
            fn($r) => !(($r['email'] ?? '') === $email && (int)($r['used'] ?? 0) === 0)
        ));
        return true;
    });
}

function createPasswordReset($email, $token, $expiresAt) {
    return withStore(function (&$store) use ($email, $token, $expiresAt) {
        $id = (int)($store['next_reset_id'] ?? 1);
        $store['next_reset_id'] = $id + 1;

        $record = [
            'id'         => $id,
            'email'      => $email,
            'token'      => $token,
            'expires_at' => $expiresAt,
            'used'       => 0,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $store['password_resets'][] = $record;
        return $record;
    });
}

function getValidResetByToken($token) {
    return withStore(function ($store) use ($token) {
        if (!$token) return null;
        $now = time();
        foreach ($store['password_resets'] as $row) {
            if (
                ($row['token'] ?? '') === $token &&
                (int)($row['used'] ?? 0) === 0 &&
                strtotime($row['expires_at'] ?? '') > $now
            ) return $row;
        }
        return null;
    });
}

function getValidResetByCode($email, $code) {
    return withStore(function ($store) use ($email, $code) {
        if (!$email || !$code) return null;
        $now = time();
        $candidates = [];

        foreach ($store['password_resets'] as $row) {
            if (
                ($row['email'] ?? '') === $email &&
                (int)($row['used'] ?? 0) === 0 &&
                strtotime($row['expires_at'] ?? '') > $now
            ) {
                $candidates[] = $row;
            }
        }

        usort($candidates, fn($a, $b) => strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''));
        $candidates = array_slice($candidates, 0, 5);

        foreach ($candidates as $row) {
            if (password_verify($code, $row['token'] ?? '')) return $row;
        }

        return null;
    });
}

function markResetUsedById($id) {
    return withStore(function (&$store) use ($id) {
        foreach ($store['password_resets'] as &$row) {
            if ((int)($row['id'] ?? 0) === (int)$id) {
                $row['used'] = 1;
                return true;
            }
        }
        return false;
    });
}

// ============================================================
// LOGS / SUBMISSIONS
// ============================================================

function appendSignupSubmission($fullName, $email, $success, $note = '') {
    return withStore(function (&$store) use ($fullName, $email, $success, $note) {
        $id = (int)($store['next_submission_id'] ?? 1);
        $store['next_submission_id'] = $id + 1;
        $store['signup_submissions'][] = [
            'id'         => $id,
            'full_name'  => $fullName,
            'email'      => $email,
            'success'    => $success ? 1 : 0,
            'note'       => $note,
            'created_at' => date('Y-m-d H:i:s'),
        ];
        return true;
    });
}

function appendStartSubmission($identifier, $success, $note = '') {
    return withStore(function (&$store) use ($identifier, $success, $note) {
        $id = (int)($store['next_submission_id'] ?? 1);
        $store['next_submission_id'] = $id + 1;
        $store['start_submissions'][] = [
            'id'         => $id,
            'identifier' => $identifier,
            'success'    => $success ? 1 : 0,
            'note'       => $note,
            'created_at' => date('Y-m-d H:i:s'),
        ];
        return true;
    });
}

// ============================================================
// EMAIL — SMTP + fallback mail()
// ============================================================

function smtpRead($fp) {
    $data = '';
    while (($line = fgets($fp, 515)) !== false) {
        $data .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') break;
    }
    return $data;
}

function smtpWrite($fp, $cmd) {
    fwrite($fp, $cmd . "\r\n");
}

function smtpCode($response, $expected) {
    return strpos(trim($response), (string)$expected) === 0;
}

function sendEmailBySmtp($to, $subject, $html, &$status) {
    if (SMTP_HOST === '' || SMTP_USER === '' || SMTP_PASS === '') {
        $status = 'smtp_not_configured';
        return false;
    }

    $secure  = SMTP_SECURE;
    $port    = SMTP_PORT > 0 ? SMTP_PORT : 465;
    $timeout = 15;
    $remote  = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . SMTP_HOST . ':' . $port;

    // Contexte SSL permissif pour localhost
    $ctx = stream_context_create([
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ],
    ]);

    $fp = @stream_socket_client($remote, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        $status = 'smtp_connect_failed: ' . $errstr . ' (' . $errno . ')';
        return false;
    }

    stream_set_timeout($fp, $timeout);

    $greeting = smtpRead($fp);
    if (!smtpCode($greeting, 220)) { fclose($fp); $status = 'smtp_bad_greeting'; return false; }

    smtpWrite($fp, 'EHLO localhost');
    $ehlo = smtpRead($fp);
    if (!smtpCode($ehlo, 250)) { fclose($fp); $status = 'smtp_ehlo_failed'; return false; }

    if ($secure === 'tls') {
        smtpWrite($fp, 'STARTTLS');
        if (!smtpCode(smtpRead($fp), 220)) { fclose($fp); $status = 'smtp_starttls_failed'; return false; }
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($fp); $status = 'smtp_tls_crypto_failed'; return false;
        }
        smtpWrite($fp, 'EHLO localhost');
        if (!smtpCode(smtpRead($fp), 250)) { fclose($fp); $status = 'smtp_ehlo_tls_failed'; return false; }
    }

    smtpWrite($fp, 'AUTH LOGIN');
    if (!smtpCode(smtpRead($fp), 334)) { fclose($fp); $status = 'smtp_auth_not_accepted'; return false; }

    smtpWrite($fp, base64_encode(SMTP_USER));
    if (!smtpCode(smtpRead($fp), 334)) { fclose($fp); $status = 'smtp_auth_user_failed'; return false; }

    smtpWrite($fp, base64_encode(SMTP_PASS));
    if (!smtpCode(smtpRead($fp), 235)) { fclose($fp); $status = 'smtp_auth_pass_failed'; return false; }

    smtpWrite($fp, 'MAIL FROM:<' . MAIL_FROM . '>');
    if (!smtpCode(smtpRead($fp), 250)) { fclose($fp); $status = 'smtp_mail_from_failed'; return false; }

    smtpWrite($fp, 'RCPT TO:<' . $to . '>');
    $rcpt = smtpRead($fp);
    if (!smtpCode($rcpt, 250) && !smtpCode($rcpt, 251)) { fclose($fp); $status = 'smtp_rcpt_failed'; return false; }

    smtpWrite($fp, 'DATA');
    if (!smtpCode(smtpRead($fp), 354)) { fclose($fp); $status = 'smtp_data_failed'; return false; }

    $body = preg_replace('/^\./m', '..', $html);
    $msg  = implode("\r\n", [
        'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM . '>',
        'To: <' . $to . '>',
        'Subject: ' . $subject,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        '',
        $body,
        '.',
    ]);
    fwrite($fp, $msg . "\r\n");

    $sendResp = smtpRead($fp);
    smtpWrite($fp, 'QUIT');
    fclose($fp);

    if (!smtpCode($sendResp, 250)) { $status = 'smtp_send_failed'; return false; }

    $status = 'smtp_sent';
    return true;
}

function sendEmailSmart($to, $subject, $html, &$status) {
    if (sendEmailBySmtp($to, $subject, $html, $status)) return true;

    $headers  = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
    $headers .= "Reply-To: " . MAIL_FROM . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    if (@mail($to, $subject, $html, $headers)) {
        $status = 'mail_sent';
        return true;
    }

    $status = ($status === 'smtp_not_configured') ? 'mail_failed' : $status . '_mail_failed';
    return false;
}

// --- Template HTML email ---
function faithPathEmailTemplate($title, $intro, $contentHtml, $expiryText) {
    $logoUrl = rtrim(BASE_URL, '/') . '/img/logo.png';
    return "
    <div style='margin:0;padding:24px;background:#f2f7f4;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;'>
      <table role='presentation' width='100%' cellspacing='0' cellpadding='0'
             style='max-width:620px;margin:0 auto;background:#fff;border-radius:14px;
                    overflow:hidden;border:1px solid #ddebe2;'>
        <tr>
          <td style='background:linear-gradient(120deg,#0f5b3f,#177d57);padding:22px 24px;text-align:center;'>
            <img src='{$logoUrl}' alt='FaithPath'
                 style='width:64px;height:64px;object-fit:contain;background:#fff;
                        border-radius:50%;padding:8px;display:block;margin:0 auto 10px;'>
            <h1 style='margin:0;color:#fff;font-size:22px;'>FaithPath</h1>
            <p style='margin:6px 0 0;color:#d8f3e6;font-size:13px;'>Security & Account Assistance</p>
          </td>
        </tr>
        <tr>
          <td style='padding:26px 24px;'>
            <h2 style='margin:0 0 12px;color:#0f5132;font-size:20px;'>{$title}</h2>
            <p style='margin:0 0 14px;line-height:1.6;'>{$intro}</p>
            {$contentHtml}
            <div style='margin-top:18px;background:#ecfdf3;border:1px solid #bfe8cd;
                        border-radius:10px;padding:12px 14px;color:#14532d;font-size:13px;'>
              {$expiryText}
            </div>
            <p style='margin:20px 0 0;color:#6b7280;font-size:13px;line-height:1.6;'>
              Si vous n'avez pas demandé cette action, ignorez cet email.<br>
              Cordialement,<br><strong>L'équipe FaithPath</strong>
            </p>
          </td>
        </tr>
      </table>
    </div>";
}

function sendResetEmail($email, $resetLink) {
    $content = "
      <p style='margin:0 0 12px;'>Pour définir un nouveau mot de passe, cliquez ci-dessous :</p>
      <p style='margin:0 0 14px;'>
        <a href='{$resetLink}'
           style='display:inline-block;background:#177d57;color:#fff;text-decoration:none;
                  padding:11px 16px;border-radius:8px;font-weight:600;'>
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p style='margin:0;font-size:13px;color:#4b5563;word-break:break-all;'>
        Lien direct : {$resetLink}
      </p>";

    $body = faithPathEmailTemplate(
        'Réinitialisation du mot de passe',
        'Nous avons reçu une demande de réinitialisation pour votre compte FaithPath.',
        $content,
        'Ce lien est valide pendant <strong>1 heure</strong>.'
    );

    $status = '';
    $sent   = sendEmailSmart($email, 'Réinitialisation de votre mot de passe', $body, $status);
    return ['sent' => $sent, 'status' => $status];
}

function sendResetCodeEmail($email, $code) {
    $content = "
      <p style='margin:0 0 12px;'>Utilisez ce code pour réinitialiser votre mot de passe :</p>
      <div style='margin:0 0 12px;padding:14px 16px;border:1px dashed #177d57;
                  border-radius:10px;background:#f8fff9;text-align:center;'>
        <span style='font-size:32px;font-weight:800;letter-spacing:7px;color:#0f5132;'>
          {$code}
        </span>
      </div>
      <p style='margin:0;font-size:13px;color:#4b5563;'>
        Ne partagez jamais ce code avec quelqu'un.
      </p>";

    $body = faithPathEmailTemplate(
        'Code de vérification',
        'Votre compte est protégé. Entrez ce code dans la page de réinitialisation.',
        $content,
        'Ce code est valide pendant <strong>10 minutes</strong>.'
    );

    $status = '';
    $sent   = sendEmailSmart($email, 'Code de réinitialisation de votre mot de passe', $body, $status);
    return ['sent' => $sent, 'status' => $status];
}

// --- Utilitaire : est-on en local ? ---
function isLocalRequest() {
    $ip   = $_SERVER['REMOTE_ADDR'] ?? '';
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    return $ip === '127.0.0.1' || $ip === '::1' || str_contains($host, 'localhost');
}