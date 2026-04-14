// =====================================================================
// Athkar.js  –  Page principale : affichage des catégories + compteur
// =====================================================================

/* ── Utilitaire : convertit un nombre en chiffres arabes ── */
function toArabicNumber(num) {
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return num.toString().split('').map(d => arabicDigits[d] ?? d).join('');
}

/* ── Liste des catégories ─────────────────────────────────────── */
const categories = [
  {
    id:    "sabah",
    name:  "أَذْكَارُ الصَّبَاحِ",
    icon:  "fa-sun",
    desc:  "أذكار الصباح حصن المسلم",
    count: 5
  },
  {
    id:    "masa",
    name:  "أَذْكَارُ الْمَسَاءِ",
    icon:  "fa-moon",
    desc:  "أذكار المساء لتحصين النفس",
    count: 4
  },
  {
    id:    "nawm",
    name:  "أَذْكَارُ النَّوْمِ",
    icon:  "fa-bed",
    desc:  "أذكار قبل النوم",
    count: 3
  },
  {
    id:    "food",
    name:  "أَذْكَارُ الطَّعَامِ",
    icon:  "fa-utensils",
    desc:  "أذكار قبل وبعد الأكل",
    count: 3
  },
  {
    id:    "masjid",
    name:  "أَذْكَارُ الْمَسْجِدِ",
    icon:  "fa-mosque",
    desc:  "أذكار دخول وخروج المسجد",
    count: 2
  },
  {
    id:    "wudu",
    name:  "أَذْكَارُ الْوُضُوءِ",
    icon:  "fa-tint",
    desc:  "أذكار الوضوء",
    count: 3
  }
];

/* ── Afficher le nombre de catégories ────────────────────────── */
const categoriesCountEl = document.getElementById('categoriesCount');
if (categoriesCountEl) {
  categoriesCountEl.textContent = toArabicNumber(categories.length) + ' أَقْسَامٍ';
}

/* ── Générer les cartes des catégories ───────────────────────── */
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  grid.innerHTML = categories.map(cat => `
    <a href="AthkarCategory.html?category=${cat.id}" class="category-card">
      <div class="category-icon">
        <i class="fas ${cat.icon}"></i>
      </div>
      <h3>${cat.name}</h3>
      <div class="category-desc">${cat.desc}</div>
      <div class="category-count">${toArabicNumber(cat.count)} أذكار</div>
    </a>
  `).join('');
}

renderCategories();

/* ══════════════════════════════════════════════════════════════
   COMPTEUR PERSONNEL
   ══════════════════════════════════════════════════════════════ */
let personalCount = parseInt(localStorage.getItem('personalCounter') || '0');

const personalDisplay = document.getElementById('personalCounter');
const counterPlus     = document.getElementById('counterPlus');
const counterMinus    = document.getElementById('counterMinus');
const counterReset    = document.getElementById('counterReset');

function updatePersonalCounter(value) {
  personalCount = Math.max(0, value);
  if (personalDisplay) personalDisplay.textContent = toArabicNumber(personalCount);
  localStorage.setItem('personalCounter', personalCount);
}

/* Afficher la valeur sauvegardée au chargement */
if (personalDisplay) personalDisplay.textContent = toArabicNumber(personalCount);

if (counterPlus)  counterPlus.addEventListener('click',  () => updatePersonalCounter(personalCount + 1));
if (counterMinus) counterMinus.addEventListener('click', () => updatePersonalCounter(personalCount - 1));
if (counterReset) counterReset.addEventListener('click', () => updatePersonalCounter(0));

document.querySelectorAll('.preset-preset').forEach(btn => {
  btn.addEventListener('click', () => updatePersonalCounter(parseInt(btn.dataset.value)));
});

/* ══════════════════════════════════════════════════════════════
   MENU LATÉRAL
   ══════════════════════════════════════════════════════════════ */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu      = document.getElementById('navMenu');
const navOverlay   = document.getElementById('navOverlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');

function openMenu() {
  navMenu?.classList.add('active');
  navOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navMenu?.classList.remove('active');
  navOverlay?.classList.remove('active');
  document.body.style.overflow = '';
}

hamburgerBtn?.addEventListener('click', openMenu);
navOverlay?.addEventListener('click', closeMenu);
closeMenuBtn?.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-menu a').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });