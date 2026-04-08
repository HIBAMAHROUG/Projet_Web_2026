
const surahList = [
  { id: 1, name: "الفاتحة", translit: "Al-Fātiḥah", verses: 7, type: "مكية", arabicAyah: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", translation: "الحمد لله رب العالمين", audioUrl: "audio/1" },
  { id: 2, name: "البقرة", translit: "Al-Baqarah", verses: 286, type: "مدنية", arabicAyah: "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ", translation: "ذلك الكتاب لا ريب فيه هدى للمتقين", audioUrl: "audio/002.mp3" },
  { id: 3, name: "آل عمران", translit: "Āl 'Imrān", verses: 200, type: "مدنية", arabicAyah: "شَهِدَ ٱللَّهُ أَنَّهُۥ لَآ إِلَٰهَ إِلَّا هُوَ", translation: "شهد الله أنه لا إله إلا هو", audioUrl: "audio/3.mp3" },
  { id: 4, name: "النساء", translit: "An-Nisā", verses: 176, type: "مدنية", arabicAyah: "يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمُ", translation: "يا أيها الناس اتقوا ربكم", audioUrl: "audio/4.mp3" },
  { id: 5, name: "المائدة", translit: "Al-Mā'idah", verses: 120, type: "مدنية", arabicAyah: "ٱلْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ", translation: "اليوم أكملت لكم دينكم", audioUrl: "audio/5.mp3" },
  { id: 6, name: "الأنعام", translit: "Al-An'ām", verses: 165, type: "مكية", arabicAyah: "وَلَا تَزِرُ وَازِرَةٌۭ وِزْرَ أُخْرَىٰ", translation: "ولا تزر وازرة وزر أخرى", audioUrl: "audio/6.mp3" },
  { id: 7, name: "الأعراف", translit: "Al-A'rāf", verses: 206, type: "مكية", arabicAyah: "إِنَّ رَبَّكُمُ ٱللَّهُ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ", translation: "إن ربكم الله الذي خلق السموات والأرض", audioUrl: "audio/7.mp3" },
  { id: 8, name: "الأنفال", translit: "Al-Anfāl", verses: 75, type: "مدنية", arabicAyah: "يَسْـَٔلُونَكَ عَنِ ٱلْأَنفَالِ", translation: "يسألونك عن الأنفال", audioUrl: "audio/8.mp3" },
  { id: 9, name: "التوبة", translit: "At-Tawbah", verses: 129, type: "مدنية", arabicAyah: "بَرَآءَةٌۭ مِّنَ ٱللَّهِ وَرَسُولِهِۦٓ", translation: "براءة من الله ورسوله", audioUrl: "audio/9.mp3" },
  { id: 10, name: "يونس", translit: "Yūnus", verses: 109, type: "مكية", arabicAyah: "ٱلر ۚ تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ٱلْحَكِيمِ", translation: "الر تلك آيات الكتاب الحكيم", audioUrl: "audio/10.mp3" },
  { id: 11, name: "هود", translit: "Hūd", verses: 123, type: "مكية", arabicAyah: "أَلَّا تَعْبُدُوٓا۟ إِلَّا ٱللَّهَ", translation: "ألا تعبدوا إلا الله", audioUrl: "audio/11.mp3" },
  { id: 12, name: "يوسف", translit: "Yūsuf", verses: 111, type: "مكية", arabicAyah: "لَّقَدْ كَانَ فِى يُوسُفَ وَإِخْوَتِهِۦٓ ءَايَٰتٌۭ لِّلسَّآئِلِينَ", translation: "لقد كان في يوسف وإخوته آيات للسائلين", audioUrl: "audio/12.mp3" },
  { id: 13, name: "الرعد", translit: "Ar-Ra'd", verses: 43, type: "مدنية", arabicAyah: "ٱللَّهُ ٱلَّذِى رَفَعَ ٱلسَّمَٰوَٰتِ بِغَيْرِ عَمَدٍۢ تَرَوْنَهَا", translation: "الله الذي رفع السموات بغير عمد ترونها", audioUrl: "audio/13.mp3" },
  { id: 14, name: "إبراهيم", translit: "Ibrāhīm", verses: 52, type: "مكية", arabicAyah: "رَبِّ ٱجْعَلْ هَٰذَا ٱلْبَلَدَ ءَامِنًۭا", translation: "رب اجعل هذا البلد آمنا", audioUrl: "audio/14.mp3" },
  { id: 15, name: "يس", translit: "Yā Sīn", verses: 83, type: "مكية", arabicAyah: "إِنَّمَآ أَمْرُهُۥٓ إِذَآ أَرَادَ شَيْـًٔا أَن يَقُولَ لَهُۥ كُن فَيَكُونُ", translation: "إنما أمره إذا أراد شيئا أن يقول له كن فيكون", audioUrl: "audio/36.mp3" },
  { id: 16, name: "الرحمن", translit: "Ar-Raḥmān", verses: 78, type: "مدنية", arabicAyah: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ", translation: "فبأي آلاء ربكما تكذبان", audioUrl: "audio/55.mp3" },
  { id: 17, name: "الملك", translit: "Al-Mulk", verses: 30, type: "مكية", arabicAyah: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ", translation: "تبارك الذي بيده الملك", audioUrl: "audio/67.mp3" },
  { id: 18, name: "الكهف", translit: "Al-Kahf", verses: 110, type: "مكية", arabicAyah: "إِنَّا جَعَلْنَا مَا عَلَى ٱلْأَرْضِ زِينَةًۭ لَّهَا", translation: "إنا جعلنا ما على الأرض زينة لها", audioUrl: "audio/18.mp3" },
  { id: 19, name: "الإخلاص", translit: "Al-Ikhlāṣ", verses: 4, type: "مكية", arabicAyah: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", translation: "قل هو الله أحد", audioUrl: "audio/112.mp3" },
  { id: 20, name: "الفلق", translit: "Al-Falaq", verses: 5, type: "مكية", arabicAyah: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "ومن شر حاسد إذا حسد", audioUrl: "audio/113.mp3" },
  { id: 21, name: "الناس", translit: "An-Nās", verses: 6, type: "مكية", arabicAyah: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", translation: "من الجنة والناس", audioUrl: "audio/114.mp3" }
];

// Récupération de la balise audio HTML
const audioElement = document.getElementById('quranAudio');

// Audio player elements
let currentSurahId = null;
let isPlaying = false;

const audioPlayerBar = document.getElementById('audioPlayerBar');
const currentSurahNameSpan = document.getElementById('currentSurahName');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const closeAudioBtn = document.getElementById('closeAudioBtn');
const audioProgress = document.getElementById('audioProgress');
const timeCurrentSpan = document.getElementById('timeCurrent');
const timeDurationSpan = document.getElementById('timeDuration');
const progressContainer = document.querySelector('.audio-progress-container');

// Fonction pour convertir les nombres en chiffres arabes
function toArabicNumber(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[d]).join('');
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Mise à jour de la barre de progression
function updateProgressBar() {
  if (audioElement && !audioElement.paused && !isNaN(audioElement.duration)) {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    audioProgress.style.width = percent + '%';
    timeCurrentSpan.textContent = formatTime(audioElement.currentTime);
    requestAnimationFrame(updateProgressBar);
  }
}

// Charger et jouer une sourate avec la balise audio
function playSurah(surahId, surahName, audioUrl) {
  // Si c'est la même sourate et qu'elle est en pause, on reprend
  if (currentSurahId === surahId && audioElement.src.includes(audioUrl) && !isPlaying) {
    audioElement.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    return;
  }
  
  // Sinon, on charge la nouvelle sourate
  audioElement.src = audioUrl;
  currentSurahId = surahId;
  
  // Supprimer la classe playing de toutes les cartes
  document.querySelectorAll('.surah-card').forEach(card => {
    card.classList.remove('playing');
  });
  
  // Ajouter la classe playing à la carte sélectionnée
  const selectedCard = document.querySelector(`.surah-card[data-id="${surahId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('playing');
  }
  
  // Supprimer les anciens événements pour éviter les doublons
  audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
  audioElement.removeEventListener('timeupdate', handleTimeUpdate);
  audioElement.removeEventListener('ended', handleEnded);
  audioElement.removeEventListener('error', handleError);
  
  // Ajouter les nouveaux événements
  audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  audioElement.addEventListener('timeupdate', handleTimeUpdate);
  audioElement.addEventListener('ended', handleEnded);
  audioElement.addEventListener('error', handleError);
  
  // Lire l'audio
  audioElement.play().catch(error => {
    console.error('Erreur de lecture:', error);
    alert('Impossible de lire l\'audio. Vérifiez que le fichier existe dans le dossier "audio/".');
  });
  
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  currentSurahNameSpan.textContent = surahName;
  audioPlayerBar.style.display = 'flex';
  
  // Démarrer la mise à jour de la progression
  requestAnimationFrame(updateProgressBar);
}

// Gestionnaires d'événements
function handleLoadedMetadata() {
  timeDurationSpan.textContent = formatTime(audioElement.duration);
}

function handleTimeUpdate() {
  const percent = (audioElement.currentTime / audioElement.duration) * 100;
  audioProgress.style.width = percent + '%';
  timeCurrentSpan.textContent = formatTime(audioElement.currentTime);
}

function handleEnded() {
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  audioProgress.style.width = '0%';
  timeCurrentSpan.textContent = '00:00';
  document.querySelectorAll('.surah-card').forEach(card => {
    card.classList.remove('playing');
  });
}

function handleError() {
  console.error('Erreur de lecture audio - Fichier introuvable');
  alert('Désolé, le fichier audio de cette sourate est introuvable.\nVérifiez que le fichier existe dans le dossier "audio/".');
  hideAudioPlayer();
}

// Toggle play/pause
function togglePlayPause() {
  if (!audioElement.src) return;
  
  if (isPlaying) {
    audioElement.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
  } else {
    audioElement.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
    requestAnimationFrame(updateProgressBar);
  }
}

// Stop audio
function stopAudio() {
  if (audioElement.src) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    audioProgress.style.width = '0%';
    timeCurrentSpan.textContent = '00:00';
    document.querySelectorAll('.surah-card').forEach(card => {
      card.classList.remove('playing');
    });
  }
}

// Hide audio player
function hideAudioPlayer() {
  if (audioElement.src) {
    audioElement.pause();
    audioElement.src = '';
  }
  isPlaying = false;
  currentSurahId = null;
  audioPlayerBar.style.display = 'none';
  document.querySelectorAll('.surah-card').forEach(card => {
    card.classList.remove('playing');
  });
}

// Seek to position
function seekTo(e) {
  if (!audioElement.src || !progressContainer || !audioElement.duration) return;
  
  const rect = progressContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  const percent = x / width;
  const seekTime = percent * audioElement.duration;
  
  if (!isNaN(seekTime)) {
    audioElement.currentTime = seekTime;
  }
}

// Update Surah count with Arabic numbers
document.getElementById('souarCount').innerText = toArabicNumber(surahList.length) + ' سُورَةً';

// DOM Elements
const grid = document.getElementById('surahGrid');
const searchInput = document.getElementById('searchInputFilter');
const filterTypeContainer = document.getElementById('filterTypeContainer');
let currentType = 'all';
let searchTerm = '';

// Render cards based on filters
function renderSouar() {
  const filtered = surahList.filter(s => {
    const matchesType = currentType === 'all' || s.type === currentType;
    const matchesSearch = s.name.includes(searchTerm) || 
                           s.translit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.id.toString().includes(searchTerm);
    return matchesType && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><i class="fas fa-book-open" style="font-size:2rem;"></i><p>لا توجد نتائج</p></div>`;
    return;
  }

  let html = '';
  filtered.forEach(s => {
    html += `
      <div class="surah-card" data-id="${s.id}" data-name="${s.name}" data-audio="${s.audioUrl}">
        <div class="surah-header">
          <span class="surah-number">${toArabicNumber(s.id)}</span>
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
          <span class="meta-item"><i class="fas fa-book-open"></i> ${toArabicNumber(s.verses)} آيات</span>
          <span class="meta-item"><i class="fas fa-moon"></i> ${s.type}</span>
          <span class="meta-item"><i class="fas fa-headphones"></i> استماع</span>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;

  // Add click event to cards for audio playback
  document.querySelectorAll('.surah-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.meta-item')) return;
      
      const surahId = parseInt(this.dataset.id);
      const surahName = this.dataset.name;
      const audioUrl = this.dataset.audio;
      
      if (audioUrl) {
        playSurah(surahId, surahName, audioUrl);
      } else {
        alert('القرآن متوفر قريباً');
      }
      
      this.style.backgroundColor = 'var(--emerald-100)';
      setTimeout(() => {
        if (!this.classList.contains('playing')) {
          this.style.backgroundColor = '';
        }
      }, 200);
    });
  });
}

// Search input listener
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderSouar();
});

// Filter type listeners
filterTypeContainer.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    filterTypeContainer.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentType = this.dataset.type;
    renderSouar();
  });
});

// Audio player event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
stopBtn.addEventListener('click', stopAudio);
closeAudioBtn.addEventListener('click', hideAudioPlayer);
if (progressContainer) {
  progressContainer.addEventListener('click', seekTo);
}

// =====================================================
// Douaa Counter (Tasbih)
// =====================================================
let tasbihCount = 33;
const tasbihDisplay = document.getElementById('tasbihDisplay');
const tasbihPlus = document.getElementById('tasbihPlus');
const tasbihMinus = document.getElementById('tasbihMinus');
const tasbihReset = document.getElementById('tasbihReset');
const presetBtns = document.querySelectorAll('.preset-btn');

function updateTasbih(value) {
  if (value < 0) value = 0;
  tasbihCount = value;
  tasbihDisplay.textContent = toArabicNumber(tasbihCount);
}

tasbihPlus.addEventListener('click', () => updateTasbih(tasbihCount + 1));
tasbihMinus.addEventListener('click', () => updateTasbih(tasbihCount - 1));
tasbihReset.addEventListener('click', () => updateTasbih(0));

presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = parseInt(btn.dataset.value);
    updateTasbih(value);
  });
});

// Initial render
renderSouar();
tasbihDisplay.textContent = toArabicNumber(33);