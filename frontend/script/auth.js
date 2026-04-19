// auth.js — Gestion dynamique de l'authentification et du menu utilisateur
// Usage : inclure ce fichier sur toutes les pages après le HTML du menu/nav


function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('faithpathCurrentUser'));
  } catch {
    return null;
  }
}

function updateNavbar(user) {
  // Cible les éléments du menu (adapter les IDs/classes selon votre HTML)
  const navUser = document.getElementById('navUser');
  const navAuthBtn = document.getElementById('navAuthBtn');

  if (!navUser || !navAuthBtn) return;

  if (user && user.fullName && user.username) {
    navUser.textContent = user.fullName;
    navUser.style.display = '';
    navUser.href = `profile.html?username=${encodeURIComponent(user.username)}`;
    navUser.onclick = null;
    navAuthBtn.textContent = 'Déconnexion';
    navAuthBtn.onclick = logout;
  } else {
    navUser.textContent = '';
    navUser.style.display = 'none';
    navUser.removeAttribute('href');
    navUser.onclick = null;
    navAuthBtn.textContent = 'Se connecter';
    navAuthBtn.onclick = function () {
      window.location.href = 'start.html';
    };
  }
}

function logout() {
  localStorage.removeItem('faithpathCurrentUser');
  location.reload();
}

// Appel automatique après chargement de la navbar
if (typeof updateNavbar === 'function') {
  updateNavbar(getCurrentUser());
}
