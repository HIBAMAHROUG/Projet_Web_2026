/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const HIJRI_MONTHS = [
  'محرّم','صفر','ربيع الأوّل','ربيع الثاني',
  'جمادى الأولى','جمادى الآخرة','رجب','شعبان',
  'رمضان','شوّال','ذو القعدة','ذو الحجّة'
];
const GREG_MONTHS = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'
];
const DAYS_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const ISLAMIC_EVENTS = [
  {month:1,  day:1,  name:'رأس السنة الهجرية',      icon:'🌙'},
  {month:1,  day:10, name:'يوم عاشوراء',            icon:'📿'},
  {month:3,  day:12, name:'المولد النبوي الشريف',   icon:'☪️'},
  {month:7,  day:27, name:'الإسراء والمعراج',       icon:'✨'},
  {month:8,  day:15, name:'ليلة النصف من شعبان',   icon:'🌕'},
  {month:9,  day:1,  name:'أوّل رمضان المبارك',    icon:'🌙'},
  {month:9,  day:27, name:'ليلة القدر',             icon:'⭐'},
  {month:10, day:1,  name:'عيد الفطر المبارك',     icon:'🎉'},
  {month:12, day:9,  name:'يوم عرفة',              icon:'🕋'},
  {month:12, day:10, name:'عيد الأضحى المبارك',    icon:'🎊'},
];

/* ══════════════════════════════════════════
   ALGORITHMS — Gregorian ↔ Julian Day ↔ Hijri
══════════════════════════════════════════ */
function gregorianToJD(year, month, day) {
  let Y = year, M = month;
  if (M <= 2) { Y--; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5;
}

function jdToGregorian(jd) {
  const z = Math.floor(jd + 0.5);
  const alpha = Math.floor((z - 1867216.25) / 36524.25);
  const A = z < 2299161 ? z : z + 1 + alpha - Math.floor(alpha / 4);
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day   = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year  = month > 2 ? C - 4716 : C - 4715;
  return { year, month, day };
}

function jdToHijri(jd) {
  const l  = Math.floor(jd + 0.5) - 1948440 + 10632;
  const n  = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j  = Math.floor((10985 - l2) / 5316) * Math.floor(50 * l2 / 17719)
            + Math.floor(l2 / 5670)           * Math.floor(43 * l2 / 15238);
  const l3 = l2
            - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50)
            - Math.floor(j / 16)         * Math.floor(15238 * j / 43) + 29;
  const hm = Math.floor(24 * l3 / 709);
  const hd = l3 - Math.floor(709 * hm / 24);
  const hy = 30 * n + j - 30;
  return { year: hy, month: hm, day: hd };
}

function hijriToJD(year, month, day) {
  return Math.floor((11 * year + 3) / 30) + 354 * year
       + 30 * month - Math.floor((month - 1) / 2) + day + 1948440 - 385;
}

function hijriDaysInMonth(year, month) {
  const jd1 = hijriToJD(year, month, 1);
  let nm = month + 1, ny = year;
  if (nm > 12) { nm = 1; ny++; }
  return hijriToJD(ny, nm, 1) - jd1;
}

function dowOfJD(jd) { return Math.floor(jd + 1.5) % 7; } // 0=Sun…5=Fri…6=Sat

function toAr(n) { return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]); }

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
const today = new Date();
const todayJD = gregorianToJD(today.getFullYear(), today.getMonth() + 1, today.getDate());
const todayH  = jdToHijri(todayJD);
let viewYear  = todayH.year;
let viewMonth = todayH.month;

/* ══════════════════════════════════════════
   RENDER
══════════════════════════════════════════ */
function render() {
  renderHeader();
  renderTodayCard();
  renderGrid();
  renderEvents();
}

function renderHeader() {
  document.getElementById('hMonthName').textContent = HIJRI_MONTHS[viewMonth - 1];
  document.getElementById('hYear').textContent = toAr(viewYear) + ' هـ';

  const dim = hijriDaysInMonth(viewYear, viewMonth);
  const g1  = jdToGregorian(hijriToJD(viewYear, viewMonth, 1));
  const g2  = jdToGregorian(hijriToJD(viewYear, viewMonth, dim));
  let label;
  if (g1.year === g2.year && g1.month === g2.month)
    label = GREG_MONTHS[g1.month-1] + ' ' + g1.year + ' م';
  else if (g1.year === g2.year)
    label = GREG_MONTHS[g1.month-1] + ' – ' + GREG_MONTHS[g2.month-1] + ' ' + g1.year + ' م';
  else
    label = GREG_MONTHS[g1.month-1] + ' ' + g1.year + ' – ' + GREG_MONTHS[g2.month-1] + ' ' + g2.year + ' م';
  document.getElementById('gregRange').textContent = label;
}

function renderTodayCard() {
  const dow = DAYS_AR[today.getDay()];
  document.getElementById('todayCard').innerHTML = `
    <div>
      <div class="tc-label">التاريخ الهجري اليوم</div>
      <div class="tc-hijri">${toAr(todayH.day)} ${HIJRI_MONTHS[todayH.month-1]} ${toAr(todayH.year)} هـ</div>
    </div>
    <div class="divider-v"></div>
    <div>
      <div class="tc-label">التاريخ الميلادي</div>
      <div class="tc-greg">${dow}، ${today.getDate()} ${GREG_MONTHS[today.getMonth()]} ${today.getFullYear()} م</div>
    </div>`;
}

