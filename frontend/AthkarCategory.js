// =====================================================
// AthkarCategory.js - Page d'une catégorie d'athkar
// =====================================================

function toArabicNumber(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[d]).join('');
}

// Récupérer la catégorie depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('category') || 'sabah';

// Noms des catégories en arabe
const categoryNames = {
  sabah: { title: "أَذْكَارُ الصَّبَاحِ", subtitle: "أَذْكَارُ الصَّبَاحِ وَالْمَسَاءِ", hero: "أَذْكَارُ الصَّبَاحِ" },
  masa: { title: "أَذْكَارُ الْمَسَاءِ", subtitle: "أَذْكَارُ الْمَسَاءِ لِتَحْصِينِ النَّفْسِ", hero: "أَذْكَارُ الْمَسَاءِ" },
  nawm: { title: "أَذْكَارُ النَّوْمِ", subtitle: "أَذْكَارُ قَبْلَ النَّوْمِ", hero: "أَذْكَارُ النَّوْمِ" },
  food: { title: "أَذْكَارُ الطَّعَامِ", subtitle: "أَذْكَارُ قَبْلَ وَبَعْدَ الطَّعَامِ", hero: "أَذْكَارُ الطَّعَامِ" },
  masjid: { title: "أَذْكَارُ الْمَسْجِدِ", subtitle: "أَذْكَارُ دُخُولِ وَخُرُوجِ الْمَسْجِدِ", hero: "أَذْكَارُ الْمَسْجِدِ" },
  wudu: { title: "أَذْكَارُ الْوُضُوءِ", subtitle: "أَذْكَارُ الْوُضُوءِ", hero: "أَذْكَارُ الْوُضُوءِ" }
};

// Mettre à jour les titres de la page
document.getElementById('categoryTitle').innerText = categoryNames[categoryId]?.title || "الأذكار";
document.getElementById('categorySubtitle').innerText = categoryNames[categoryId]?.subtitle || "أذكار اليوم والليلة";

