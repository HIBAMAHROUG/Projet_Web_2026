/**
 * Hamburger Menu Toggle Script
 * Compatible with RTL (Arabic) and LTR layouts
 */

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle') || document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu') || document.getElementById('asideNav');
  let navOverlay = document.getElementById('navOverlay') || document.getElementById('asideOverlay');

  if (!menuToggle || !navMenu) {
    console.warn('Menu toggle or nav menu elements not found');
    return;
  }

  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.id = 'navOverlay';
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  const hasBurgerSpans = menuToggle.querySelectorAll('span').length >= 3;
  if (!hasBurgerSpans) {
    menuToggle.textContent = '☰';
  }

  const closeAsideBtn = document.getElementById('closeAsideBtn');

  const searchIcon = document.querySelector('.search-icon');
  const searchInput = document.querySelector('.search-input');
  const notificationIcon = document.querySelector('.notification-icon');
  const profileBadge = document.querySelector('.profile-badge');

  const openMenu = function() {
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    if (!hasBurgerSpans) {
      menuToggle.textContent = '✕';
    }
  };

  const closeMenu = function() {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    if (!hasBurgerSpans) {
      menuToggle.textContent = '☰';
    }
  };

  const toggleMenu = function() {
    if (navMenu.classList.contains('active')) {
      closeMenu();
      return;
    }
    openMenu();
  };

  // Toggle menu on click
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking on a link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);
  if (closeAsideBtn) {
    closeAsideBtn.addEventListener('click', closeMenu);
  }

  // Close menu on window resize (desktop view)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  });

  if (searchIcon && searchInput) {
    searchIcon.addEventListener('click', function() {
      const value = searchInput.value.trim();
      alert(value ? 'Recherche: ' + value : 'اكتب كلمة للبحث');
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = searchInput.value.trim();
        alert(value ? 'Recherche: ' + value : 'اكتب كلمة للبحث');
      }
    });
  }

  if (notificationIcon) {
    notificationIcon.addEventListener('click', function() {
      alert('🔔 لديك 3 إشعارات تجريبية جديدة');
    });
  }

  if (profileBadge) {
    profileBadge.addEventListener('click', function() {
      alert('👤 ملف المستخدم (وضع تجريبي)');
    });
  }
});