function renderGrid() {
  // Days header (Sun → Sat)
  const dh = document.getElementById('daysHeader');
  dh.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = document.createElement('div');
    d.className = 'day-name' + (i === 5 ? ' fri' : '');
    d.textContent = DAYS_AR[i];
    dh.appendChild(d);
  }

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  const dim      = hijriDaysInMonth(viewYear, viewMonth);
  const firstJD  = hijriToJD(viewYear, viewMonth, 1);
  const firstDow = dowOfJD(firstJD); // 0=Sun

  // Event map for current month
  const evtMap = {};
  ISLAMIC_EVENTS.forEach(e => { if (e.month === viewMonth) evtMap[e.day] = e; });

  // Empty leading cells
  for (let i = 0; i < firstDow; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell empty';
    grid.appendChild(cell);
  }

  // Day cells
  for (let d = 1; d <= dim; d++) {
    const jd  = hijriToJD(viewYear, viewMonth, d);
    const g   = jdToGregorian(jd);
    const dow = dowOfJD(jd);
    const isToday = (viewYear === todayH.year && viewMonth === todayH.month && d === todayH.day);
    const evt = evtMap[d];

    let cls = 'cal-cell';
    if (isToday)   cls += ' today';
    else if (evt)  cls += ' event-day';
    else if (dow === 5) cls += ' friday';

    const cell = document.createElement('div');
    cell.className = cls;
    cell.title = `${d} ${HIJRI_MONTHS[viewMonth-1]} ${viewYear} هـ\n${g.day} ${GREG_MONTHS[g.month-1]} ${g.year} م${evt ? '\n' + evt.name : ''}`;

    cell.innerHTML =
      `<div class="hijri-d">${toAr(d)}</div>` +
      `<div class="greg-d">${g.day} ${GREG_MONTHS[g.month-1].slice(0,3)}</div>` +
      (evt ? `<div class="ev-icon">${evt.icon}</div><div class="ev-mini">${evt.name}</div>` : '');

    // Click: fill converter and scroll
    cell.addEventListener('click', () => {
      if (!evt) return;
    });
    grid.appendChild(cell);
  }
}

function renderEvents() {
  const eg = document.getElementById('eventsGrid');
  eg.innerHTML = '';
  ISLAMIC_EVENTS.forEach(e => {
    const jd = hijriToJD(todayH.year, e.month, e.day);
    const g  = jdToGregorian(jd);
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML =
      `<div class="ev-icon-big">${e.icon}</div>` +
      `<div><div class="ev-name">${e.name}</div>` +
      `<div class="ev-dates">${e.day} ${HIJRI_MONTHS[e.month-1]}</div>` +
      `<div class="ev-dates">${g.day} ${GREG_MONTHS[g.month-1]} ${g.year} م</div></div>`;
    eg.appendChild(card);
  });
}

/* ══════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════ */
function prevMonth() {
  viewMonth--; if (viewMonth < 1) { viewMonth = 12; viewYear--; } render();
}
function nextMonth() {
  viewMonth++; if (viewMonth > 12) { viewMonth = 1; viewYear++; } render();
}
function goToToday() {
  viewYear = todayH.year; viewMonth = todayH.month; render();
}

/* ══════════════════════════════════════════
   CONVERTER
══════════════════════════════════════════ */
// Populate Hijri month select
const hMSel = document.getElementById('h_month');
HIJRI_MONTHS.forEach((m, i) => {
  const o = document.createElement('option');
  o.value = i + 1; o.textContent = m;
  hMSel.appendChild(o);
});

function setTab(t) {
  document.getElementById('tab1').classList.toggle('active', t === 1);
  document.getElementById('tab2').classList.toggle('active', t === 2);
  document.getElementById('convForm1').style.display = t === 1 ? 'flex' : 'none';
  document.getElementById('convForm2').style.display = t === 2 ? 'flex' : 'none';
  document.getElementById('convResult').classList.remove('show');
}

function convertGtoH() {
  const d = parseInt(document.getElementById('g_day').value);
  const m = parseInt(document.getElementById('g_month').value);
  const y = parseInt(document.getElementById('g_year').value);
  if (!d || !m || !y) return;
  const jd  = gregorianToJD(y, m, d);
  const h   = jdToHijri(jd);
  const dow = DAYS_AR[dowOfJD(jd)];
  showResult(
    `${toAr(h.day)} ${HIJRI_MONTHS[h.month-1]} ${toAr(h.year)} هـ`,
    `${dow}، ${d} ${GREG_MONTHS[m-1]} ${y} م`
  );
}

function convertHtoG() {
  const d = parseInt(document.getElementById('h_day').value);
  const m = parseInt(document.getElementById('h_month').value);
  const y = parseInt(document.getElementById('h_year').value);
  if (!d || !m || !y) return;
  const jd  = hijriToJD(y, m, d);
  const g   = jdToGregorian(jd);
  const dow = DAYS_AR[dowOfJD(jd)];
  showResult(
    `${g.day} ${GREG_MONTHS[g.month-1]} ${g.year} م`,
    `${dow}، ${toAr(d)} ${HIJRI_MONTHS[m-1]} ${toAr(y)} هـ`
  );
}

function showResult(main, sub) {
  document.getElementById('resultMain').textContent = main;
  document.getElementById('resultSub').textContent = sub;
  document.getElementById('convResult').classList.add('show');
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
render();