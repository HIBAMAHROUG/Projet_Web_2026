
function toArabicNumber(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[d]).join('');
}


const sahabaList = [
  // العشرة المبشرون بالجنة
  { id: 1, name: "أَبُو بَكْرٍ الصِّدِّيق", nickname: "عبد الله بن عثمان", title: "الصديق - أول الخلفاء الراشدين", category: ["ashara", "muhajirun", "badr"], bio: "أول من آمن من الرجال، وأحب الناس إلى رسول الله ﷺ، رفيقه في الهجرة، وأول الخلفاء الراشدين.", birthYear: "50 ق.هـ", deathYear: "13 هـ", age: "63", virtues: "أول من أسلم من الرجال، رفيق النبي في الغار، حنّان عليه السلام" },
  { id: 2, name: "عُمَرُ بْنُ الْخَطَّاب", nickname: "أبو حفص", title: "الفاروق - ثاني الخلفاء الراشدين", category: ["ashara", "muhajirun", "badr"], bio: "أحد العشرة المبشرين بالجنة، ثاني الخلفاء الراشدين، لقب بالفاروق لأنه فرق بين الحق والباطل.", birthYear: "40 ق.هـ", deathYear: "23 هـ", age: "63", virtues: "كان الإسلام يعز بعمر، من أعظم الصحابة فتحاً" },
  { id: 3, name: "عُثْمَانُ بْنُ عَفَّان", nickname: "أبو عمرو", title: "ذو النورين - ثالث الخلفاء الراشدين", category: ["ashara", "muhajirun"], bio: "أحد العشرة المبشرين بالجنة، ثالث الخلفاء الراشدين، لقب بذي النورين لأنه تزوج ابنتي رسول الله ﷺ.", birthYear: "47 ق.هـ", deathYear: "35 هـ", age: "82", virtues: "جمع القرآن في مصحف واحد، كان حيياً كريماً" },
  { id: 4, name: "عَلِيُّ بْنُ أَبِي طَالِب", nickname: "أبو الحسن", title: "أمير المؤمنين - رابع الخلفاء الراشدين", category: ["ashara", "muhajirun", "badr"], bio: "ابن عم رسول الله ﷺ وزوج ابنته فاطمة الزهراء، رابع الخلفاء الراشدين، وأحد العشرة المبشرين بالجنة.", birthYear: "23 ق.هـ", deathYear: "40 هـ", age: "63", virtues: "باب مدينة العلم، كان شجاعاً عالماً" },
  { id: 5, name: "طَلْحَةُ بْنُ عُبَيْدِ اللَّهِ", nickname: "أبو محمد", title: "طلحة الخير - طلحة الفياض", category: ["ashara", "muhajirun", "badr"], bio: "أحد العشرة المبشرين بالجنة، ومن السابقين الأولين إلى الإسلام، كان سخياً كريماً.", birthYear: "28 ق.هـ", deathYear: "36 هـ", age: "64", virtues: "كان يسمى طلحة الفياض لكرمه" },
  { id: 6, name: "الزُّبَيْرُ بْنُ الْعَوَّام", nickname: "أبو عبد الله", title: "حواري رسول الله", category: ["ashara", "muhajirun", "badr"], bio: "أحد العشرة المبشرين بالجنة، حواري رسول الله ﷺ، أول من سل سيفه في الإسلام.", birthYear: "28 ق.هـ", deathYear: "36 هـ", age: "64", virtues: "كان أول من سل سيفه في سبيل الله" },
  { id: 7, name: "عَبْدُ الرَّحْمَنِ بْنُ عَوْف", nickname: "أبو محمد", title: "أغنى الصحابة", category: ["ashara", "muhajirun", "badr"], bio: "أحد العشرة المبشرين بالجنة، كان من أغنياء الصحابة وأنفق ماله كله في سبيل الله.", birthYear: "43 ق.هـ", deathYear: "32 هـ", age: "75", virtues: "كان تاجراً كريماً أنفق ماله في سبيل الله" },
  { id: 8, name: "سَعْدُ بْنُ أَبِي وَقَّاص", nickname: "أبو إسحاق", title: "فاتح العراق", category: ["ashara", "muhajirun", "badr"], bio: "أحد العشرة المبشرين بالجنة، قائد جيش المسلمين في معركة القادسية، فاتح العراق.", birthYear: "23 ق.هـ", deathYear: "55 هـ", age: "78", virtues: "من الرماة المشهورين، استجاب دعوته النبي ﷺ" },
  { id: 9, name: "سَعِيدُ بْنُ زَيْدٍ", nickname: "أبو الأعور", title: "أحد العشرة", category: ["ashara", "muhajirun", "badr"], bio: "أحد العشرة المبشرين بالجنة، أسلم قديماً قبل دخول النبي دار الأرقم.", birthYear: "26 ق.هـ", deathYear: "51 هـ", age: "77", virtues: "من السابقين إلى الإسلام" },
  { id: 10, name: "أَبُو عُبَيْدَةَ بْنُ الْجَرَّاح", nickname: "عامر بن عبد الله", title: "أمين الأمة", category: ["ashara", "muhajirun", "badr"], bio: "أحد العشرة المبشرين بالجنة، لقبه رسول الله ﷺ بأمين الأمة.", birthYear: "40 ق.هـ", deathYear: "18 هـ", age: "58", virtues: "أمين هذه الأمة" },
  
  // من الأنصار
  { id: 11, name: "سَعْدُ بْنُ مُعَاذٍ", nickname: "أبو عمرو", title: "سيد الأوس", category: ["ansar", "badr"], bio: "سيد الأوس، اهتز لموته عرش الرحمن، حكم في بني قريظة بحكم الله.", birthYear: "قبل الهجرة", deathYear: "5 هـ", age: "37", virtues: "اهتز عرش الرحمن لموته" },
  { id: 12, name: "مُصْعَبُ بْنُ عُمَيْر", nickname: "أبو عبد الله", title: "أول سفير في الإسلام", category: ["muhajirun", "badr"], bio: "أول من هاجر إلى المدينة، كان جميلاً وسيماً، استشهد في غزوة أحد.", birthYear: "قبل البعثة", deathYear: "3 هـ", age: "40", virtues: "أول سفير في الإسلام، استشهد في أحد" },
  { id: 13, name: "بِلَالُ بْنُ رَبَاح", nickname: "أبو عبد الله", title: "مؤذن الرسول ﷺ", category: ["muhajirun"], bio: "مؤذن رسول الله ﷺ، كان من العبيد الذين عذبوا في الله ثم اشتراهم أبو بكر الصديق.", birthYear: "53 ق.هـ", deathYear: "20 هـ", age: "73", virtues: "أذن في الكعبة بعد فتح مكة" },
  { id: 14, name: "خَالِدُ بْنُ الْوَلِيد", nickname: "أبو سليمان", title: "سيف الله المسلول", category: ["muhajirun"], bio: "قائد عسكري مسلم، لقب بسيف الله المسلول، لم يهزم في معركة قط.", birthYear: "30 ق.هـ", deathYear: "21 هـ", age: "51", virtues: "سيف الله المسلول، فاتح الشام" },
  { id: 15, name: "أَبُو هُرَيْرَةَ", nickname: "عبد الرحمن بن صخر", title: "حافظ الأمة", category: ["muhajirun"], bio: "أكثر الصحابة رواية للحديث النبوي، لزم النبي ﷺ ولازمه.", birthYear: "19 ق.هـ", deathYear: "59 هـ", age: "78", virtues: "أكثر الصحابة رواية للحديث" },
  { id: 16, name: "عَبْدُ اللَّهِ بْنُ عُمَرَ", nickname: "أبو عبد الرحمن", title: "فقيه الصحابة", category: ["muhajirun"], bio: "ابن عمر بن الخطاب، من أكثر الصحابة علماً وعبادة.", birthYear: "3 ق.هـ", deathYear: "73 هـ", age: "76", virtues: "كان شديد الاتباع للسنة" }
];

