# 🔐 Système Complet de Réinitialisation avec OTP

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Utilisation](#utilisation)
7. [Sécurité](#sécurité)
8. [API Documentation](#api-documentation)
9. [Dépannage](#dépannage)
10. [Améliorations futures](#améliorations-futures)

---

## 🎯 Vue d'ensemble

Ce système OTP (One-Time Password) est une solution **moderne, sécurisée et conviviale** pour la réinitialisation de mots de passe. Il remplace les anciens systèmes basés sur des tokens par un flux à 3 étapes utilisant des codes à usage unique temporaires.

### Avantages de l'OTP

✅ **Plus convivial** - L'utilisateur reçoit un code 6 chiffres simple  
✅ **Plus sécurisé** - Les codes OTP expirent en 10 minutes  
✅ **Anti-brute force** - Limite de tentatives (5 max)  
✅ **Sans lien** - Pas de risque de partage accidentel de lien  
✅ **Responsive** - Fonctionne parfaitement sur mobile  
✅ **Temps réel** - Timer countdown pour l'expiration  
✅ **Resend** - Possibilité de renvoyer le code  

---

## 🏗️ Architecture

### Flux utilisateur complet

```
                 user@example.com
                        │
                        │ (1) Clique "Oublié Password"
                        ▼
            ┌─────────────────────────┐
            │  request-otp.html       │
            │  Form: Email input      │
            │  "Envoyer le code"      │
            └────────┬────────────────┘
                     │
                     │ POST /api/auth/request-otp
                     │ { email: "user@example.com" }
                     ▼
            ┌─────────────────────────┐
            │  Backend                │
            │  - Valide email         │
            │  - Rate limiting        │
            │  - Génère OTP (6 digits)│
            │  - Envoie email         │
            │  - BD: Stocke OTP       │
            │  Response: { otpId }    │
            └────────┬────────────────┘
                     │
                     │ Redirection
                     ▼
┌─────────────────────────────────────┐
│  Email reçu avec code               │
│  Exemple: 627541                    │
│  Valide pendant 10 minutes          │
└─────────────────────────────────────┘
                     │
                     │ (2) Copie le code
                     ▼
            ┌──────────────────────────┐
            │  verify-otp.html         │
            │  - 6 champs pour OTP     │
            │  - Auto-focus entre eux  │
            │  - Timer countdown       │
            │  - Bouton resend         │
            └────────┬─────────────────┘
                     │
                     │ POST /api/auth/verify-otp
                     │ { otpId, otp: "627541" }
                     ▼
            ┌──────────────────────────┐
            │  Backend                 │
            │  - Vérifie le code       │
            │  - Rate limiting         │
            │  - Crée session          │
            │  - BD: Mark OTP usado    │
            │  Response:               │
            │  { sessionToken }        │
            └────────┬─────────────────┘
                     │
                     │ Redirection
                     ▼
            ┌──────────────────────────┐
            │  reset-password.html     │
            │  - Nouveau mot de passe  │
            │  - Confirmer             │
            │  - Indicateur de force   │
            │  - Checklist requis      │
            └────────┬─────────────────┘
                     │
                     │ (3) Entrer nouveau mot de passe
                     │ POST /api/auth/reset-password
                     │ { sessionToken, password }
                     ▼
            ┌──────────────────────────┐
            │  Backend                 │
            │  - Valide mot de passe   │
            │  - Valide session        │
            │  - Hache avec bcryptjs   │
            │  - Mise à jour BD        │
            │  - Invalide tokens       │
            │  - Audit log             │
            │  Response: { success }   │
            └────────┬─────────────────┘
                     │
                     │ Redirection
                     ▼
            ┌──────────────────────────┐
            │  start.html              │
            │  Login avec nouveau mdp  │
            │  ✅ Succès!              │
            └──────────────────────────┘
```

### Structure Backend

```
backend/
├── config/
│   ├── database.js       ← MySQL pool
│   ├── email.js          ← Nodemailer + templates
│   └── otp.js            ← Configuration OTP
├── utils/
│   └── otp.js            ← Utilitaires: génération, hachage, validation
├── models/
│   └── User.js           ← Requêtes BD (51 fonctions)
├── controllers/
│   └── authController.js ← Vue métier (4 endpoints)
├── routes/
│   └── auth.js           ← Routes API
├── database_schema_otp.sql  ← Schema BD
├── server.js             ← Express app
└── package.json          ← Dépendances
```

### Structure Frontend

```
├── request-otp.html      ← Page 1: Demander le code
├── verify-otp.html       ← Page 2: Vérifier le code
├── reset-password.html   ← Page 3: Entrer nouveau mot de passe
└── start.html            ← Lien mis à jour
```

### Schema Base de Données

5 tables principales:

```sql
users                    -- Utilisateurs du système
├── id, name, email, phone, password
├── is_active, email_verified_at
├── created_at, updated_at

otp_codes                -- Codes OTP pour réinitialisation
├── id, user_id, otp_code_hash (NOT plain!)
├── type (password_reset)
├── contact_email, contact_phone
├── attempts_count (limite 5)
├── max_attempts
├── is_used, expires_at
├── verified_at
├── created_at, updated_at
└── FOREIGN KEY user_id

password_reset_sessions  -- Sessions de reset après OTP verified
├── id, user_id
├── session_token (unique, 32 bytes)
├── otp_id (FOREIGN KEY)
├── otp_verified_at
├── password_reset_at
├── expires_at (15 min après OTP)
├── is_used
├── created_at, updated_at

audit_logs               -- Logs de sécurité
├── id, user_id, action
├── description, ip_address, user_agent
├── status (success|failed|blocked)
├── metadata (JSON)
└── created_at

rate_limits              -- Limite de taux
├── ip_address
├── action (otp_request, otp_verify, etc)
├── attempts_count
├── first_attempt_at
├── reset_at
└── UNIQUE KEY (ip_address, action)
```

---

## ✨ Fonctionnalités

### Phase 1: Demander un code OTP

- ✅ Validation email en temps réel
- ✅ Rate limiting (5 demandes/15 min)
- ✅ Recherche utilisateur sécurisée
- ✅ Email masqué dans réponse
- ✅ Envoi email avec code 6 chiffres
- ✅ OTP valide 10 minutes
- ✅ Logs d'audit de toutes les actions

### Phase 2: Vérifier le code OTP

- ✅ Auto-focus entre les 6 champs
- ✅ Validation en temps réel
- ✅ Timer countdown (10 min)
- ✅ Affichage tentatives restantes
- ✅ Bouton "Resend" avec cooldown (60s)
- ✅ Support copier-coller (6 chiffres)
- ✅ Support clavier (flèches, backspace)
- ✅ Rate limiting (10 vérif/15 min)
- ✅ Blocage après 5 tentatives
- ✅ Création de session après succès

### Phase 3: Réinitialiser mot de passe

- ✅ Indicateur de force en temps réel
- ✅ Checklist des 5 critères:
  - ✓ 8 caractères minimum
  - ✓ 1 majuscule
  - ✓ 1 minuscule
  - ✓ 1 chiffre
  - ✓ 1 symbole spécial
- ✅ Couleurs: faible (rouge), moyen (orange), fort (vert)
- ✅ Confirmation du mot de passe
- ✅ Toggle pour voir/masquer
- ✅ Validation de la session
- ✅ Rate limiting (5 resets/60 min)

### Bonus

- ✅ UX moderne et responsive
- ✅ Design arabe (RTL) parfait
- ✅ Messages multilingues (FR/AR)
- ✅ Transitions fluides
- ✅ Icônes FontAwesome
- ✅ Gestion des erreurs complète
- ✅ Sécurité OWASP Top 10

---

## 🚀 Installation

### Prérequis

- Node.js v14+
- MySQL 5.7+
- npm ou yarn

### Étape 1: Cloner/Copier les fichiers

```bash
# Tous les fichiers sont dans le dossier projet
backend/
├── config/, controllers/, models/, routes/, utils/
├── package.json
├── server.js
├── database_schema_otp.sql

# Frontend
├── request-otp.html
├── verify-otp.html
├── reset-password.html
```

### Étape 2: Installer Node.js

[https://nodejs.org](https://nodejs.org) - Télécharger la version LTS

```bash
node --version  # Vérifier v14+
npm --version   # Vérifier npm
```

### Étape 3: Installer MySQL

[https://www.mysql.com](https://www.mysql.com) - Télécharger Community Server

```bash
mysql --version  # Vérifier MySQL
```

### Étape 4: Créer la base de données

```bash
# Terminal/CMD
mysql -u root -p

# Prompt MySQL
CREATE DATABASE faithpath_otp;
EXIT;
```

### Étape 5: Installer les dépendances Node

```bash
cd backend
npm install
```

### Étape 6: Configurer .env

Copier `.env.example` vers `.env` et remplir:

```ini
#.env
NODE_ENV=development
PORT=5000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=faithpath_otp
DB_PORT=3306

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=FaithPath

# OTP Config
OTP_LENGTH=6
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# CORS
FRONTEND_URL=http://localhost:3000
```

### Étape 7: Configurer Gmail 2FA

**CRITIQUE** - Gmail nécessite 2FA + App Password:

1. Aller à [myaccount.google.com](https://myaccount.google.com)
2. Sécurité → Vérification en deux étapes (activer)
3. Mots de passe d'application
   - Sélectionner "Mail" et "Windows Computer"
   - Copier le mot de passe généré
4. Coller dans `.env` comme `EMAIL_PASSWORD`

### Étape 8: Créer les tables BD

```bash
# Terminal, dans dossier backend
mysql -u root -p faithpath_otp < database_schema_otp.sql

# OU manuellement:
node migrate.js
```

### Étape 9: Démarrer le serveur

```bash
# Terminal, dans dossier backend
npm start

# Résultat:
# ✅ Server running on http://localhost:5000
# ✅ Connected to MySQL
```

### Étape 10: Tester le système

1. Ouvrir [http://localhost:3000/start.html](http://localhost:3000/start.html)
2. Cliquer "نسيت كلمة المرور؟"
3. Entrer email (ex: user@example.com)
4. Recevoir code dans email (ou console si dev)
5. Entrer les 6 chiffres
6. Entrer nouveau mot de passe
7. Redirection vers login
8. ✅ Connexion avec nouveau mot de passe

---

## ⚙️ Configuration

### config/otp.js

Tous les paramètres OTP centralisés:

```javascript
otp: {
    length: 6,                    // 4-6 digits
    format: 'digits',             // digits | alphanumeric
    expiryMinutes: 10,            // OTP valide 10 min
    maxAttempts: 5,               // Limite tentatives
    resendDelaySeconds: 60,       // Délai minini entre resend
    cooldownSeconds: 300,         // 5 min avant deuxième OTP
},

rateLimit: {
    maxOtpRequests: 5,            // 5 / 15 min par IP
    otpRequestWindowMinutes: 15,
    maxOtpVerifications: 10,      // 10 / 15 min par IP
    otpVerificationWindowMinutes: 15,
},

passwordRules: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
}
```

### config/email.js

Exemple template email:

```html
<!-- Subject: رمز التحقق الخاص بك - Your Verification Code -->

<html dir="rtl">
  <h1>مرحبا {{name}}</h1>
  <p>رمز التحقق الخاص بك: <strong>{{code}}</strong></p>
  <p>الكود صالح لمدة {{minutes}} دقيقة فقط</p>
  <p>لا تشارك هذا الكود مع أحد</p>
</html>
```

### variables d'environnement

Bien voir `.env.example` pour une liste complète:

```ini
# Développement
NODE_ENV=development
DEBUG=true

# Production
NODE_ENV=production
DEBUG=false
HTTPS=true
```

---

## 📖 Utilisation

### Flow de développement

```bash
# 1. Démarrer le serveur
npm start

# 2. Lancertest manuel
# - Ouvrir request-otp.html
# - Vérifier console pour OTP (en DEV)
# - Ou vérifier email

# 3. Hot reload
npm run dev  # Avec nodemon
```

### Ajouter nouvel utilisateur test

Dans MySQL:

```sql
INSERT INTO users (name, email, phone, password, is_active)
VALUES ('Ahmed', 'ahmed@example.com', '+212612345678', 
        '$2a$10$...hashed_password...', 1);
```

### Tester l'API directement

```bash
# 1. Demander OTP
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Response:
# {
#   "success": true,
#   "otpId": 123,
#   "message": "Code envoyé",
#   "minutesUntilExpiry": 10,
#   "email": "us***@example.com"
# }

# 2. Vérifier OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"otpId":123,"otp":"123456"}'

# 3. Reset Password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "sessionToken":"...",
    "password":"NewPass123!",
    "confirmPassword":"NewPass123!"
  }'
```

---

## 🔒 Sécurité

### Mesures implémentées

1. **OTP Hashing**
   - OTP haché avec bcryptjs (10 rounds)
   - JAMAIS stocké en plain text
   - Comparaison sécurisée avec bcrypt.compare()

2. **Token Session**
   - UUID v4 (128 bits) pour les tokens
   - Unique par session
   - Expiration 15 minutes après OTP

3. **Limite du taux (Rate Limiting)**
   - 5 OTP requests par IP / 15 min
   - 10 vérifications par IP / 15 min  
   - Stocké en BD pour persistance

4. **Pas d'énumération d'email**
   - Même réponse whether email existe ou pas
   - Timestamps aléatoires pour éviter timing attacks
   - Logs sécurisés pour audit

5. **Validation stricte**
   - Email format validation
   - OTP format: 6 chiffres uniquement
   - Mot de passe: 5 critères requis
   - Session token: format exact

6. **CORS configuré**
   - Frontend URL en variable d'env
   - Credentials si nécessaire
   - Methods: POST, GET seulement

7. **Logs d'audit complets**
   - Qui (user_id)
   - Quoi (action)
   - Quand (timestamp)
   - D'où (IP address, user-agent)
   - Résultat (success/failed/blocked)

8. **Base de données sécurisée**
   - Foreign keys pour intégrité
   - Indexes pour performance
   - Cascades DELETE correctes
   - Transactions pour atomicité

### Checklist OWASP Top 10

- ✅ Injection SQL prevented (Prepared statements)
- ✅ XSS prevented (Input validation, escaping)
- ✅ Authentication secure (bcryptjs, sessions)
- ✅ Sensitive data exposure prevented (hashed passwords, HTTPS ready)
- ✅ Access control enforced (Rate limiting, session validation)
- ✅ Security misconfiguration prevented (.env secrets)
- ✅ Insufficient logging prevented (Audit logs)
- ✅ CSRF protected (CORS, token validation)
- ✅ Components vulnerable prevented (npm audit, dependencies)
- ✅ Insufficient monitoring prevented (Detailed logging)

---

## 📡 API Documentation

### 1. POST /api/auth/request-otp

**Demander un code OTP**

```
Request:
  POST /api/auth/request-otp
  Content-Type: application/json
  
  {
    "email": "user@example.com"
  }

Response 200 (Succès):
  {
    "success": true,
    "otpId": 123,
    "message": "Code de vérification envoyé avec succès",
    "minutesUntilExpiry": 10,
    "email": "us***@example.com"
  }

Response 400 (Erreur):
  {
    "success": false,
    "error": "Invalid email format",
    "message": "Format d'email invalide"
  }

Response 429 (Rate limited):
  {
    "success": false,
    "error": "Rate limited",
    "message": "Trop de demandes. Réessayez plus tard",
    "resetAt": "2026-03-29T22:30:00Z"
  }

Sécurité:
  - Rate limiting: 5 / 15 min par IP
  - Email masqué dans réponse
  - Pas de révélation si email existe
  - OTP expire en 10 minutes
```

### 2. POST /api/auth/verify-otp

**Vérifier le code OTP**

```
Request:
  POST /api/auth/verify-otp
  Content-Type: application/json
  
  {
    "otpId": 123,
    "otp": "627541"
  }

Response 200 (Succès):
  {
    "success": true,
    "message": "Vérification réussie",
    "sessionToken": "abc123def456...",
    "minutesUntilSessionExpiry": 15
  }

Response 400 (OTP invalide):
  {
    "success": false,
    "error": "Invalid OTP",
    "message": "Code de vérification invalide",
    "attemptsRemaining": 3
  }

Response 403 (Trop de tentatives):
  {
    "success": false,
    "error": "OTP blocked",
    "message": "Trop de tentatives. Veuillez attendre",
    "blocked": true
  }

Sécurité:
  - Rate limiting: 10 vérif / 15 min par IP
  - Max 5 tentatives per OTP
  - Session créée après succès
  - OTP marqué comme utilisé
```

### 3. POST /api/auth/reset-password

**Réinitialiser le mot de passe**

```
Request:
  POST /api/auth/reset-password
  Content-Type: application/json
  
  {
    "sessionToken": "abc123def456...",
    "password": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }

Response 200 (Succès):
  {
    "success": true,
    "message": "Mot de passe réinitialisé avec succès"
  }

Response 400 (Mot de passe faible):
  {
    "success": false,
    "error": "Weak password",
    "message": "Le mot de passe ne respecte pas les critères",
    "errors": [
      "Minimum 8 characters required",
      "At least one uppercase letter required"
    ],
    "strength": "weak"
  }

Response 400 (Session invalide):
  {
    "success": false,
    "error": "Invalid session",
    "message": "La session a expiré. Veuillez recommencer"
  }

Sécurité:
  - Session valide obligatoire
  - Mot de passe haché avec bcryptjs
  - Tous les OLD OTP invalidés
  - Audit log de succès
  - Rate limiting: 5 resets / 60 min par IP
```

### 4. POST /api/auth/resend-otp

**Renvoyer le code OTP**

```
Request:
  POST /api/auth/resend-otp
  
  {
    "otpId": 123
  }

Response 200:
  {
    "success": true,
    "message": "OTP renvoyé"
  }

Constraints:
  - OTP doit être aktif (nonexpired, non-used)
  - Délai: 1 minute minimum entre resends
```

---

## 🐛 Dépannage

### Problème: "Email sending failed"

**Cause 1:** Gmail 2FA non activé

```
Solution:
1. Aller myaccount.google.com/security
2. Activer 2FA
3. Générer App Password
4. Coller dans .env comme EMAIL_PASSWORD
```

**Cause 2:** Mauvais mot de passe dans .env

```
Solution:
1. Copier App Password EXACT de Gmail
2. Pas d'espaces avant/après
3. Vérifier dans .env (pas de guillemets sauf quoted values)
EMAIL_PASSWORD=xyzlkcjzxsqwdcp  ← 16 caractères générés
```

**Cause 3:** MySQL n'écoute pas e-mail

```sql
-- Vérifier la connexion
SELECT * FROM users;  -- Dans MySQL

-- Ou tester avec curl
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Problème: "Too many attempts"

**Cause:** Rate limiting activé

```
Solution (Dev):
- Attendre 15 minutes
- OU modifier config/otp.js: maxOtpRequests: 100
- OU vider table rate_limits en MySQL

DELETE FROM rate_limits WHERE action='otp_request';
```

### Problème: "OTP expired"

**Cause:** Dépassé 10 minutes

```
Solution:
- Cliquer "Demander un nouveau code"
- Timer le montre exactement
- Config: expiryMinutes: 10 dans config/otp.js
```

### Problème: "Session expired"

**Cause:** Plus de 15 minutes depuis OTP

```
Solution:
- Recommencer depuis le début
- OTP → Vérification → Reset
- Dura totale: 25 minutes max
- Config: durationMinutes: 15 dans config/otp.js
```

### Problème: OTP saisi mais "Invalid OTP"

**Causes possibles:**

1. **Code expiré**
   - Timer affiché en haut
   - Cliquer "Renvoyer"

2. **Mauvais code**
   - Vérifier email attentivement
   - Pas d'espaces
   - Sensible à la casse (non applicable pour chiffres)

3. **Mauvais otpId**
   - SessionStorage corrompu?
   - Ouvrir DevTools F12 > Application > Session Storage
   - Effacer et recommencer

### Problème: Console error "fetch failed"

**Cause:** Serveur non lancé

```
Solution:
1. Terminal: npm start (dans backend/)
2. Vérifier: http://localhost:5000/api/auth/health
   Response: { status: "OTP Authentication Service is running" }
3. Frontend: http://localhost:3000/start.html
```

### Logs d'audit pour débugage

```sql
-- Voir les 50 derniers logs
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50;

-- Filtrer par utilisateur
SELECT * FROM audit_logs WHERE user_id=1 ORDER BY created_at DESC;

-- Filtrer par action
SELECT * FROM audit_logs WHERE action='otp_sent' ORDER BY created_at DESC;

-- Filtrer par IP
SELECT * FROM audit_logs WHERE ip_address='192.168.1.1';

-- Voir les bloqués
SELECT * FROM audit_logs WHERE status='blocked' ORDER BY created_at DESC;
```

---

## 🚀 Améliorations futures

### Phase 2 (Court terme)

- [ ] SMS support (OTP par SMS)
- [ ] 2FA optionnel (Email + SMS)
- [ ] Password history (pas de resutil d'ancien mot de passe)
- [ ] Email verification on signup
- [ ] Admin dashboard (gérer utilisateurs)
- [ ] Audit log viewer (interface friendly)

### Phase 3 (Moyen terme)

- [ ] TOTP (Google Authenticator)
- [ ] Backup codes (récupération)
- [ ] Social login (Google, Facebook)
- [ ] SSO (Single Sign On)
- [ ] IP whitelisting
- [ ] Device management

### Phase 4 (Long terme)

- [ ] Biometric auth (fingerprint, face)
- [ ] WebAuthn/FIDO2
- [ ] Machine learning (fraud detection)
- [ ] API key management
- [ ] OAuth 2.0 provider
- [ ] Synchronisation multi-appareils

### Optimisations

- [ ] Caching Redis pour OTP (au lieu de BD)
- [ ] Database optimization indexes
- [ ] CDN for frontend

- [ ] API rate limiting par utilisateur
- [ ] GraphQL API option
- [ ] WebSocket real-time updates
- [ ] Monitoring dashboard (Grafana)

---

## 📞 Support & Contact

**Documentation**
- Voir README.md (ce fichier)
- SETUP_GUIDE.md (démarrage rapide)
- SECURITY_CHECKLIST.md (sécurité)
- Code comments (au-dessus de chaque fonction)

**Signaler un problème**
- Créer une issue GitHub
- Inclure les logs (console.log)
- Configuration (redacted .env)
- Étapes para reproduire

**Contribuer**
- Fork le projet
- Créer une branche feature
- Pull request avec description

---

## 📄 Licence

** propriétaire - FaithPath 2026**

---

## 🙏 Remerciements

- **Express.js** - Framework web
- **MySQL** - Database
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email delivery
- **Bootstrap** - CSS framework
- **Font Awesome** - Icons
- **OWASP** - Security guidelines

---

**Créé avec ❤️ pour FaithPath**  
**وَاللَّهُ يَهْدِي إِلَى الْحَقِّ**

وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
*Et celui qui craint Dieu, Il lui accordera une issue favorable*

---

**Version:** 1.0.0  
**Date:** March 29, 2026  
**Status:** ✅ Production-Ready
