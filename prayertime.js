// ===== prayer-times.js =====
console.log("✅ prayer-times.js chargé");

// ================= CONFIG =================
const API_BASE = 'https://api.aladhan.com/v1';
const DEFAULT_METHOD = 3;
const CACHE_KEY = 'faithpathPrayerCacheV1';

// ================= DOM =================
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const prayerTimesGrid = document.getElementById('prayerTimesGrid');
const nextPrayerCard = document.getElementById('nextPrayerCard');
const cityNameSpan = document.getElementById('cityName');
const dateInfoDiv = document.getElementById('dateInfo');
const nextPrayerName = document.getElementById('nextPrayerName');
const nextPrayerTime = document.getElementById('nextPrayerTime');
const countdownDiv = document.getElementById('countdown');
const manualLocationDiv = document.getElementById('manualLocation');
const cityInput = document.getElementById('cityInput');
const manualSearchButton = document.getElementById('manualSearchBtn');
const MANUAL_BTN_DEFAULT_HTML = manualSearchButton ? manualSearchButton.innerHTML : '';

let currentPrayerTimes = null;
let countdownInterval = null;

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    initManualSearchEvents();
    restoreCachedPrayerData();
    getUserLocation();
});

function initManualSearchEvents() {
    if (!cityInput) return;
    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            getPrayerTimesByCity();
        }
    });
}

// ================= UTIL =================
function formatDateForAPI(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Nettoie "05:12 (+01)" -> "05:12"
function normalizeTime(timeStr) {
    if (!timeStr) return null;
    return timeStr.split(' ')[0];
}

// ================= GEO =================
function getUserLocation() {
    if (!navigator.geolocation) {
        showError("المتصفح لا يدعم تحديد الموقع");
        showManualLocation();
        return;
    }

    clearError();
    showLoading(!currentPrayerTimes);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getPrayerTimesByCoords(latitude, longitude);
            getCityName(latitude, longitude);
        },
        (error) => {
            if (error?.code === error.PERMISSION_DENIED) {
                showError("تم رفض إذن الموقع. يمكنك إدخال المدينة يدويًا.");
            } else {
                showError("فشل تحديد الموقع");
            }
            showManualLocation();
            showLoading(false);
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 300000 }
    );
}

// ================= REVERSE GEOCODING =================
async function getCityName(lat, lon) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ar&zoom=10&addressdetails=1`
        );

        if (!res.ok) {
            throw new Error('Reverse geocoding failed');
        }

        const data = await res.json();
        const address = data?.address || {};

        const primaryLocation =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            address.state_district ||
            address.state ||
            '';

        const country = address.country || '';

        const city = primaryLocation
            ? (country && country !== primaryLocation ? `${primaryLocation}، ${country}` : primaryLocation)
            : 'تم تحديد الموقع';

        if (cityNameSpan) cityNameSpan.textContent = city;
        updateCachedCityLabel(city);
    } catch {
        if (cityNameSpan) cityNameSpan.textContent = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
}

// ================= API =================
async function getPrayerTimesByCoords(lat, lon) {
    try {
        clearError();
        const dateStr = formatDateForAPI(new Date());
        const response = await fetch(
            `${API_BASE}/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${DEFAULT_METHOD}`
        );

        if (!response.ok) throw new Error("فشل جلب البيانات");

        const data = await response.json();
        const timings = data?.data?.timings;

        if (!timings) throw new Error("بيانات غير صالحة");

        currentPrayerTimes = timings;

        displayPrayerTimes(timings);
        displayNextPrayer(timings);
        displayHijriDate(data.data.date.hijri);
        savePrayerCache({
            timings,
            hijri: data?.data?.date?.hijri,
            cityLabel: cityNameSpan?.textContent || ''
        });

        hideManualLocation();
        showLoading(false);

    } catch (err) {
        showError(err.message || "تعذر تحميل أوقات الصلاة");
        showManualLocation();
        showLoading(false);
    }
}

// ================= MANUAL LOCATION =================
async function getPrayerTimesByCity() {
    const inputValue = cityInput?.value?.trim();

    if (!inputValue) {
        showError("الرجاء إدخال اسم المدينة");
        return;
    }

    const parts = inputValue.split(',').map((part) => part.trim()).filter(Boolean);
    const city = parts[0];
    const country = parts[1] || '';

    try {
        clearError();
        showLoading(true);

        const dateStr = formatDateForAPI(new Date());
        const cityQuery = encodeURIComponent(city);
        const countryQuery = encodeURIComponent(country);
        const url = country
            ? `${API_BASE}/timingsByCity/${dateStr}?city=${cityQuery}&country=${countryQuery}&method=${DEFAULT_METHOD}`
            : `${API_BASE}/timingsByCity/${dateStr}?city=${cityQuery}&method=${DEFAULT_METHOD}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("تعذر جلب أوقات الصلاة لهذه المدينة");

        const data = await response.json();
        const timings = data?.data?.timings;
        if (!timings) throw new Error("بيانات المدينة غير صالحة");

        currentPrayerTimes = timings;

        displayPrayerTimes(timings);
        displayNextPrayer(timings);
        displayHijriDate(data?.data?.date?.hijri);

        if (cityNameSpan) {
            cityNameSpan.textContent = country ? `${city}، ${country}` : city;
        }

        savePrayerCache({
            timings,
            hijri: data?.data?.date?.hijri,
            cityLabel: cityNameSpan?.textContent || city
        });

        showLoading(false);
    } catch (error) {
        showError(error.message || "حدث خطأ أثناء البحث عن المدينة");
        showLoading(false);
    }
}

