// ─── MENU LATÉRAL ─────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu      = document.getElementById('navMenu');
const navOverlay   = document.getElementById('navOverlay');

function toggleMenu() {
  navMenu.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}
function closeMenu() {
  navMenu.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
hamburgerBtn?.addEventListener('click', toggleMenu);
navOverlay?.addEventListener('click', closeMenu);
document.getElementById('closeMenuBtn')?.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-menu a').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ─── DONNÉES SOURATES ─────────────────────────────────────────
const surahList = [
  { id: 1,  name: "الفاتحة",   translit: "Al-Fātiḥah",   verses: 7,   type: "مكية",  arabicAyah: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",                                            translation: "الحمد لله رب العالمين",                           audioUrl: "audio/1" },
  { id: 2,  name: "البقرة",    translit: "Al-Baqarah",    verses: 286, type: "مدنية", arabicAyah: "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ",              translation: "ذلك الكتاب لا ريب فيه هدى للمتقين",                audioUrl: "audio/002.mp3" },
  { id: 3,  name: "آل عمران",  translit: "Āl 'Imrān",     verses: 200, type: "مدنية", arabicAyah: "شَهِدَ ٱللَّهُ أَنَّهُۥ لَآ إِلَٰهَ إِلَّا هُوَ",                               translation: "شهد الله أنه لا إله إلا هو",                          audioUrl: "audio/3.mp3" },
  { id: 4,  name: "النساء",    translit: "An-Nisā",        verses: 176, type: "مدنية", arabicAyah: "يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمُ",                                     translation: "يا أيها الناس اتقوا ربكم",                           audioUrl: "audio/4.mp3" },
  { id: 5,  name: "المائدة",   translit: "Al-Mā'idah",    verses: 120, type: "مدنية", arabicAyah: "ٱلْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ",                                         translation: "اليوم أكملت لكم دينكم",                              audioUrl: "audio/5.mp3" },
  { id: 6,  name: "الأنعام",   translit: "Al-An'ām",       verses: 165, type: "مكية",  arabicAyah: "وَلَا تَزِرُ وَازِرَةٌۭ وِزْرَ أُخْرَىٰ",                                       translation: "ولا تزر وازرة وزر أخرى",                             audioUrl: "audio/6.mp3" },
  { id: 7,  name: "الأعراف",   translit: "Al-A'rāf",       verses: 206, type: "مكية",  arabicAyah: "إِنَّ رَبَّكُمُ ٱللَّهُ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ",           translation: "إن ربكم الله الذي خلق السموات والأرض",               audioUrl: "audio/7.mp3" },
  { id: 8,  name: "الأنفال",   translit: "Al-Anfāl",       verses: 75,  type: "مدنية", arabicAyah: "يَسْـَٔلُونَكَ عَنِ ٱلْأَنفَالِ",                                               translation: "يسألونك عن الأنفال",                                 audioUrl: "audio/8.mp3" },
  { id: 9,  name: "التوبة",    translit: "At-Tawbah",      verses: 129, type: "مدنية", arabicAyah: "بَرَآءَةٌۭ مِّنَ ٱللَّهِ وَرَسُولِهِۦٓ",                                        translation: "براءة من الله ورسوله",                               audioUrl: "audio/9.mp3" },
  { id: 10, name: "يونس",      translit: "Yūnus",           verses: 109, type: "مكية",  arabicAyah: "ٱلر ۚ تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ٱلْحَكِيمِ",                                 translation: "الر تلك آيات الكتاب الحكيم",                         audioUrl: "audio/10.mp3" },
  { id: 11, name: "هود",       translit: "Hūd",             verses: 123, type: "مكية",  arabicAyah: "أَلَّا تَعْبُدُوٓا۟ إِلَّا ٱللَّهَ",                                            translation: "ألا تعبدوا إلا الله",                                audioUrl: "audio/11.mp3" },
  { id: 12, name: "يوسف",      translit: "Yūsuf",           verses: 111, type: "مكية",  arabicAyah: "لَّقَدْ كَانَ فِى يُوسُفَ وَإِخْوَتِهِۦٓ ءَايَٰتٌۭ لِّلسَّآئِلِينَ",         translation: "لقد كان في يوسف وإخوته آيات للسائلين",              audioUrl: "audio/12.mp3" },
  { id: 13, name: "الرعد",     translit: "Ar-Ra'd",         verses: 43,  type: "مدنية", arabicAyah: "ٱللَّهُ ٱلَّذِى رَفَعَ ٱلسَّمَٰوَٰتِ بِغَيْرِ عَمَدٍۢ تَرَوْنَهَا",           translation: "الله الذي رفع السموات بغير عمد ترونها",             audioUrl: "audio/13.mp3" },
  { id: 14, name: "إبراهيم",   translit: "Ibrāhīm",        verses: 52,  type: "مكية",  arabicAyah: "رَبِّ ٱجْعَلْ هَٰذَا ٱلْبَلَدَ ءَامِنًۭا",                                     translation: "رب اجعل هذا البلد آمنا",                             audioUrl: "audio/14.mp3" },
  { id: 15, name: "يس",        translit: "Yā Sīn",          verses: 83,  type: "مكية",  arabicAyah: "إِنَّمَآ أَمْرُهُۥٓ إِذَآ أَرَادَ شَيْـًٔا أَن يَقُولَ لَهُۥ كُن فَيَكُونُ", translation: "إنما أمره إذا أراد شيئا أن يقول له كن فيكون",       audioUrl: "audio/36.mp3" },
  { id: 16, name: "الرحمن",    translit: "Ar-Raḥmān",      verses: 78,  type: "مدنية", arabicAyah: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",                                   translation: "فبأي آلاء ربكما تكذبان",                             audioUrl: "audio/55.mp3" },
  { id: 17, name: "الملك",     translit: "Al-Mulk",         verses: 30,  type: "مكية",  arabicAyah: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ",                                         translation: "تبارك الذي بيده الملك",                              audioUrl: "audio/67.mp3" },
  { id: 18, name: "الكهف",     translit: "Al-Kahf",         verses: 110, type: "مكية",  arabicAyah: "إِنَّا جَعَلْنَا مَا عَلَى ٱلْأَرْضِ زِينَةًۭ لَّهَا",                        translation: "إنا جعلنا ما على الأرض زينة لها",                   audioUrl: "audio/18.mp3" },
  { id: 19, name: "الإخلاص",   translit: "Al-Ikhlāṣ",      verses: 4,   type: "مكية",  arabicAyah: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",                                                      translation: "قل هو الله أحد",                                    audioUrl: "audio/112.mp3" },
  { id: 20, name: "الفلق",     translit: "Al-Falaq",        verses: 5,   type: "مكية",  arabicAyah: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",                                             translation: "ومن شر حاسد إذا حسد",                               audioUrl: "audio/113.mp3" },
  { id: 21, name: "الناس",     translit: "An-Nās",          verses: 6,   type: "مكية",  arabicAyah: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",                                                   translation: "من الجنة والناس",                                    audioUrl: "audio/114.mp3" }
];

// ─── AUDIO SETUP ──────────────────────────────────────────────
const audioElement = document.getElementById('quranAudio');
let currentSurahId = null;
let isPlaying = false;

const audioPlayerBar   = document.getElementById('audioPlayerBar');
const currentSurahNameSpan = document.getElementById('currentSurahName');
const playPauseBtn     = document.getElementById('playPauseBtn');
const stopBtn          = document.getElementById('stopBtn');
const closeAudioBtn    = document.getElementById('closeAudioBtn');
const audioProgress    = document.getElementById('audioProgress');
const timeCurrentSpan  = document.getElementById('timeCurrent');
const timeDurationSpan = document.getElementById('timeDuration');
const progressContainer = document.querySelector('.audio-progress-container');

function toArabicNumber(num) {
  const d = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return num.toString().split('').map(x => d[x] ?? x).join('');
}
function formatTime(s) {
  if (isNaN(s)) return "00:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function updateProgressBar() {
  if (!audioElement.paused && !isNaN(audioElement.duration)) {
    const pct = (audioElement.currentTime / audioElement.duration) * 100;
    audioProgress.style.width = pct + '%';
    timeCurrentSpan.textContent = formatTime(audioElement.currentTime);
    requestAnimationFrame(updateProgressBar);
  }
}

function playSurah(surahId, surahName, audioUrl) {
  if (currentSurahId === surahId && !isPlaying) {
    audioElement.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    return;
  }
  audioElement.src = audioUrl;
  currentSurahId = surahId;
  document.querySelectorAll('.surah-card').forEach(c => c.classList.remove('playing'));
  document.querySelector(`.surah-card[data-id="${surahId}"]`)?.classList.add('playing');
  audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
  audioElement.removeEventListener('timeupdate', handleTimeUpdate);
  audioElement.removeEventListener('ended', handleEnded);
  audioElement.removeEventListener('error', handleError);
  audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  audioElement.addEventListener('timeupdate', handleTimeUpdate);
  audioElement.addEventListener('ended', handleEnded);
  audioElement.addEventListener('error', handleError);
  audioElement.play().catch(() => alert('تعذّر تشغيل الصوت. تأكد من وجود الملف في مجلد audio/'));
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  currentSurahNameSpan.textContent = surahName;
  audioPlayerBar.style.display = 'flex';
  requestAnimationFrame(updateProgressBar);
}

function handleLoadedMetadata() { timeDurationSpan.textContent = formatTime(audioElement.duration); }
function handleTimeUpdate() {
  const pct = (audioElement.currentTime / audioElement.duration) * 100;
  audioProgress.style.width = pct + '%';
  timeCurrentSpan.textContent = formatTime(audioElement.currentTime);
}
function handleEnded() {
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  audioProgress.style.width = '0%';
  timeCurrentSpan.textContent = '00:00';
  document.querySelectorAll('.surah-card').forEach(c => c.classList.remove('playing'));
}
function handleError() {
  alert('ملف الصوت غير موجود. تأكد من وجوده في مجلد audio/');
  hideAudioPlayer();
}
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
function stopAudio() {
  if (!audioElement.src) return;
  audioElement.pause(); audioElement.currentTime = 0;
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  audioProgress.style.width = '0%';
  timeCurrentSpan.textContent = '00:00';
  document.querySelectorAll('.surah-card').forEach(c => c.classList.remove('playing'));
}
function hideAudioPlayer() {
  audioElement.pause(); audioElement.src = '';
  isPlaying = false; currentSurahId = null;
  audioPlayerBar.style.display = 'none';
  document.querySelectorAll('.surah-card').forEach(c => c.classList.remove('playing'));
}
function seekTo(e) {
  if (!audioElement.src || !progressContainer || !audioElement.duration) return;
  const rect = progressContainer.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  const t    = pct * audioElement.duration;
  if (!isNaN(t)) audioElement.currentTime = t;
}

document.getElementById('souarCount').innerText = toArabicNumber(surahList.length) + ' سُورَةً';

// ─── GRILLE SOURATES ──────────────────────────────────────────
const grid = document.getElementById('surahGrid');
const searchInput = document.getElementById('searchInputFilter');
const filterTypeContainer = document.getElementById('filterTypeContainer');
let currentType = 'all';
let searchTerm = '';

function renderSouar() {
  const filtered = surahList.filter(s => {
    const matchType   = currentType === 'all' || s.type === currentType;
    const matchSearch = s.name.includes(searchTerm) ||
                        s.translit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.id.toString().includes(searchTerm);
    return matchType && matchSearch;
  });
  if (!filtered.length) {
    grid.innerHTML = `<div class="no-results"><i class="fas fa-book-open" style="font-size:2rem"></i><p>لا توجد نتائج</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(s => `
    grid.innerHTML = '';
    filtered.forEach(s => {
      const card = document.createElement('div');
      card.className = 'surah-card';
      card.dataset.id = s.id;
      card.dataset.name = s.name;
      card.dataset.audio = s.audioUrl;
      // Header
      const header = document.createElement('div');
      header.className = 'surah-header';
      const numberSpan = document.createElement('span');
      numberSpan.className = 'surah-number';
      numberSpan.textContent = toArabicNumber(s.id);
      header.appendChild(numberSpan);
      const flexDiv = document.createElement('div');
      flexDiv.style.flex = '1';
      const nameDiv = document.createElement('div');
      nameDiv.className = 'surah-name';
      nameDiv.textContent = s.name;
      const translitDiv = document.createElement('div');
      translitDiv.className = 'surah-translit';
      translitDiv.textContent = s.translit;
      flexDiv.appendChild(nameDiv);
      flexDiv.appendChild(translitDiv);
      header.appendChild(flexDiv);
      card.appendChild(header);
      // Ayah preview
      const ayahPreview = document.createElement('div');
      ayahPreview.className = 'ayah-preview';
      const ayahArabic = document.createElement('div');
      ayahArabic.className = 'ayah-arabic';
      ayahArabic.textContent = s.arabicAyah;
      const ayahTrans = document.createElement('div');
      ayahTrans.className = 'ayah-translation';
      ayahTrans.textContent = s.translation;
      ayahPreview.appendChild(ayahArabic);
      ayahPreview.appendChild(ayahTrans);
      card.appendChild(ayahPreview);
      // Meta
      const metaDiv = document.createElement('div');
      metaDiv.className = 'surah-meta';
      const meta1 = document.createElement('span');
      meta1.className = 'meta-item';
      meta1.innerHTML = '<i class="fas fa-book-open"></i> ' + toArabicNumber(s.verses) + ' آيات';
      const meta2 = document.createElement('span');
      meta2.className = 'meta-item';
      meta2.innerHTML = '<i class="fas fa-moon"></i> ' + s.type;
      const meta3 = document.createElement('span');
      meta3.className = 'meta-item';
      meta3.innerHTML = '<i class="fas fa-headphones"></i> استماع';
      metaDiv.appendChild(meta1);
      metaDiv.appendChild(meta2);
      metaDiv.appendChild(meta3);
      card.appendChild(metaDiv);
      grid.appendChild(card);
    });

  document.querySelectorAll('.surah-card').forEach(card => {
    card.addEventListener('click', function() {
      const id  = parseInt(this.dataset.id);
      const nm  = this.dataset.name;
      const url = this.dataset.audio;
      if (url) playSurah(id, nm, url);
      else alert('القرآن متوفر قريباً');
      this.style.backgroundColor = 'var(--e1)';
      setTimeout(() => { if (!this.classList.contains('playing')) this.style.backgroundColor = ''; }, 200);
    });
  });
}

searchInput.addEventListener('input', e => { searchTerm = e.target.value; renderSouar(); });
filterTypeContainer.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    filterTypeContainer.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentType = this.dataset.type;
    renderSouar();
  });
});

playPauseBtn.addEventListener('click', togglePlayPause);
stopBtn.addEventListener('click', stopAudio);
closeAudioBtn.addEventListener('click', hideAudioPlayer);
progressContainer?.addEventListener('click', seekTo);

// ─── TASBIH ───────────────────────────────────────────────────
let tasbihCount = 33;
const tasbihDisplay = document.getElementById('tasbihDisplay');

function updateTasbih(v) {
  if (v < 0) v = 0;
  tasbihCount = v;
  tasbihDisplay.textContent = toArabicNumber(tasbihCount);
}

document.getElementById('tasbihPlus').addEventListener('click',  () => updateTasbih(tasbihCount + 1));
document.getElementById('tasbihMinus').addEventListener('click', () => updateTasbih(tasbihCount - 1));
document.getElementById('tasbihReset').addEventListener('click', () => updateTasbih(0));
document.querySelectorAll('.preset-btn').forEach(btn =>
  btn.addEventListener('click', () => updateTasbih(parseInt(btn.dataset.value)))
);

// ─── INIT ─────────────────────────────────────────────────────
renderSouar();
tasbihDisplay.textContent = toArabicNumber(33);