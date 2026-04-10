// =====================================================
// Athkar.js - Page principale avec les catégories
// =====================================================

function toArabicNumber(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[d]).join('');
}

// Liste des catégories
const categories = [
  { id: "sabah", name: "أَذْكَارُ الصَّبَاحِ", nameEn: "sabah", icon: "fa-sun", desc: "أذكار الصباح حصن المسلم", count: 5 },
  { id: "masa", name: "أَذْكَارُ الْمَسَاءِ", nameEn: "masa", icon: "fa-moon", desc: "أذكار المساء لتحصين النفس", count: 4 },
  { id: "nawm", name: "أَذْكَارُ النَّوْمِ", nameEn: "nawm", icon: "fa-bed", desc: "أذكار قبل النوم", count: 3 },
  { id: "food", name: "أَذْكَارُ الطَّعَامِ", nameEn: "food", icon: "fa-utensils", desc: "أذكار قبل وبعد الأكل", count: 3 },
  { id: "masjid", name: "أَذْكَارُ الْمَسْجِدِ", nameEn: "masjid", icon: "fa-mosque", desc: "أذكار دخول وخروج المسجد", count: 2 },
  { id: "wudu", name: "أَذْكَارُ الْوُضُوءِ", nameEn: "wudu", icon: "fa-tint", desc: "أذكار الوضوء", count: 3 }
];

// Afficher le nombre de catégories
document.getElementById('categoriesCount').innerText = toArabicNumber(categories.length) + ' أَقْسَامٍ';

// Générer les cartes des catégories
const categoriesGrid = document.getElementById('categoriesGrid');

function renderCategories() {
  let html = '';
  categories.forEach(cat => {
    html += `
      <a href="AthkarCategory.html?category=${cat.id}" class="category-card">
        <div class="category-icon">
          <i class="fas ${cat.icon}"></i>
        </div>
        <h3>${cat.name}</h3>
        <div class="category-desc">${cat.desc}</div>
        <div class="category-count">${toArabicNumber(cat.count)} أذكار</div>
      </a>
    `;
  });
  categoriesGrid.innerHTML = html;
}

renderCategories();

// =====================================================
// Personal Counter
// =====================================================
let personalCount = 0;
const personalDisplay = document.getElementById('personalCounter');
const counterPlus = document.getElementById('counterPlus');
const counterMinus = document.getElementById('counterMinus');
const counterReset = document.getElementById('counterReset');
const presetPresets = document.querySelectorAll('.preset-preset');

const savedPersonal = localStorage.getItem('personalCounter');
if (savedPersonal) {
  personalCount = parseInt(savedPersonal);
  if (personalDisplay) personalDisplay.textContent = toArabicNumber(personalCount);
}

function updatePersonalCounter(value) {
  if (value < 0) value = 0;
  personalCount = value;
  if (personalDisplay) personalDisplay.textContent = toArabicNumber(personalCount);
  localStorage.setItem('personalCounter', personalCount);
}

if (counterPlus) counterPlus.addEventListener('click', () => updatePersonalCounter(personalCount + 1));
if (counterMinus) counterMinus.addEventListener('click', () => updatePersonalCounter(personalCount - 1));
if (counterReset) counterReset.addEventListener('click', () => updatePersonalCounter(0));

presetPresets.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = parseInt(btn.dataset.value);
    updatePersonalCounter(value);
  });
});

if (personalDisplay && personalDisplay.textContent === '٠') {
  personalDisplay.textContent = toArabicNumber(personalCount);
}