// ================= DISPLAY =================
function displayPrayerTimes(times) {
    if (!prayerTimesGrid) return;

    const prayerMap = {
        Fajr: { label: 'الفجر', icon: 'fa-cloud-sun', className: 'fajr' },
        Sunrise: { label: 'الشروق', icon: 'fa-sun', className: 'sunrise' },
        Dhuhr: { label: 'الظهر', icon: 'fa-sun', className: 'dhuhr' },
        Asr: { label: 'العصر', icon: 'fa-cloud-sun', className: 'asr' },
        Maghrib: { label: 'المغرب', icon: 'fa-moon', className: 'maghrib' },
        Isha: { label: 'العشاء', icon: 'fa-star-and-crescent', className: 'isha' }
    };

    let html = '';

    for (const key in prayerMap) {
        const time = normalizeTime(times[key]);
        if (!time) continue;

        const prayer = prayerMap[key];

        html += `
            <div class="prayer-card ${prayer.className}" data-prayer-key="${key}">
                <div class="prayer-icon"><i class="fas ${prayer.icon}"></i></div>
                <div class="prayer-name">${prayer.label}</div>
                <div class="prayer-time">${time}</div>
            </div>
        `;
    }

    prayerTimesGrid.innerHTML = html;
    prayerTimesGrid.classList.remove('hidden');
}

// ================= NEXT PRAYER =================
function displayNextPrayer(times) {
    const prayers = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
    const prayerLabels = {
        Fajr: 'الفجر',
        Dhuhr: 'الظهر',
        Asr: 'العصر',
        Maghrib: 'المغرب',
        Isha: 'العشاء'
    };

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let nextPrayer = null;

    for (const name of prayers) {
        const time = normalizeTime(times[name]);
        if (!time) continue;

        const [h, m] = time.split(':').map(Number);
        const prayerMinutes = h * 60 + m;

        if (prayerMinutes > currentMinutes) {
            nextPrayer = { name, time };
            break;
        }
    }

    if (!nextPrayer) {
        nextPrayer = {
            name: 'Fajr',
            time: normalizeTime(times.Fajr)
        };
    }

    if (!nextPrayerName || !nextPrayerTime || !nextPrayerCard) return;

    nextPrayerName.textContent = prayerLabels[nextPrayer.name] || nextPrayer.name;
    nextPrayerTime.textContent = nextPrayer.time;
    highlightNextPrayerCard(nextPrayer.name);

    nextPrayerCard.classList.remove('hidden');

    startCountdown(nextPrayer.time);
}

function highlightNextPrayerCard(prayerName) {
    if (!prayerTimesGrid) return;

    const cards = prayerTimesGrid.querySelectorAll('.prayer-card');
    cards.forEach((card) => card.classList.remove('prayer-card--next'));

    const target = prayerTimesGrid.querySelector(`[data-prayer-key="${prayerName}"]`);
    if (target) target.classList.add('prayer-card--next');
}

// ================= COUNTDOWN =================
function startCountdown(prayerTime) {
    clearInterval(countdownInterval);

    function update() {
        if (!countdownDiv) return;
        const now = new Date();
        const [h, m] = prayerTime.split(':').map(Number);

        const target = new Date();
        target.setHours(h, m, 0, 0);

        if (target <= now) {
            target.setDate(target.getDate() + 1);
        }

        const diff = target - now;

        if (diff <= 0) return;

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        countdownDiv.textContent =
            `متبقي: ${String(hours).padStart(2, '0')}س ${String(minutes).padStart(2, '0')}د ${String(seconds).padStart(2, '0')}ث`;
    }

    update();
    countdownInterval = setInterval(update, 1000);
}

// ================= HIJRI DATE =================
function displayHijriDate(hijri) {
    if (!dateInfoDiv || !hijri) return;
    dateInfoDiv.textContent =
        `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
}

// ================= CACHE =================
function savePrayerCache({ timings, hijri, cityLabel }) {
    try {
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                dateKey: formatDateForAPI(new Date()),
                savedAt: Date.now(),
                timings,
                hijri,
                cityLabel
            })
        );
    } catch {
        // Ignore localStorage errors
    }
}

function restoreCachedPrayerData() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return;

        const cached = JSON.parse(raw);
        const todayKey = formatDateForAPI(new Date());
        if (!cached?.timings || cached?.dateKey !== todayKey) return;

        currentPrayerTimes = cached.timings;
        displayPrayerTimes(cached.timings);
        displayNextPrayer(cached.timings);
        displayHijriDate(cached?.hijri);

        if (cityNameSpan && cached?.cityLabel) {
            cityNameSpan.textContent = cached.cityLabel;
        }

        clearError();
        showLoading(false);
    } catch {
        // Ignore cache parse errors
    }
}

function updateCachedCityLabel(cityLabel) {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return;

        const cached = JSON.parse(raw);
        if (!cached || !cached.timings) return;

        cached.cityLabel = cityLabel;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch {
        // Ignore localStorage errors
    }
}

// ================= UI =================
function showLoading(show) {
    if (!loadingSpinner) return;
    loadingSpinner.classList.toggle('hidden', !show);

    if (manualSearchButton) {
        manualSearchButton.disabled = show;
        manualSearchButton.setAttribute('aria-busy', String(show));
        manualSearchButton.innerHTML = show
            ? '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...'
            : MANUAL_BTN_DEFAULT_HTML;
    }
}

function showError(msg) {
    if (!errorMessage) return;
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function clearError() {
    if (!errorMessage) return;
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

function showManualLocation() {
    manualLocationDiv?.classList.remove('hidden');
}

function hideManualLocation() {
    manualLocationDiv?.classList.add('hidden');
}

console.log("✅ Script opérationnel");