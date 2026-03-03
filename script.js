
const surahList = [
  { id: 1, name: "الفاتحة", translit: "Al-Fātiḥah", verses: 7, type: "مكية", arabicAyah: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", translation: "Praise be to Allah, Lord of the worlds" },
  { id: 2, name: "البقرة", translit: "Al-Baqarah", verses: 286, type: "مدنية", arabicAyah: "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ", translation: "This is the Book about which there is no doubt, a guidance for the righteous" },
  { id: 3, name: "آل عمران", translit: "Āl 'Imrān", verses: 200, type: "مدنية", arabicAyah: "شَهِدَ ٱللَّهُ أَنَّهُۥ لَآ إِلَٰهَ إِلَّا هُوَ", translation: "Allah witnesses that there is no deity except Him" },
  { id: 4, name: "النساء", translit: "An-Nisā", verses: 176, type: "مدنية", arabicAyah: "يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمُ", translation: "O mankind, fear your Lord" },
  { id: 5, name: "المائدة", translit: "Al-Mā'idah", verses: 120, type: "مدنية", arabicAyah: "ٱلْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ", translation: "This day I have perfected for you your religion" },
  { id: 6, name: "الأنعام", translit: "Al-An'ām", verses: 165, type: "مكية", arabicAyah: "وَلَا تَزِرُ وَازِرَةٌۭ وِزْرَ أُخْرَىٰ", translation: "And no bearer of burdens will bear the burden of another" },
  { id: 7, name: "الأعراف", translit: "Al-A'rāf", verses: 206, type: "مكية", arabicAyah: "إِنَّ رَبَّكُمُ ٱللَّهُ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ", translation: "Indeed your Lord is Allah, who created the heavens and the earth" },
  { id: 8, name: "الأنفال", translit: "Al-Anfāl", verses: 75, type: "مدنية", arabicAyah: "يَسْـَٔلُونَكَ عَنِ ٱلْأَنفَالِ", translation: "They ask you about the bounties" },
  { id: 9, name: "التوبة", translit: "At-Tawbah", verses: 129, type: "مدنية", arabicAyah: "بَرَآءَةٌۭ مِّنَ ٱللَّهِ وَرَسُولِهِۦٓ", translation: "Disassociation from Allah and His Messenger" },
  { id: 10, name: "يونس", translit: "Yūnus", verses: 109, type: "مكية", arabicAyah: "ٱلر ۚ تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ٱلْحَكِيمِ", translation: "Alif Lām Rā. These are the verses of the wise Book" },
  { id: 11, name: "هود", translit: "Hūd", verses: 123, type: "مكية", arabicAyah: "أَلَّا تَعْبُدُوٓا۟ إِلَّا ٱللَّهَ", translation: "That you not worship except Allah" },
  { id: 12, name: "يوسف", translit: "Yūsuf", verses: 111, type: "مكية", arabicAyah: "لَّقَدْ كَانَ فِى يُوسُفَ وَإِخْوَتِهِۦٓ ءَايَٰتٌۭ لِّلسَّآئِلِينَ", translation: "There were certainly in Joseph and his brothers signs for those who ask" },
  { id: 13, name: "الرعد", translit: "Ar-Ra'd", verses: 43, type: "مدنية", arabicAyah: "ٱللَّهُ ٱلَّذِى رَفَعَ ٱلسَّمَٰوَٰتِ بِغَيْرِ عَمَدٍۢ تَرَوْنَهَا", translation: "It is Allah who erected the heavens without pillars that you see" },
  { id: 14, name: "إبراهيم", translit: "Ibrāhīm", verses: 52, type: "مكية", arabicAyah: "رَبِّ ٱجْعَلْ هَٰذَا ٱلْبَلَدَ ءَامِنًۭا", translation: "My Lord, make this city secure" },
  { id: 15, name: "يس", translit: "Yā Sīn", verses: 83, type: "مكية", arabicAyah: "إِنَّمَآ أَمْرُهُۥٓ إِذَآ أَرَادَ شَيْـًٔا أَن يَقُولَ لَهُۥ كُن فَيَكُونُ", translation: "His command is only when He intends a thing that He says 'Be' and it is" },
  { id: 16, name: "الرحمن", translit: "Ar-Raḥmān", verses: 78, type: "مدنية", arabicAyah: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ", translation: "So which of the favors of your Lord would you deny?" },
  { id: 17, name: "الملك", translit: "Al-Mulk", verses: 30, type: "مكية", arabicAyah: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ", translation: "Blessed is He in whose hand is the dominion" },
  { id: 18, name: "الكهف", translit: "Al-Kahf", verses: 110, type: "مكية", arabicAyah: "إِنَّا جَعَلْنَا مَا عَلَى ٱلْأَرْضِ زِينَةًۭ لَّهَا", translation: "We have made that on the earth an adornment for it" },
  { id: 19, name: "الإخلاص", translit: "Al-Ikhlāṣ", verses: 4, type: "مكية", arabicAyah: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", translation: "Say, 'He is Allah, [who is] One'" },
  { id: 20, name: "الفلق", translit: "Al-Falaq", verses: 5, type: "مكية", arabicAyah: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "And from the evil of an envier when he envies" },
  { id: 21, name: "الناس", translit: "An-Nās", verses: 6, type: "مكية", arabicAyah: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", translation: "From among the jinn and mankind" }
];


document.getElementById('souarCount').innerText = surahList.length + ' سورة';


const grid = document.getElementById('surahGrid');
const searchInput = document.getElementById('searchInput');
const filterTypeContainer = document.getElementById('filterTypeContainer');
let currentType = 'all';
let searchTerm = '';


function renderSouar() {
  const filtered = surahList.filter(s => {
    const matchesType = currentType === 'all' || s.type === currentType;
    const matchesSearch = s.name.includes(searchTerm) || 
                           s.translit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.id.toString().includes(searchTerm);
    return matchesType && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><i class="fas fa-book-open" style="font-size:2rem;"></i><p>No surah found</p></div>`;
    return;
  }

  let html = '';
  filtered.forEach(s => {
    html += `
      <div class="surah-card" data-id="${s.id}">
        <div class="surah-header">
          <span class="surah-number">${s.id}</span>
          <div style="flex:1;">
            <div class="surah-name">${s.name}</div>
            <div class="surah-translit">${s.translit}</div>
          </div>
        </div>
        <div class="ayah-preview">
          <div class="ayah-arabic">${s.arabicAyah}</div>
          <div class="ayah-translation">${s.translation}</div>
        </div>
        <div class="surah-meta">
          <span class="meta-item"><i class="fas fa-book-open"></i> ${s.verses} آيات</span>
          <span class="meta-item"><i class="fas fa-moon"></i> ${s.type}</span>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;

  
  document.querySelectorAll('.surah-card').forEach(card => {
    card.addEventListener('click', function() {
      this.style.backgroundColor = 'var(--emerald-100)';
      setTimeout(() => this.style.backgroundColor = '', 200);
    });
  });
}


searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderSouar();
});


filterTypeContainer.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    filterTypeContainer.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentType = this.dataset.type;
    renderSouar();
  });
});


let tasbihCount = 0;
const tasbihDisplay = document.getElementById('tasbihDisplay');
const tasbihPlus = document.getElementById('tasbihPlus');
const tasbihMinus = document.getElementById('tasbihMinus');
const tasbihReset = document.getElementById('tasbihReset');

function updateTasbih(value) {
  if (value < 0) value = 0;
  tasbihCount = value;
  tasbihDisplay.textContent = tasbihCount;
}

tasbihPlus.addEventListener('click', () => updateTasbih(tasbihCount + 1));
tasbihMinus.addEventListener('click', () => updateTasbih(tasbihCount - 1));
tasbihReset.addEventListener('click', () => updateTasbih(0));


renderSouar();