// Mettre à jour le compteur
document.getElementById('sahabaCount').innerText = toArabicNumber(sahabaList.length) + ' صَحَابِيًّا';

// DOM Elements
const grid = document.getElementById('sahabaGrid');
const searchInput = document.getElementById('searchInput');
const filterCategoryContainer = document.getElementById('filterCategoryContainer');
let currentCategory = 'all';
let searchTerm = '';

// Fonction pour obtenir l'icône selon le statut
function getSahabaIcon(sahaba) {
  if (sahaba.category.includes('ashara')) return 'fa-crown';
  if (sahaba.category.includes('badr')) return 'fa-star-of-life';
  return 'fa-user-tie';
}

// Fonction pour obtenir le nom de la catégorie en arabe
function getCategoryName(catId) {
  const names = {
    ashara: 'العشرة المبشرون',
    badr: 'أهل بدر',
    muhajirun: 'المهاجرون',
    ansar: 'الأنصار'
  };
  return names[catId] || catId;
}

// Modal functions
const modal = document.getElementById('sahabaModal');

function openModal(sahaba) {
  const modalContent = document.getElementById('modalContent');
  let badgesHtml = '';
  sahaba.category.forEach(cat => {
    badgesHtml += `<span class="category-badge"><i class="fas fa-tag"></i> ${getCategoryName(cat)}</span>`;
  });
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <div class="modal-avatar">
        <i class="fas ${getSahabaIcon(sahaba)}"></i>
      </div>
      <div class="modal-name">${sahaba.name}</div>
      <div class="modal-title">${sahaba.title}</div>
      <div class="modal-title" style="color: var(--bronze-400); font-size: 0.9rem;">${sahaba.nickname}</div>
    </div>
    <div class="modal-section">
      <h4><i class="fas fa-user"></i> نبذة عن الصحابي</h4>
      <p>${sahaba.bio}</p>
    </div>
    <div class="modal-section">
      <h4><i class="fas fa-calendar-alt"></i> معلومات شخصية</h4>
      <p><strong>الميلاد:</strong> ${sahaba.birthYear} &nbsp;|&nbsp; <strong>الوفاة:</strong> ${sahaba.deathYear} &nbsp;|&nbsp; <strong>العمر:</strong> ${toArabicNumber(parseInt(sahaba.age))} سنة</p>
    </div>
    <div class="modal-section">
      <h4><i class="fas fa-star"></i> مناقبه وفضائله</h4>
      <p>${sahaba.virtues}</p>
    </div>
    <div class="modal-badges">
      ${badgesHtml}
    </div>
  `;
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

// Render cards
function renderSahaba() {
  const filtered = sahabaList.filter(s => {
    const matchesCategory = currentCategory === 'all' || s.category.includes(currentCategory);
    const matchesSearch = s.name.includes(searchTerm) || 
                           s.nickname.includes(searchTerm) ||
                           s.title.includes(searchTerm) ||
                           s.bio.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><i class="fas fa-users-slash" style="font-size:2rem;"></i><p>لا توجد نتائج</p></div>`;
    return;
  }

  let html = '';
  filtered.forEach(s => {
    let badgesHtml = '';
    s.category.slice(0, 2).forEach(cat => {
      badgesHtml += `<span class="category-badge"><i class="fas fa-tag"></i> ${getCategoryName(cat)}</span>`;
    });
    
    html += `
      <div class="sahaba-card" data-id="${s.id}">
        <div class="sahaba-header">
          <div class="sahaba-avatar">
            <i class="fas ${getSahabaIcon(s)}"></i>
          </div>
          <div class="sahaba-info">
            <div class="sahaba-name">${s.name}</div>
            <div class="sahaba-title"><i class="fas fa-medal"></i> ${s.title}</div>
          </div>
        </div>
        
        <div class="sahaba-bio">
          ${s.bio.length > 100 ? s.bio.substring(0, 100) + '...' : s.bio}
        </div>
        
        <div class="sahaba-stats">
          <span><i class="fas fa-calendar-alt"></i> ${s.birthYear} - ${s.deathYear}</span>
          <span><i class="fas fa-heart"></i> ${s.virtues.substring(0, 30)}...</span>
        </div>
        
        <div class="sahaba-categories">
          ${badgesHtml}
          ${s.category.length > 2 ? `<span class="category-badge"><i class="fas fa-plus"></i> +${s.category.length - 2}</span>` : ''}
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;

  // Add click event to cards
  document.querySelectorAll('.sahaba-card').forEach(card => {
    card.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      const sahaba = sahabaList.find(s => s.id === id);
      if (sahaba) {
        openModal(sahaba);
      }
    });
  });
}

// Search input listener
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderSahaba();
  });
}

// Filter category listeners
if (filterCategoryContainer) {
  filterCategoryContainer.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      filterCategoryContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.category;
      renderSahaba();
    });
  });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

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

// Initial render
renderSahaba();

// Add modal to body if not exists
if (!document.getElementById('sahabaModal')) {
  const modalDiv = document.createElement('div');
  modalDiv.id = 'sahabaModal';
  modalDiv.className = 'modal';
  modalDiv.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      <div id="modalContent"></div>
    </div>
  `;
  document.body.appendChild(modalDiv);
}

// Make closeModal available globally
window.closeModal = closeModal;