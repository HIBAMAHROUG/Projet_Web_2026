 // Données des prophètes (ordre chronologique selon la tradition islamique)
          const prophets = [
            {
              id: 1,
              nameAr: "آدَم",
              nameFr: "Adam",
              order: 1,
              people: "Premier homme",
              descendants: "Toute l'humanité",
              miracles: "Création par Allah",
              desc: "Adam est le premier prophète et le père de l'humanité. Allah l'a créé de ses mains et lui a enseigné tous les noms.",
              category: "early",
            },
            {
              id: 2,
              nameAr: "إِدْرِيس",
              nameFr: "Idris",
              order: 2,
              people: "Anciens peuples",
              descendants: "Peu nombreux",
              miracles: "Sagesse et connaissance",
              desc: "Idris est connu pour sa sagesse et sa véracité. Il est mentionné comme un homme de vérité et un prophète.",
              category: "early",
            },
            {
              id: 3,
              nameAr: "نُوح",
              nameFr: "Noé",
              order: 3,
              people: "Peuple de Noé",
              descendants: "Shem, Ham, Japheth",
              miracles: "L'Arche",
              desc: "Noé a appelé son peuple pendant 950 ans. Allah l'a sauvé avec les croyants dans l'arche lors du déluge.",
              category: "ululazm",
            },
            {
              id: 4,
              nameAr: "هُود",
              nameFr: "Houd",
              order: 4,
              people: "ʿĀd",
              descendants: "Peuple de ʿĀd",
              miracles: "Vent destructeur",
              desc: "Envoyé au peuple de ʿĀd qui était puissant mais arrogant. Ils furent détruits par un vent violent.",
              category: "early",
            },
            {
              id: 5,
              nameAr: "صَالِح",
              nameFr: "Salih",
              order: 5,
              people: "Thamūd",
              descendants: "Peuple de Thamūd",
              miracles: "La chamelle",
              desc: "Envoyé au peuple de Thamūd qui exigea un miracle. Allah leur donna une chamelle, mais ils la tuèrent et furent anéantis.",
              category: "early",
            },
            {
              id: 6,
              nameAr: "إِبْرَاهِيم",
              nameFr: "Abraham",
              order: 6,
              people: "Peuple de Babylone",
              descendants: "Ismaël, Isaac",
              miracles: "Non brûlé par le feu, résurrection des oiseaux",
              desc: "Le père des monothéistes, ami intime d'Allah. Il a brisé les idoles et construit la Kaaba avec son fils Ismaël.",
              category: "ululazm",
            },
            {
              id: 7,
              nameAr: "لُوط",
              nameFr: "Lot",
              order: 7,
              people: "Peuple de Sodome",
              descendants: "Peu nombreux",
              miracles: "Ville renversée",
              desc: "Neveu d'Abraham, envoyé à un peuple corrompu. Allah sauva Lot et sa famille, mais détruisit les autres.",
              category: "early",
            },
            {
              id: 8,
              nameAr: "إِسْمَاعِيل",
              nameFr: "Ismaël",
              order: 8,
              people: "Peuple d'Arabie",
              descendants: "Arabes (Adnān)",
              miracles: "Source Zamzam",
              desc: "Fils d'Abraham, prophète en Arabie. Participa à la construction de la Kaaba avec son père.",
              category: "early",
            },
            {
              id: 9,
              nameAr: "إِسْحَاق",
              nameFr: "Isaac",
              order: 9,
              people: "Peuple de Canaan",
              descendants: "Tribus d'Israël",
              miracles: "Naissance miraculeuse",
              desc: "Fils d'Abraham, père de Jacob. Prophète en Canaan.",
              category: "early",
            },
            {
              id: 10,
              nameAr: "يَعْقُوب",
              nameFr: "Jacob",
              order: 10,
              people: "Peuple de Canaan",
              descendants: "12 tribus d'Israël",
              miracles: "Vision prophétique",
              desc: "Fils d'Isaac, père des 12 tribus. Surnommé Israël (serviteur d'Allah).",
              category: "early",
            },
            {
              id: 11,
              nameAr: "يُوسُف",
              nameFr: "Joseph",
              order: 11,
              people: "Égypte",
              descendants: "Tribus d'Israël",
              miracles: "Interprétation des rêves",
              desc: "Fils de Jacob, vendu comme esclave puis devint ministre d'Égypte. Connu pour sa beauté et sa patience.",
              category: "early",
            },
            {
              id: 12,
              nameAr: "أَيُّوب",
              nameFr: "Job",
              order: 12,
              people: "Peuple de Hauran",
              descendants: "Peu nombreux",
              miracles: "Guérison miraculeuse",
              desc: "Connu pour sa patience extraordinaire face à la maladie et l'épreuve.",
              category: "early",
            },
            {
              id: 13,
              nameAr: "شُعَيْب",
              nameFr: "Chouayb",
              order: 13,
              people: "Madyan",
              descendants: "Peuple de Madyan",
              miracles: "Ombre du nuage",
              desc: "Envoyé aux habitants de Madyan qui trichaient dans les mesures. Appelé le 'prédicateur'.",
              category: "early",
            },
            {
              id: 14,
              nameAr: "مُوسَى",
              nameFr: "Moïse",
              order: 14,
              people: "Pharaon et les Hébreux",
              descendants: "Tribus d'Israël",
              miracles: "Bâton, main lumineuse, mer ouverte",
              desc: "Prophète majeur, reçut la Torah. Libéra les Hébreux d'Égypte. Allah lui parla directement.",
              category: "ululazm",
            },
            {
              id: 15,
              nameAr: "هَارُون",
              nameFr: "Aaron",
              order: 15,
              people: "Pharaon et les Hébreux",
              descendants: "Prêtres",
              miracles: "Bâton",
              desc: "Frère de Moïse, son assistant. Prophète éloquent qui soutint Moïse.",
              category: "early",
            },
            {
              id: 16,
              nameAr: "دَاوُود",
              nameFr: "David",
              order: 16,
              people: "Israélites",
              descendants: "Salomon",
              miracles: "Montagnes en célébration, forge",
              desc: "Roi et prophète, reçut les Psaumes (Zabur). Vainqueur de Goliath.",
              category: "ululazm",
            },
            {
              id: 17,
              nameAr: "سُلَيْمَان",
              nameFr: "Salomon",
              order: 17,
              people: "Israélites et djinns",
              descendants: "Peu nombreux",
              miracles: "Parle aux animaux, maîtrise du vent",
              desc: "Fils de David, roi puissant qui commandait aux hommes, aux djinns et aux oiseaux.",
              category: "early",
            },
            {
              id: 18,
              nameAr: "إِلْيَاس",
              nameFr: "Élie",
              order: 18,
              people: "Peuple de Baalbek",
              descendants: "Peu nombreux",
              miracles: "Pluie après sécheresse",
              desc: "Envoyé à son peuple qui adorait Baal. Appelait à adorer Allah seul.",
              category: "early",
            },
            {
              id: 19,
              nameAr: "الْيَسَع",
              nameFr: "Élisée",
              order: 19,
              people: "Israélites",
              descendants: "Peu nombreux",
              miracles: "Guérisons",
              desc: "Successeur d'Élie, continua l'appel à l'adoration d'Allah.",
              category: "early",
            },
            {
              id: 20,
              nameAr: "يُونُس",
              nameFr: "Jonas",
              order: 20,
              people: "Peuple de Ninive",
              descendants: "Peu nombreux",
              miracles: "Survie dans le ventre du poisson",
              desc: "Quitta son peuple par impatience, fut avalé par un grand poisson, puis délivré après s'être repenti.",
              category: "early",
            },
            {
              id: 21,
              nameAr: "ذُو الْكِفْل",
              nameFr: "Dhu al-Kifl",
              order: 21,
              people: "Israélites",
              descendants: "Peu nombreux",
              miracles: "Patience",
              desc: "Prophète connu pour sa patience et sa droiture. Certains l'identifient à Ézéchiel.",
              category: "early",
            },
            {
              id: 22,
              nameAr: "زَكَرِيَّا",
              nameFr: "Zacharie",
              order: 22,
              people: "Israélites",
              descendants: "Jean",
              miracles: "Prière exaucée pour un enfant",
              desc: "Gardien de Marie, père de Jean. Demanda un enfant malgré son âge avancé.",
              category: "early",
            },
            {
              id: 23,
              nameAr: "يَحْيَى",
              nameFr: "Jean",
              order: 23,
              people: "Israélites",
              descendants: "Sans enfants",
              miracles: "Sagesse dès l'enfance",
              desc: "Fils de Zacharie, pur et pieux. Appelait à la repentance.",
              category: "early",
            },
            {
              id: 24,
              nameAr: "عِيسَى",
              nameFr: "Jésus",
              order: 24,
              people: "Enfants d'Israël",
              descendants: "Sans enfants",
              miracles:
                "Guérit les malades, ressuscite les morts, parle au berceau",
              desc: "Messie, fils de Marie. Né miraculeusement, il annonça la venue de Muhammad. Ne fut pas crucifié.",
              category: "ululazm",
            },
            {
              id: 25,
              nameAr: "مُحَمَّد",
              nameFr: "Muhammad",
              order: 25,
              people: "Toute l'humanité",
              descendants: "Descendants par Fatima",
              miracles: "Coran, voyage nocturne, lune fendue",
              desc: "Dernier prophète, envoyé à toute l'humanité. Reçut le Coran. Sceau des prophètes.",
              category: "ululazm",
            },
          ];

          let currentFilter = "all";
          let currentSearch = "";

          function renderProphets() {
            const grid = document.getElementById("prophetsGrid");

            let filtered = prophets.filter((p) => {
              // Filtre par catégorie
              if (currentFilter === "ululazm" && p.category !== "ululazm")
                return false;
              if (currentFilter === "early" && p.id > 13) return false;

              // Recherche
              if (currentSearch) {
                const searchLower = currentSearch.toLowerCase();
                return (
                  p.nameFr.toLowerCase().includes(searchLower) ||
                  p.nameAr.includes(searchLower) ||
                  p.desc.toLowerCase().includes(searchLower)
                );
              }
              return true;
            });

            if (filtered.length === 0) {
              grid.innerHTML =
                '<div class="no-results">😔 Aucun prophète trouvé</div>';
              return;
            }

            grid.innerHTML = filtered
              .map(
                (prophet) => `
                <div class="prophet-card" onclick="showDetails(${prophet.id})">
                    <div class="card-header">
                        <div class="prophet-number">${prophet.order}</div>
                        <div class="prophet-name-ar">${prophet.nameAr}</div>
                        <div class="prophet-name-fr">${prophet.nameFr}</div>
                    </div>
                    <div class="card-body">
                        <div class="prophet-info">
                            <strong>👥 Peuple :</strong> ${prophet.people}
                        </div>
                        <div class="prophet-info">
                            <strong>✨ Miracles :</strong> ${prophet.miracles.substring(0, 40)}${prophet.miracles.length > 40 ? "..." : ""}
                        </div>
                        <div class="prophet-desc">
                            ${prophet.desc.substring(0, 100)}${prophet.desc.length > 100 ? "..." : ""}
                        </div>
                    </div>
                </div>
            `,
              )
              .join("");
          }

          function showDetails(id) {
            const prophet = prophets.find((p) => p.id === id);
            if (!prophet) return;

            document.getElementById("modalNameAr").innerHTML = prophet.nameAr;
            document.getElementById("modalNameFr").innerHTML = prophet.nameFr;

            const modalBody = document.getElementById("modalBody");
            modalBody.innerHTML = `
                <div class="detail-item">
                    <div class="detail-label">📜 Ordre chronologique</div>
                    <div>${prophet.order}ème prophète</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">👥 Peuple / Époque</div>
                    <div>${prophet.people}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">✨ Miracles</div>
                    <div>${prophet.miracles}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">👨‍👩‍👧‍👦 Descendance</div>
                    <div>${prophet.descendants}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">📖 Présentation</div>
                    <div>${prophet.desc}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">⭐ Statut</div>
                    <div>${prophet.category === "ululazm" ? "Parmi les Oulou al-Azm (prophètes majeurs)" : "Prophète envoyé à son peuple"}</div>
                </div>
            `;

            document.getElementById("modal").classList.add("active");
          }

          // Événements
          document
            .getElementById("searchInput")
            .addEventListener("input", (e) => {
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
            .addEventListener("click", () => {
              document.getElementById("modal").classList.remove("active");
            });

          document.getElementById("modal").addEventListener("click", (e) => {
            if (e.target === document.getElementById("modal")) {
              document.getElementById("modal").classList.remove("active");
            }
          });

          // Initialisation
          renderProphets();