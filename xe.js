const prophets = [
  {
    id: 1,
    nameAr: "آدَم عليه السلام",
    order: 1,
    people: "أبو البشر",
    miracles: "الخلق بيد الله وتعليم الأسماء",
    desc: "آدم هو أول نبي وأبو البشرية. خلقه الله بيديه وعلّمه أسماء كل شيء، ثم أسكنه الجنة ثم أنزله إلى الأرض.",
    category: "early",
  },
  {
    id: 2,
    nameAr: "إِدْرِيس عليه السلام",
    order: 2,
    people: "الأقوام القديمة",
    miracles: "الحكمة والعلم",
    desc: "إدريس عُرف بصدقه وحكمته. ذكره الله في القرآن بأنه كان صدّيقًا نبيًّا ورفعه مكانًا عليًّا.",
    category: "early",
  },
  {
    id: 3,
    nameAr: "نُوح عليه السلام",
    order: 3,
    people: "قوم نوح",
    miracles: "السفينة والطوفان",
    desc: "دعا نوح قومه تسعمائة وخمسين سنة. أنجاه الله مع المؤمنين في السفينة من الطوفان العظيم.",
    category: "ululazm",
  },
  {
    id: 4,
    nameAr: "هُود عليه السلام",
    order: 4,
    people: "قوم عاد",
    miracles: "الريح الصرصر",
    desc: "أُرسل إلى قوم عاد الأقوياء المتجبرين. رفضوا دعوته فأهلكهم الله بريح صرصر عاتية.",
    category: "early",
  },
  {
    id: 5,
    nameAr: "صَالِح عليه السلام",
    order: 5,
    people: "قوم ثمود",
    miracles: "الناقة",
    desc: "أُرسل إلى ثمود الذين طلبوا آية، فأخرج الله الناقة من الصخرة، فعقروها فأخذتهم الصيحة.",
    category: "early",
  },
  {
    id: 6,
    nameAr: "إِبْرَاهِيم عليه السلام",
    order: 6,
    people: "قوم بابل والعراق",
    miracles: "النار لم تحرقه، إحياء الطير",
    desc: "أبو الأنبياء وخليل الرحمن. كسر الأصنام وبنى الكعبة مع ابنه إسماعيل. امتُحن بعظائم الأمور فصبر.",
    category: "ululazm",
  },
  {
    id: 7,
    nameAr: "لُوط عليه السلام",
    order: 7,
    people: "أهل سدوم",
    miracles: "قلب المدينة",
    desc: "ابن أخي إبراهيم، أُرسل إلى قوم منحرفين. أنجاه الله وأهلك قومه بقلب المدائن وإمطار الحجارة.",
    category: "early",
  },
  {
    id: 8,
    nameAr: "إِسْمَاعِيل عليه السلام",
    order: 8,
    people: "أهل الحجاز",
    miracles: "بئر زمزم",
    desc: "ابن إبراهيم، نبيٌّ في بلاد الحجاز. شارك أباه في بناء الكعبة المشرفة وكان صادق الوعد.",
    category: "early",
  },
  {
    id: 9,
    nameAr: "إِسْحَاق عليه السلام",
    order: 9,
    people: "أهل كنعان",
    miracles: "الولادة المعجزة",
    desc: "ابن إبراهيم من سارة، وُلد بشارةً من الملائكة. أبو يعقوب، نبيٌّ في أرض كنعان.",
    category: "early",
  },
  {
    id: 10,
    nameAr: "يَعْقُوب عليه السلام",
    order: 10,
    people: "أهل كنعان",
    miracles: "الرؤيا النبوية",
    desc: "ابن إسحاق، أبو الأسباط الاثني عشر. لُقِّب بإسرائيل. امتُحن بفراق ابنه يوسف فصبر حتى عادت بصيرته.",
    category: "early",
  },
  {
    id: 11,
    nameAr: "يُوسُف عليه السلام",
    order: 11,
    people: "مصر الفرعونية",
    miracles: "تأويل الأحلام",
    desc: "ابن يعقوب، بِيع عبدًا ثم أصبح عزيز مصر. آتاه الله الحسن والحكمة وعلّمه تأويل الأحاديث.",
    category: "early",
  },
  {
    id: 12,
    nameAr: "أَيُّوب عليه السلام",
    order: 12,
    people: "أهل حوران",
    miracles: "الشفاء المعجز",
    desc: "ضُرب به المثل في الصبر. ابتلاه الله بالمرض والفقر وفراق الأهل فصبر حتى كشف الله ضره.",
    category: "early",
  },
  {
    id: 13,
    nameAr: "شُعَيْب عليه السلام",
    order: 13,
    people: "أهل مدين",
    miracles: "ظل الغمام",
    desc: "أُرسل إلى أهل مدين الذين كانوا يبخسون المكيال والميزان. لُقِّب بخطيب الأنبياء.",
    category: "early",
  },
  {
    id: 14,
    nameAr: "مُوسَى عليه السلام",
    order: 14,
    people: "فرعون وبني إسرائيل",
    miracles: "العصا، اليد البيضاء، فلق البحر",
    desc: "أحد أعظم الأنبياء، كلّمه الله تكليمًا. أُنزلت عليه التوراة. أنقذ بني إسرائيل من فرعون.",
    category: "ululazm",
  },
  {
    id: 15,
    nameAr: "هَارُون عليه السلام",
    order: 15,
    people: "فرعون وبني إسرائيل",
    miracles: "العصا",
    desc: "أخو موسى ووزيره. أعانه في تبليغ الرسالة، كان فصيح اللسان رحيم القلب.",
    category: "early",
  },
  {
    id: 16,
    nameAr: "دَاوُود عليه السلام",
    order: 16,
    people: "بني إسرائيل",
    miracles: "تسبيح الجبال، صناعة الدروع",
    desc: "نبيٌّ وملك، أُنزل عليه الزبور. قتل جالوت شابًّا. سخّر الله له الجبال والطير تسبّح معه.",
    category: "early",
  },
  {
    id: 17,
    nameAr: "سُلَيْمَان عليه السلام",
    order: 17,
    people: "الإنس والجن",
    miracles: "منطق الطير، تسخير الريح والجن",
    desc: "ابن داود، ملكٌ لا يُضاهى سخّر الله له الجن والإنس والريح والطير. أوتي علم منطق الحيوانات.",
    category: "early",
  },
  {
    id: 18,
    nameAr: "إِلْيَاس عليه السلام",
    order: 18,
    people: "أهل بعلبك",
    miracles: "المطر بعد القحط",
    desc: "أُرسل إلى قوم يعبدون البعل. دعاهم إلى توحيد الله فكذّبوه، فأُنجي من بينهم.",
    category: "early",
  },
  {
    id: 19,
    nameAr: "الْيَسَع عليه السلام",
    order: 19,
    people: "بني إسرائيل",
    miracles: "الشفاء",
    desc: "خليفة إلياس ووارث نبوته. واصل الدعوة إلى توحيد الله في بني إسرائيل.",
    category: "early",
  },
  {
    id: 20,
    nameAr: "يُونُس عليه السلام",
    order: 20,
    people: "أهل نينوى",
    miracles: "النجاة في بطن الحوت",
    desc: "ذهب مغاضبًا فابتلعه الحوت، فسبّح في الظلمات فنجّاه الله، وعاد إلى قومه فآمنوا.",
    category: "early",
  },
  {
    id: 21,
    nameAr: "ذُو الْكِفْل عليه السلام",
    order: 21,
    people: "بني إسرائيل",
    miracles: "الصبر والاستقامة",
    desc: "نبيٌّ معروف بالصبر والثبات. يُرجَّح أنه حزقيال. ذكره الله في القرآن مع أيوب وإسماعيل.",
    category: "early",
  },
  {
    id: 22,
    nameAr: "زَكَرِيَّا عليه السلام",
    order: 22,
    people: "بني إسرائيل",
    miracles: "الدعاء المستجاب",
    desc: "كافل مريم وأبو يحيى. دعا ربّه في كبره أن يهبه ولدًا فاستجاب الله له.",
    category: "early",
  },
  {
    id: 23,
    nameAr: "يَحْيَى عليه السلام",
    order: 23,
    people: "بني إسرائيل",
    miracles: "الحكمة منذ الصغر",
    desc: "ابن زكريا، آتاه الله الحكم صبيًّا. كان تقيًّا حصورًا سيدًا. قُتل ظلمًا وهو شهيد.",
    category: "early",
  },
  {
    id: 24,
    nameAr: "عِيسَى عليه السلام",
    order: 24,
    people: "بني إسرائيل",
    miracles: "يُكلّم في المهد، يُحيي الموتى، يُبرئ الأكمه والأبرص",
    desc: "المسيح ابن مريم، وُلد من غير أب، أيّده الله بروح القدس. بشّر بمحمد ولم يُصلب بل رُفع.",
    category: "ululazm",
  },
  {
    id: 25,
    nameAr: "مُحَمَّد صلى الله عليه وسلم",
    order: 25,
    people: "الإنسانية جمعاء",
    miracles: "القرآن الكريم، الإسراء والمعراج، انشقاق القمر",
    desc: "خاتم الأنبياء والمرسلين، بُعث رحمةً للعالمين. أُنزل عليه القرآن. أتمّ الله به الرسالة.",
    category: "ululazm",
  },
];

