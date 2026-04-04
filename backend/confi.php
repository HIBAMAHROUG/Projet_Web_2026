<?php
// config.php - include in all backend files.
function loadEnvFile($filePath) {
    if (!file_exists($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
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

define('BASE_URL', getenv('BASE_URL') ?: 'http://localhost/projet_web_2026');
define('MAIL_FROM', getenv('MAIL_FROM') ?: 'noreply@tonsite.com');
define('MAIL_FROM_NAME', getenv('MAIL_FROM_NAME') ?: 'FaithPath');
define('SMTP_HOST', getenv('SMTP_HOST') ?: '');
define('SMTP_PORT', (int) (getenv('SMTP_PORT') ?: 465));
define('SMTP_USER', getenv('SMTP_USER') ?: '');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');
define('SMTP_SECURE', strtolower(getenv('SMTP_SECURE') ?: 'ssl'));
define('NOSQL_FILE', __DIR__ . '/nosql-data.json');

function getInitialStore() {
    return [
        'users' => [],
        'password_resets' => [],
        'next_user_id' => 1,
        'next_reset_id' => 1,
    ];
}

function ensureNosqlStoreExists() {
    if (!file_exists(NOSQL_FILE)) {
        file_put_contents(
            NOSQL_FILE,
            json_encode(getInitialStore(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
}

function withStore($callback) {
    ensureNosqlStoreExists();

    $fp = fopen(NOSQL_FILE, 'c+');
    if (!$fp) {
        throw new RuntimeException('Impossible d\'ouvrir le fichier NoSQL.');
    }

    try {
        if (!flock($fp, LOCK_EX)) {
            throw new RuntimeException('Impossible de verrouiller le fichier NoSQL.');
        }

        $raw = stream_get_contents($fp);
        $store = json_decode($raw ?: '{}', true);
        if (!is_array($store) || !isset($store['users']) || !isset($store['password_resets'])) {
            $store = getInitialStore();
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

function findUserByEmail($email) {
    return withStore(function ($store) use ($email) {
        foreach ($store['users'] as $user) {
            if (($user['email'] ?? '') === $email) {
                return $user;
            }
        }

        return null;
    });
}

function createUser($fullName, $email, $hashedPassword) {
    return withStore(function (&$store) use ($fullName, $email, $hashedPassword) {
        foreach ($store['users'] as $user) {
            if (($user['email'] ?? '') === $email) {
                return null;
            }
        }

        $id = (int) ($store['next_user_id'] ?? 1);
        $store['next_user_id'] = $id + 1;

        $user = [
            'id' => $id,
            'full_name' => $fullName,
            'email' => $email,
            'password' => $hashedPassword,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $store['users'][] = $user;
        return $user;
    });
}

function deleteActiveResetsByEmail($email) {
    withStore(function (&$store) use ($email) {
        $store['password_resets'] = array_values(array_filter(
            $store['password_resets'],
            function ($item) use ($email) {
                return !(($item['email'] ?? '') === $email && (int) ($item['used'] ?? 0) === 0);
            }
        ));

        return true;
    });
}

function createPasswordReset($email, $token, $expiresAt) {
    return withStore(function (&$store) use ($email, $token, $expiresAt) {
        $id = (int) ($store['next_reset_id'] ?? 1);
        $store['next_reset_id'] = $id + 1;

        $record = [
            'id' => $id,
            'email' => $email,
            'token' => $token,
            'expires_at' => $expiresAt,
            'used' => 0,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $store['password_resets'][] = $record;
        return $record;
    });
}

function getValidResetByToken($token) {
    return withStore(function ($store) use ($token) {
        if (!$token) {
            return null;
        }

        $now = time();
        foreach ($store['password_resets'] as $row) {
            if (($row['token'] ?? '') === $token && (int) ($row['used'] ?? 0) === 0 && strtotime($row['expires_at'] ?? '') > $now) {
                return $row;
            }
        }

        return null;
    });
}

function getValidResetByCode($email, $code) {
    return withStore(function ($store) use ($email, $code) {
        if (!$email || !$code) {
            return null;
        }

        $now = time();
        $candidates = [];

        foreach ($store['password_resets'] as $row) {
            if (($row['email'] ?? '') === $email && (int) ($row['used'] ?? 0) === 0 && strtotime($row['expires_at'] ?? '') > $now) {
                $candidates[] = $row;
            }
        }

        usort($candidates, function ($a, $b) {
            return strcmp(($b['created_at'] ?? ''), ($a['created_at'] ?? ''));
        });

        $candidates = array_slice($candidates, 0, 5);
        foreach ($candidates as $row) {
            if (password_verify($code, $row['token'] ?? '')) {
                return $row;
            }
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

function markResetUsedById($id) {
    return withStore(function (&$store) use ($id) {
        foreach ($store['password_resets'] as &$row) {
            if ((int) ($row['id'] ?? 0) === (int) $id) {
                $row['used'] = 1;
                return true;
            }
        }

        return false;
    });
}

function verifyUserCredentials($email, $plainPassword) {
    return withStore(function ($store) use ($email, $plainPassword) {
        foreach ($store['users'] as $user) {
            if (($user['email'] ?? '') !== $email) {
                continue;
            }

            $hash = $user['password'] ?? '';
            if ($hash !== '' && password_verify($plainPassword, $hash)) {
                return $user;
            }

            return null;
        }

        return null;
    });
}