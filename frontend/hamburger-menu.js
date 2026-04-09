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
  const asideSearchInput = document.querySelector('.aside-search input');
  const notificationIcon = document.querySelector('.notification-icon');
  const profileBadge = document.querySelector('.profile-badge');

  function ensureUiStyles() {
    if (document.getElementById('fp-ui-tools-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'fp-ui-tools-style';
    style.textContent = [
      '.fp-floating-panel{position:fixed;z-index:1200;background:#fff;border:1px solid rgba(20,90,63,.2);border-radius:14px;box-shadow:0 14px 30px rgba(0,0,0,.14);min-width:290px;max-width:min(92vw,380px);max-height:60vh;overflow:auto;padding:.6rem;}',
      '.fp-floating-panel.hidden{display:none;}',
      '.fp-panel-title{font-weight:700;color:#145a3f;padding:.4rem .55rem .6rem;border-bottom:1px solid #e9f0ec;margin-bottom:.4rem;font-size:.95rem;}',
      '.fp-notif-item{display:flex;gap:.6rem;align-items:flex-start;padding:.55rem;border-radius:10px;}',
      '.fp-notif-item:hover{background:#f4faf7;}',
      '.fp-notif-dot{width:9px;height:9px;border-radius:50%;background:#1d6b4a;flex-shrink:0;margin-top:.35rem;}',
      '.fp-notif-text{font-size:.9rem;line-height:1.4;color:#1d2b24;}',
      '.fp-notif-time{font-size:.78rem;color:#7a8b82;display:block;margin-top:.1rem;}',
      '.fp-search-item{padding:.5rem .55rem;border-radius:10px;cursor:pointer;}',
      '.fp-search-item:hover{background:#f4faf7;}',
      '.fp-search-item-title{font-size:.9rem;color:#145a3f;font-weight:700;}',
      '.fp-search-item-snippet{font-size:.8rem;color:#5f7268;line-height:1.35;}',
      '.fp-no-result{padding:.65rem;font-size:.88rem;color:#6f7f77;}',
      '.fp-search-hit{outline:3px solid rgba(212,175,55,.55);outline-offset:2px;border-radius:8px;transition:outline-color .6s ease;}'
    ].join('');
    document.head.appendChild(style);
  }

  function createFloatingPanel(id) {
    let panel = document.getElementById(id);
    if (panel) {
      return panel;
    }
    panel = document.createElement('div');
    panel.id = id;
    panel.className = 'fp-floating-panel hidden';
    document.body.appendChild(panel);
    return panel;
  }

  function positionPanel(panel, anchor) {
    const rect = anchor.getBoundingClientRect();
    const top = rect.bottom + 10;
    const panelWidth = Math.min(380, Math.max(290, Math.floor(window.innerWidth * 0.92)));
    const left = Math.max(8, Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 8));
    panel.style.top = top + 'px';
    panel.style.left = left + 'px';
  }

  function closePanel(panel) {
    if (!panel) {
      return;
    }
    panel.classList.add('hidden');
  }

  function openPanel(panel) {
    panel.classList.remove('hidden');
  }

  function renderNotifications(panel) {
    const notifications = [
      { text: 'تم تحديث آية اليوم في الصفحة الرئيسية', time: 'الآن' },
      { text: 'موعد صلاة قادم خلال 25 دقيقة', time: 'قبل 5 دقائق' },
      { text: 'تمت إضافة محتوى جديد في أسماء الله الحسنى', time: 'اليوم' }
    ];

    panel.innerHTML = '<div class="fp-panel-title">الإشعارات</div>' + notifications.map(function(item) {
      return [
        '<div class="fp-notif-item">',
        '<span class="fp-notif-dot"></span>',
        '<div class="fp-notif-text">',
        item.text,
        '<span class="fp-notif-time">',
        item.time,
        '</span></div></div>'
      ].join('');
    }).join('');
  }

  function getSearchCandidates() {
    const selectors = [
      '.feature-card',
      '.aside-link',
      '.hero-title',
      '.hero-subtitle',
      '.section-title',
      '.quran-title',
      '.hadith-text'
    ];
    const nodes = document.querySelectorAll(selectors.join(','));
    return Array.from(nodes).filter(function(node) {
      const text = (node.innerText || node.textContent || '').trim();
      return text.length > 0;
    });
  }

  function clearPreviousSearchHit() {
    const old = document.querySelector('.fp-search-hit');
    if (old) {
      old.classList.remove('fp-search-hit');
    }
  }

  function toSearchableText(value) {
    return (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function buildSearchResultItem(node, query) {
    const text = (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
    const title = text.length > 70 ? text.slice(0, 70) + '...' : text;
    const idx = toSearchableText(text).indexOf(query);
    const snippetStart = Math.max(0, idx - 20);
    const snippet = text.slice(snippetStart, snippetStart + 100);
    return { node: node, title: title, snippet: snippet };
  }

  function performSearch(rawValue, triggerInput) {
    ensureUiStyles();
    const panel = createFloatingPanel('fp-search-panel');
    const query = toSearchableText(rawValue);

    if (!query) {
      closePanel(panel);
      return;
    }

    const results = getSearchCandidates()
      .filter(function(node) {
        return toSearchableText(node.innerText || node.textContent).includes(query);
      })
      .slice(0, 8)
      .map(function(node) {
        return buildSearchResultItem(node, query);
      });

    if (!results.length) {
      panel.innerHTML = '<div class="fp-panel-title">نتائج البحث</div><div class="fp-no-result">لا توجد نتائج مطابقة لـ "' + rawValue + '"</div>';
      positionPanel(panel, triggerInput || searchInput || searchIcon);
      openPanel(panel);
      return;
    }

    panel.innerHTML = '<div class="fp-panel-title">نتائج البحث</div>' + results.map(function(item, index) {
      return [
        '<div class="fp-search-item" data-idx="',
        String(index),
        '">',
        '<div class="fp-search-item-title">',
        item.title,
        '</div>',
        '<div class="fp-search-item-snippet">',
        item.snippet,
        '</div></div>'
      ].join('');
    }).join('');

    panel.querySelectorAll('.fp-search-item').forEach(function(el) {
      el.addEventListener('click', function() {
        const idx = Number(el.getAttribute('data-idx'));
        const target = results[idx] && results[idx].node;
        if (!target) {
          return;
        }
        clearPreviousSearchHit();
        target.classList.add('fp-search-hit');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function() {
          target.classList.remove('fp-search-hit');
        }, 1800);
        closePanel(panel);
      });
    });

    clearPreviousSearchHit();
    const first = results[0].node;
    first.classList.add('fp-search-hit');
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function() {
      first.classList.remove('fp-search-hit');
    }, 1800);

    positionPanel(panel, triggerInput || searchInput || searchIcon);
    openPanel(panel);
  }

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
      performSearch(searchInput.value.trim(), searchInput);
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(searchInput.value.trim(), searchInput);
      }
    });
  }

  if (asideSearchInput) {
    asideSearchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(asideSearchInput.value.trim(), asideSearchInput);
      }
    });
  }

  if (notificationIcon) {
    notificationIcon.addEventListener('click', function() {
      ensureUiStyles();
      const panel = createFloatingPanel('fp-notifications-panel');
      renderNotifications(panel);
      positionPanel(panel, notificationIcon);
      if (panel.classList.contains('hidden')) {
        openPanel(panel);
      } else {
        closePanel(panel);
      }
    });
  }

  if (profileBadge) {
    profileBadge.addEventListener('click', function() {
      alert('👤 ملف المستخدم (وضع تجريبي)');
    });
  }

  document.addEventListener('click', function(e) {
    const notifPanel = document.getElementById('fp-notifications-panel');
    const searchPanel = document.getElementById('fp-search-panel');

    if (notifPanel && !notifPanel.classList.contains('hidden') && notificationIcon && !notifPanel.contains(e.target) && !notificationIcon.contains(e.target)) {
      closePanel(notifPanel);
    }

    const searchTriggerClicked = (searchIcon && searchIcon.contains(e.target)) || (searchInput && searchInput.contains(e.target)) || (asideSearchInput && asideSearchInput.contains(e.target));
    if (searchPanel && !searchPanel.classList.contains('hidden') && !searchPanel.contains(e.target) && !searchTriggerClicked) {
      closePanel(searchPanel);
    }
  });
});