let currentFilter = "all";
let currentSearch = "";

function renderProphets() {
  const grid = document.getElementById("prophetsGrid");

  const filtered = prophets.filter((p) => {
    if (currentFilter === "ululazm" && p.category !== "ululazm") return false;
    if (currentFilter === "early" && p.category === "ululazm") return false;
    if (currentSearch) {
      const s = currentSearch;
      return (
        p.nameAr.includes(s) || p.people.includes(s) || p.miracles.includes(s)
      );
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML =
      '<div class="no-results">😔 لم يُعثر على نبيٍّ بهذا الاسم</div>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p, i) => `
    <div class="prophet-card" onclick="showDetails(${p.id})" style="animation-delay:${i * 0.04}s">
      <div class="card-stripe ${p.category}"></div>
      <div class="card-header">
        <div class="prophet-number">${p.order}</div>
        <div class="prophet-name-ar">${p.nameAr}</div>
        ${p.category === "ululazm" ? '<span class="ululazm-badge">أولو العزم</span>' : ""}
      </div>
      <div class="card-body">
        <div class="prophet-info"><strong>👥 القوم :</strong>&nbsp;${p.people}</div>
        <div class="prophet-info"><strong>✨ المعجزات :</strong>&nbsp;${p.miracles.length > 36 ? p.miracles.substring(0, 36) + "…" : p.miracles}</div>
      </div>
    </div>
  `,
    )
    .join("");
}

function showDetails(id) {
  const p = prophets.find((x) => x.id === id);
  if (!p) return;

  document.getElementById("modalNameAr").textContent = p.nameAr;
  document.getElementById("modalBody").innerHTML = `
    <div class="detail-item">
      <div class="detail-label">📜 الترتيب</div>
      <div class="detail-value">النبي رقم ${p.order}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">👥 القوم</div>
      <div class="detail-value">${p.people}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">✨ المعجزات</div>
      <div class="detail-value">${p.miracles}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">📖 نبذة</div>
      <div class="detail-value">${p.desc}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">⭐ المكانة</div>
      <div class="detail-value">
        <span class="status-tag ${p.category}">
          ${p.category === "ululazm" ? "من أولي العزم من الرسل" : "نبيٌّ مرسل إلى قومه"}
        </span>
      </div>
    </div>
  `;
  document.getElementById("modal").classList.add("active");
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProphets();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderProphets();
  });
});

document
  .getElementById("closeModal")
  .addEventListener("click", () =>
    document.getElementById("modal").classList.remove("active"),
  );
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal"))
    document.getElementById("modal").classList.remove("active");
});

renderProphets();
