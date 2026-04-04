<?php
require 'confi.php';

function respondJson($success, $message, $status = 200, $extra = []) {
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message,
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function smtpRead($fp) {
    $data = '';
    while (($line = fgets($fp, 515)) !== false) {
        $data .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtpWrite($fp, $command) {
    fwrite($fp, $command . "\r\n");
}

function smtpExpectCode($response, $expectedPrefix) {
    return strpos($response, (string) $expectedPrefix) === 0;
}

function sendEmailBySmtp($to, $subject, $html, &$transportStatus) {
    if (SMTP_HOST === '' || SMTP_USER === '' || SMTP_PASS === '') {
        $transportStatus = 'smtp_not_configured';
        return false;
    }

    $host = SMTP_HOST;
    $port = SMTP_PORT > 0 ? SMTP_PORT : 465;
    $secure = SMTP_SECURE;
    $timeout = 15;
    $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host;

    $fp = @fsockopen($remote, $port, $errno, $errstr, $timeout);
    if (!$fp) {
        $transportStatus = 'smtp_connect_failed';
        return false;
    }

    stream_set_timeout($fp, $timeout);
    $greeting = smtpRead($fp);
    if (!smtpExpectCode($greeting, 220)) {
        fclose($fp);
        $transportStatus = 'smtp_bad_greeting';
        return false;
    }

    smtpWrite($fp, 'EHLO localhost');
    $ehlo = smtpRead($fp);
    if (!smtpExpectCode($ehlo, 250)) {
        fclose($fp);
        $transportStatus = 'smtp_ehlo_failed';
        return false;
    }

    if ($secure === 'tls') {
        smtpWrite($fp, 'STARTTLS');
        $startTls = smtpRead($fp);
        if (!smtpExpectCode($startTls, 220)) {
            fclose($fp);
            $transportStatus = 'smtp_starttls_failed';
            return false;
        }

        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($fp);
            $transportStatus = 'smtp_tls_crypto_failed';
            return false;
        }

        smtpWrite($fp, 'EHLO localhost');
        $ehloTls = smtpRead($fp);
        if (!smtpExpectCode($ehloTls, 250)) {
            fclose($fp);
            $transportStatus = 'smtp_ehlo_tls_failed';
            return false;
        }
    }

    smtpWrite($fp, 'AUTH LOGIN');
    $authResp = smtpRead($fp);
    if (!smtpExpectCode($authResp, 334)) {
        fclose($fp);
        $transportStatus = 'smtp_auth_not_accepted';
        return false;
    }

    smtpWrite($fp, base64_encode(SMTP_USER));
    $userResp = smtpRead($fp);
    if (!smtpExpectCode($userResp, 334)) {
        fclose($fp);
        $transportStatus = 'smtp_auth_user_failed';
        return false;
    }

    smtpWrite($fp, base64_encode(SMTP_PASS));
    $passResp = smtpRead($fp);
    if (!smtpExpectCode($passResp, 235)) {
        fclose($fp);
        $transportStatus = 'smtp_auth_pass_failed';
        return false;
    }

    smtpWrite($fp, 'MAIL FROM:<' . MAIL_FROM . '>');
    $mailFromResp = smtpRead($fp);
    if (!smtpExpectCode($mailFromResp, 250)) {
        fclose($fp);
        $transportStatus = 'smtp_mail_from_failed';
        return false;
    }

    smtpWrite($fp, 'RCPT TO:<' . $to . '>');
    $rcptResp = smtpRead($fp);
    if (!smtpExpectCode($rcptResp, 250) && !smtpExpectCode($rcptResp, 251)) {
        fclose($fp);
        $transportStatus = 'smtp_rcpt_failed';
        return false;
    }

    smtpWrite($fp, 'DATA');
    $dataResp = smtpRead($fp);
    if (!smtpExpectCode($dataResp, 354)) {
        fclose($fp);
        $transportStatus = 'smtp_data_failed';
        return false;
    }

    $safeHtml = preg_replace('/^\./m', '..', $html);
    $headers = [];
    $headers[] = 'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM . '>';
    $headers[] = 'Reply-To: ' . MAIL_FROM;
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'Subject: ' . $subject;
    $headers[] = 'To: <' . $to . '>';
    $headers[] = '';
    $headers[] = $safeHtml;

    fwrite($fp, implode("\r\n", $headers) . "\r\n.\r\n");
    $sendResp = smtpRead($fp);

    smtpWrite($fp, 'QUIT');
    fclose($fp);

    if (!smtpExpectCode($sendResp, 250)) {
        $transportStatus = 'smtp_send_failed';
        return false;
    }

    $transportStatus = 'smtp_sent';
    return true;
}

function sendEmailSmart($to, $subject, $html, &$transportStatus) {
    $sent = sendEmailBySmtp($to, $subject, $html, $transportStatus);
    if ($sent) {
        return true;
    }

    $headers  = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
    $headers .= "Reply-To: " . MAIL_FROM . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    $fallbackSent = @mail($to, $subject, $html, $headers);
    if ($fallbackSent) {
        $transportStatus = 'mail_sent';
        return true;
    }

    if ($transportStatus === '' || $transportStatus === 'smtp_not_configured') {
        $transportStatus = 'mail_failed';
    } else {
        $transportStatus .= '_mail_failed';
    }

    return false;
}

function faithPathEmailTemplate($title, $intro, $contentHtml, $expiryText) {
        $logoUrl = rtrim(BASE_URL, '/') . '/img/logo.png';

        return "
            <div style='margin:0;padding:24px;background:#f2f7f4;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;'>
                <table role='presentation' width='100%' cellspacing='0' cellpadding='0' style='max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ddebe2;'>
                    <tr>
                        <td style='background:linear-gradient(120deg,#0f5b3f,#177d57);padding:22px 24px;text-align:center;'>
                            <img src='{$logoUrl}' alt='FaithPath' style='width:64px;height:64px;object-fit:contain;background:#fff;border-radius:50%;padding:8px;display:block;margin:0 auto 10px auto;'>
                            <h1 style='margin:0;color:#ffffff;font-size:22px;letter-spacing:0.2px;'>FaithPath Team</h1>
                            <p style='margin:6px 0 0 0;color:#d8f3e6;font-size:13px;'>Security & Account Assistance</p>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding:26px 24px;'>
                            <h2 style='margin:0 0 12px 0;color:#0f5132;font-size:20px;'>{$title}</h2>
                            <p style='margin:0 0 14px 0;line-height:1.6;'>{$intro}</p>
                            {$contentHtml}
                            <div style='margin-top:18px;background:#ecfdf3;border:1px solid #bfe8cd;border-radius:10px;padding:12px 14px;color:#14532d;font-size:13px;'>
                                {$expiryText}
                            </div>
                            <p style='margin:20px 0 0 0;color:#6b7280;font-size:13px;line-height:1.6;'>
                                If you did not request this action, please ignore this email.<br>
                                Regards,<br>
                                <strong>FaithPath Team</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        ";
}

function sendResetEmail($email, $resetLink) {
    $subject = "Reinitialisation de votre mot de passe";
        $content = "
            <p style='margin:0 0 12px 0;'>Pour definir un nouveau mot de passe, utilisez le lien suivant:</p>
            <p style='margin:0 0 14px 0;'>
                <a href='{$resetLink}' style='display:inline-block;background:#177d57;color:#ffffff;text-decoration:none;padding:11px 16px;border-radius:8px;font-weight:600;'>Reinitialiser Mon Mot de Passe</a>
            </p>
            <p style='margin:0;font-size:13px;color:#4b5563;word-break:break-all;'>Lien direct: {$resetLink}</p>
        ";
        $body = faithPathEmailTemplate(
                'Reinitialisation du mot de passe',
                'Nous avons recu une demande de reinitialisation pour votre compte FaithPath.',
                $content,
                'Ce lien est valide pendant 1 heure.'
        );

    $transportStatus = '';
    $sent = sendEmailSmart($email, $subject, $body, $transportStatus);
    return ['sent' => $sent, 'status' => $transportStatus];
}

function sendResetCodeEmail($email, $code) {
        $subject = "Code de reinitialisation de votre mot de passe";
        $content = "
            <p style='margin:0 0 12px 0;'>Utilisez ce code pour reinitialiser votre mot de passe:</p>
            <div style='margin:0 0 12px 0;padding:14px 16px;border:1px dashed #177d57;border-radius:10px;background:#f8fff9;text-align:center;'>
              <span style='font-size:32px;font-weight:800;letter-spacing:7px;color:#0f5132;'>{$code}</span>
            </div>
            <p style='margin:0;font-size:13px;color:#4b5563;'>Ne partagez jamais ce code avec quelqu'un.</p>
        ";
        $body = faithPathEmailTemplate(
            'Code de verification',
            'Votre compte est protege. Entrez ce code dans la page de reinitialisation.',
            $content,
            'Ce code est valide pendant 10 minutes.'
        );

        $transportStatus = '';
        $sent = sendEmailSmart($email, $subject, $body, $transportStatus);
        return ['sent' => $sent, 'status' => $transportStatus];
}

    function isLocalRequest() {
        $remote = $_SERVER['REMOTE_ADDR'] ?? '';
        $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
        return $remote === '127.0.0.1' || $remote === '::1' || strpos($host, 'localhost') !== false;
    }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(false, 'Methode non autorisee.', 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
$email = trim($payload['email'] ?? ($_POST['email'] ?? ''));
$mode = strtolower(trim($payload['mode'] ?? ($_POST['mode'] ?? 'link')));

if (!in_array($mode, ['link', 'code'], true)) {
    respondJson(false, 'Mode invalide. Utilisez link ou code.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respondJson(false, 'Adresse email invalide.', 422);
}

$user = findUserByEmail($email);
$debugOtp = null;
$mailSent = false;
$mailStatus = 'not_attempted';
$debugAllowed = (getenv('DEBUG_RETURN_OTP') === '1') || isLocalRequest();

if ($user) {
    deleteActiveResetsByEmail($email);

    if ($mode === 'code') {
        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $otpHash = password_hash($otpCode, PASSWORD_BCRYPT);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        createPasswordReset($email, $otpHash, $expiresAt);

        $sendResult = sendResetCodeEmail($email, $otpCode);
        $mailSent = (bool) ($sendResult['sent'] ?? false);
        $mailStatus = $sendResult['status'] ?? 'failed';

        if (!$mailSent && $debugAllowed) {
            $debugOtp = $otpCode;
        }
    } else {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

        createPasswordReset($email, $token, $expiresAt);

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/backend'));
        $projectPath = rtrim(dirname($scriptPath), '/');
        $resetLink = $scheme . '://' . $host . ($projectPath ?: '') . '/reset-password.html?token=' . urlencode($token);

        $sendResult = sendResetEmail($email, $resetLink);
        $mailSent = (bool) ($sendResult['sent'] ?? false);
        $mailStatus = $sendResult['status'] ?? 'failed';
    }
}

if ($mode === 'code') {
    $extra = [];
    if ($debugAllowed) {
        $extra['debugAccountExists'] = (bool) $user;
        $extra['mailStatus'] = $mailStatus;
    }
    if ($debugOtp !== null) {
        $extra['debugCode'] = $debugOtp;
    }

    respondJson(true, 'Si cet email est enregistre, un code de verification a ete envoye.', 200, $extra);
}

respondJson(true, 'Si cet email est enregistre, un lien de reinitialisation a ete envoye.');