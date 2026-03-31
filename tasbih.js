 const circle = document.getElementById("circle");
      const countEl = document.getElementById("count");
      const progressFill = document.getElementById("progressFill");
      const progressText = document.getElementById("progressText");

      let count = 0;
      let rotation = 0;
      let max = 33;
      let dots = [];

      /* CREATE DOTS DYNAMIC */
      function createDots(number) {
        circle.innerHTML = "";
        dots = [];

        const container = circle.parentElement;
        const containerRect = container.getBoundingClientRect();
        const centerX = 150;
        const centerY = 150;

        let radius = number >= 99 ? 125 : 110;

        for (let i = 0; i < number; i++) {
          let dot = document.createElement("div");
          dot.classList.add("dot");

          let angle = (i / number) * (2 * Math.PI) - Math.PI / 2;

          let x = radius * Math.cos(angle) + centerX;
          let y = radius * Math.sin(angle) + centerY;

          dot.style.left = x + "px";
          dot.style.top = y + "px";

          circle.appendChild(dot);
          dots.push(dot);
        }
      }

      /* UPDATE PROGRESS */
      function updateProgress() {
        const percent = (count / max) * 100;
        progressFill.style.width = percent + "%";
        progressText.innerText = `${count} / ${max}`;
      }

      /* INITIAL */
      createDots(max);
      updateProgress();

      /* CLICK */
      document.querySelector(".tasbih").addEventListener("click", () => {
        if (count < max) {
          count++;
          rotation += 360 / max;

          countEl.innerText = count;
          circle.style.transform = `rotate(${rotation}deg)`;

          let index = count - 1;
          dots[index].classList.add("active");
          updateProgress();

          // Effet de vibration quand on complète
          if (count === max) {
            const centerDiv = document.querySelector(".center");
            centerDiv.classList.add("complete-animation");

            // Effet sonore virtuel (vibration si supporté)
            if (window.navigator && window.navigator.vibrate) {
              window.navigator.vibrate(200);
            }

            setTimeout(() => {
              centerDiv.classList.remove("complete-animation");
            }, 300);
          }
        }
      });

      /* RESET */
      function reset() {
        count = 0;
        rotation = 0;
        countEl.innerText = 0;
        circle.style.transform = `rotate(0deg)`;
        dots.forEach((d) => d.classList.remove("active"));
        updateProgress();

        // Animation de reset
        const centerDiv = document.querySelector(".center");
        centerDiv.style.transform = "translate(-50%, -50%) scale(0.95)";
        setTimeout(() => {
          centerDiv.style.transform = "translate(-50%, -50%) scale(1)";
        }, 150);
      }

      /* CHANGE MAX */
      function changeMax() {
        max = parseInt(document.getElementById("maxSelect").value);
        reset();
        createDots(max);
        updateProgress();
      }

      /* ZIKR LIST */
      const zikrList = [
        "سبحان الله",
        "الحمد لله",
        "الله أكبر",
        "لا إله إلا الله",
        "أستغفر الله",
        "سبحان الله وبحمده",
        "سبحان الله العظيم",
        "الله أكبر كبيرا",
        "الحمد لله كثيرا",
        "لا حول ولا قوة إلا بالله",
        "حسبي الله ونعم الوكيل",
        "سبحان الله والحمد لله ولا إله إلا الله والله أكبر",
      ];

      let zikrIndex = 0;

      function changeZikr() {
        zikrIndex = (zikrIndex + 1) % zikrList.length;
        const zikrElement = document.getElementById("zikr");
        zikrElement.style.opacity = "0";
        setTimeout(() => {
          zikrElement.innerText = zikrList[zikrIndex];
          zikrElement.style.opacity = "1";
        }, 150);
        zikrElement.style.transition = "opacity 0.15s";
      }

      // Initialiser la transition
      document.getElementById("zikr").style.transition = "opacity 0.15s";