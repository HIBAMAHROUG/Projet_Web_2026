# 🚀 Guide de Démarrage Rapide - Système de Réinitialisation

## ⏱️ 5 minutes pour commencer

### Étape 1: Installer Node.js et MySQL

**Télécharger:**
- Node.js: https://nodejs.org (Version LTS recommandée)
- MySQL: https://www.mysql.com/downloads/mysql/

**Vérifier l'installation (Windows PowerShell):**
```powershell
node --version
npm --version
mysql --version
```

---

### Étape 2: Configurer la base de données MySQL

**Ouvrir MySQL:**
```powershell
mysql -u root -p
```
(Entrer le mot de passe MySQL)

**Créer la base de données:**
```sql
CREATE DATABASE faithpath_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

### Étape 3: Installer les dépendances Node.js

Ouvrir PowerShell dans le dossier `c:\projet_web_2026\backend`:

```powershell
cd c:\projet_web_2026\backend
npm install
```

**Attendre la fin de l'installation** (~2 min)

---

### Étape 4: Exécuter la migration

```powershell
node migrate.js
```

**Vous devriez voir:** ✅ Migration réussie!

---

### Étape 5: Configurer Gmail (pour les emails)

1. Aller à: https://myaccount.google.com/security
2. Activer **"Authentification à deux facteurs"** (rechercher 2FA)
3. Aller à: https://myaccount.google.com/apppasswords
4. Sélectionner: **Mail** + **Windows Computer**
5. Copier le mot de passe généré

---

### Étape 6: Créer le fichier `.env`

Ouvrir `c:\projet_web_2026\backend\.env.example` et l'enregistrer sous le nom `.env`:

```ini
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app_password_from_step_5
```

---

### Étape 7: Démarrer le serveur

```powershell
npm start
```

**Vous devriez voir:**
```
╔════════════════════════════════════════════════════════════╗
║  🕌 API FaithPath - Réinitialisation de Mot de Passe      ║
║  ✅ Serveur démarré sur le port 5000                      ║
║  📧 Configuration email: ✅ Configurée                    ║
║  🗄️  Base de données: faithpath_db                        ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🧪 Tester le système

1. **Ouvrir le navigateur:**
   ```
   http://localhost:3000/start.html
   ```

2. **Cliquer sur "نسيت كلمة المرور؟"** (Forgot Password?)

3. **Entrer un email** et envoyer

4. **Vérifier la boîte email** (Attention aux spams!)

5. **Cliquer sur le lien** dans l'email

6. **Entrer la nouvelle mot de passe:**
   - Min 8 caractères
   - 1 majuscule (ex: A)
   - 1 minuscule (ex: a)
   - 1 chiffre (ex: 1)
   - 1 symbole (ex: !)
   
   Exemple: `MyPassword123!`

7. **Se connecter** avec la nouvelle mot de passe

---

## ⚠️ Problèmes courants

### "MySQL: Access denied for user 'root'@'localhost'"
```powershell
# Vérifier que MySQL fonctionne:
mysql -u root -p

# Si ça ne marche pas, relancer le service MySQL:
net start MySQL80
```

### "Port 5000 already in use"
```powershell
# Tuer le processus:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Ou changer le port dans .env:
PORT=5001
```

### "Failed to send email"
- Vérifier Gmail 2FA est activé
- Vérifier le "app password" est correct
- Vérifier `EMAIL_USER` et `EMAIL_PASSWORD` dans `.env`

### "Database not created"
```powershell
# Créer manuellement:
mysql -u root -p
CREATE DATABASE faithpath_db;

# Puis:
node migrate.js
```

---

## 📁 Structure des fichiers

```
c:\projet_web_2026\
├── backend/
│   ├── server.js           # ← Arrêter : Ctrl+C
│   ├── migrate.js          # ← Exécuter une fois: node migrate.js
│   ├── package.json        # ← Installer: npm install
│   ├── .env                # ← Modifier avec vos données
│   └── .env.example        # ← Copier comme modèle
├── forgot-password.html    # ← Lien depuis start.html
├── reset-password.html     # ← Lien depuis email
└── start.html              # ← Lien "نسيت كلمة المرور؟"
```

---

## 📖 Documentation complète

Voir: `c:\projet_web_2026\backend\README.md`

---

## 🔒 Production

Pour déployer en production:
1. Passer `NODE_ENV=production`
2. Augmenter `BCRYPT_ROUNDS=12`
3. Utiliser HTTPS obligatoire
4. Utiliser une base de données cloud
5. Configurer un monitoring

---

## ✅ Checklist

- [ ] Node.js installé
- [ ] MySQL installé et fonctionnel
- [ ] `npm install` exécuté
- [ ] `node migrate.js` exécuté
- [ ] Gmail 2FA activé
- [ ] `.env` créé avec les credentials
- [ ] `npm start` lance le serveur sans erreurs
- [ ] Les emails sont reçus
- [ ] Le flux complet fonctionne

---

## 💡 Astuces

- **Utiliser Nodemon en dev:** `npm run dev` (auto-redémarrage)
- **Voir les emails en debug:** Vérifier la console du navigateur (F12)
- **Réinitialiser la BD:** `node migrate.js` (récrée les tables)
- **Voir les logs:** Vérifier la console du serveur Node.js

---

**Bon courage! 🕌 Que Allah vous aide!**

وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