// Liste complète des Athkar par catégorie
const athkarByCategory = {
  sabah: [
    { id: 1, name: "دعاء الصباح", arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translation: "Nous avons commencé le matin et la royauté appartient à Allah", repetition: 1, icon: "fa-sun" },
    { id: 2, name: "اللهم بك أصبحنا", arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", translation: "Ô Allah, c'est par Toi que nous vivons le matin", repetition: 1, icon: "fa-cloud-sun" },
    { id: 3, name: "رضيت بالله ربا", arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", translation: "Je suis satisfait d'Allah comme Seigneur", repetition: 3, icon: "fa-star" },
    { id: 4, name: "حسبي الله لا إله إلا هو", arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", translation: "Allah me suffit, il n'y a de divinité que Lui", repetition: 7, icon: "fa-shield-alt" },
    { id: 5, name: "بسم الله الذي لا يضر", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", translation: "Au nom d'Allah, dont rien ne peut nuire avec Son nom", repetition: 3, icon: "fa-hand-peace" }
  ],
  masa: [
    { id: 6, name: "دعاء المساء", arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", translation: "Nous avons commencé le soir et la royauté appartient à Allah", repetition: 1, icon: "fa-moon" },
    { id: 7, name: "اللهم بك أمسينا", arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَحْيَيْنَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", translation: "Ô Allah, c'est par Toi que nous vivons le soir", repetition: 1, icon: "fa-cloud-moon" },
    { id: 8, name: "آية الكرسي", arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...", translation: "Allah! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même", repetition: 1, icon: "fa-throne" },
    { id: 9, name: "قل هو الله أحد", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "Dis: Il est Allah, Unique", repetition: 3, icon: "fa-quran" }
  ],
  nawm: [
    { id: 10, name: "دعاء النوم", arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", translation: "C'est par Ton nom, ô Allah, que je meurs et que je vis", repetition: 1, icon: "fa-bed" },
    { id: 11, name: "اللهم قني عذابك", arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", translation: "Ô Allah, protège-moi de Ton châtiment", repetition: 3, icon: "fa-shield-heart" },
    { id: 12, name: "آخر آيتين من البقرة", arabic: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ...", translation: "Le Messager a cru en ce qu'on a fait descendre vers lui", repetition: 1, icon: "fa-book" }
  ],
  food: [
    { id: 13, name: "دعاء قبل الأكل", arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ", translation: "Ô Allah, bénis ce que Tu nous as attribué", repetition: 1, icon: "fa-utensils" },
    { id: 14, name: "دعاء بعد الأكل", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ", translation: "Louange à Allah qui nous a nourris", repetition: 1, icon: "fa-thumbs-up" },
    { id: 15, name: "بسم الله في أوله وآخره", arabic: "بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ", translation: "Au nom d'Allah au début et à la fin", repetition: 1, icon: "fa-hand-sparkles" }
  ],
  masjid: [
    { id: 16, name: "دخول المسجد", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", translation: "Ô Allah, ouvre-moi les portes de Ta miséricorde", repetition: 1, icon: "fa-mosque" },
    { id: 17, name: "الخروج من المسجد", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِن فَضْلِكَ", translation: "Ô Allah, je Te demande de Ta grâce", repetition: 1, icon: "fa-door-open" }
  ],
  wudu: [
    { id: 18, name: "قبل الوضوء", arabic: "بِسْمِ اللَّهِ", translation: "Au nom d'Allah", repetition: 1, icon: "fa-tint" },
    { id: 19, name: "بعد الوضوء", arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", translation: "J'atteste qu'il n'y a de divinité qu'Allah", repetition: 1, icon: "fa-hands-bubbles" },
    { id: 20, name: "دعاء الوضوء", arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ", translation: "Ô Allah, fais-moi être parmi ceux qui se repentent", repetition: 1, icon: "fa-water" }
  ]
};

const currentAthkar = athkarByCategory[categoryId] || athkarByCategory.sabah;

// Mettre à jour le compteur
document.getElementById('athkarCount').innerText = toArabicNumber(currentAthkar.length) + ' ذِكْرًا';

// Stockage des compteurs individuels
let individualCounters = {};

function loadCounters() {
  const saved = localStorage.getItem('athkarCounters');
  if (saved) {
    individualCounters = JSON.parse(saved);
  }
  currentAthkar.forEach(dhikr => {
    if (individualCounters[dhikr.id] === undefined) {
      individualCounters[dhikr.id] = 0;
    }
  });
}

function saveCounters() {
  localStorage.setItem('athkarCounters', JSON.stringify(individualCounters));
}

// Render les athkar
const grid = document.getElementById('athkarGrid');
const searchInput = document.getElementById('searchInputFilter');
let searchTerm = '';

function renderAthkar() {
  const filtered = currentAthkar.filter(dhikr => {
    const matchesSearch = dhikr.name.includes(searchTerm) || 
                           dhikr.arabic.includes(searchTerm) ||
                           dhikr.translation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><i class="fas fa-book-open" style="font-size:2rem;"></i><p>لا توجد أذكار</p></div>`;
    return;
  }

  let html = '';
  filtered.forEach(dhikr => {
    const counterValue = individualCounters[dhikr.id] || 0;
    html += `
      <div class="athkar-card">
        <div class="athkar-header">
          <div class="athkar-icon">
            <i class="fas ${dhikr.icon}"></i>
          </div>
          <div class="athkar-title">
            <div class="athkar-category">
              <i class="fas fa-tag"></i>
              <span>${categoryNames[categoryId]?.title || "ذكر"}</span>
            </div>
          </div>
        </div>
        
        <div class="dhikr-content">
          <div class="dhikr-arabic">${dhikr.arabic}</div>
          <div class="dhikr-translation">${dhikr.translation}</div>
        </div>
        
        <div class="dhikr-repetition">
          <span><i class="fas fa-repeat"></i> التكرار: ${toArabicNumber(dhikr.repetition)} مرات</span>
          <span><i class="fas fa-${dhikr.repetition > 1 ? 'star' : 'check'}"></i> سنة مؤكدة</span>
        </div>
        
        <div class="dhikr-counter-section">
          <div class="dhikr-counter">
            <button class="dhikr-count-btn" data-action="minus" data-id="${dhikr.id}">
              <i class="fas fa-minus"></i>
            </button>
            <span class="dhikr-count-display" data-id="${dhikr.id}">${toArabicNumber(counterValue)}</span>
            <button class="dhikr-count-btn" data-action="plus" data-id="${dhikr.id}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <button class="dhikr-reset-btn" data-action="reset" data-id="${dhikr.id}">
            <i class="fas fa-undo-alt"></i> إعادة
          </button>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;

  // Attacher les événements
  document.querySelectorAll('.dhikr-count-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const action = this.dataset.action;
      const id = parseInt(this.dataset.id);
      const displaySpan = document.querySelector(`.dhikr-count-display[data-id="${id}"]`);
      
      if (action === 'plus') {
        individualCounters[id] = (individualCounters[id] || 0) + 1;
        saveCounters();
        if (displaySpan) displaySpan.textContent = toArabicNumber(individualCounters[id]);
      } else if (action === 'minus') {
        individualCounters[id] = Math.max(0, (individualCounters[id] || 0) - 1);
        saveCounters();
        if (displaySpan) displaySpan.textContent = toArabicNumber(individualCounters[id]);
      }
    });
  });

  document.querySelectorAll('.dhikr-reset-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      const displaySpan = document.querySelector(`.dhikr-count-display[data-id="${id}"]`);
      individualCounters[id] = 0;
      saveCounters();
      if (displaySpan) displaySpan.textContent = toArabicNumber(0);
    });
  });
}

// Search
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderAthkar();
  });
}

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

// Initialisation
loadCounters();
renderAthkar();
if (personalDisplay && personalDisplay.textContent === '٠') {
  personalDisplay.textContent = toArabicNumber(personalCount);
}