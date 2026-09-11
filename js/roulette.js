// TEMU風 初回限定ラッキースピン（ルーレット）演出
const RouletteManager = {
  SPIN_KEY: "minetemu_roulette_done_v1",

  init() {
    this.drawWheel();
    const hasSpun = sessionStorage.getItem(this.SPIN_KEY);
    // 初回訪問から1秒後に自動でポップアップ
    if (!hasSpun) {
      setTimeout(() => {
        this.openModal();
      }, 1000);
    }
  },

  drawWheel() {
    const canvas = document.getElementById("rouletteWheel");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = width / 2 - 4;

    const segments = [
      { text: "100% OFF", sub: "全品0円", bg: "#ff0044", color: "#fff" },
      { text: "50% OFF", sub: "半額", bg: "#ff9800", color: "#fff" },
      { text: "70% OFF", sub: "超特価", bg: "#ff5722", color: "#fff" },
      { text: "90% OFF", sub: "ほぼタダ", bg: "#e91e63", color: "#fff" },
      { text: "99% OFF", sub: "大赤字", bg: "#9c27b0", color: "#fff" },
      { text: "100% OFF", sub: "神引き！", bg: "#ffaa00", color: "#222" }
    ];

    const numSegs = segments.length;
    const arc = (2 * Math.PI) / numSegs;

    ctx.clearRect(0, 0, width, height);

    segments.forEach((seg, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = seg.bg;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // セクター境界線
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // テキスト描画
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right";

      ctx.fillStyle = seg.color;
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(seg.text, radius - 18, -4);

      ctx.font = "bold 10px sans-serif";
      ctx.fillText(seg.sub, radius - 20, 12);
      ctx.restore();
    });

    // 中央のピン
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffaa00";
    ctx.stroke();

    ctx.fillStyle = "#ff5000";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TEMU", cx, cy);
  },

  openModal() {
    const modal = document.getElementById("rouletteModal");
    if (modal) {
      modal.classList.add("active");
    }
  },

  closeModal() {
    const modal = document.getElementById("rouletteModal");
    if (modal) {
      modal.classList.remove("active");
    }
  },

  spin() {
    const wheel = document.getElementById("rouletteWheel");
    const spinBtn = document.getElementById("spinBtn");
    const resultBox = document.getElementById("rouletteResult");

    if (!wheel || spinBtn.disabled) return;

    spinBtn.disabled = true;
    spinBtn.textContent = "抽選中...";

    // 100%OFFの区画にピタリと止まる計算
    // segments[5] または segments[0] が真上（-90度）に来るよう計算
    const baseRotations = 360 * 6; 
    const targetDeg = baseRotations + 240; // 100% OFF スロット

    wheel.style.transition = "transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)";
    wheel.style.transform = `rotate(${targetDeg}deg)`;

    setTimeout(() => {
      // 当選
      sessionStorage.setItem(this.SPIN_KEY, "true");
      if (typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      if (resultBox) {
        resultBox.innerHTML = `
          <div class="roulette-win-card animate-pop">
            <div class="win-crown">👑</div>
            <h3 class="win-title">🎉 おめでとうございます！ 🎉</h3>
            <p class="win-subtitle">【最高賞】全品100%OFF（¥0）クーポンが当選しました！</p>
            <div class="coupon-ticket">
              <span class="ticket-code">クーポン: <strong>TEMU-ZERO-100</strong></span>
              <span class="ticket-status">自動適用済み (有効期限: 本日中)</span>
            </div>
            <button class="win-claim-btn" onclick="RouletteManager.claimReward()">
              今すぐ¥0でお買い物をする <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        `;
        resultBox.style.display = "block";
      }

      const wheelWrapper = document.getElementById("wheelWrapper");
      if (wheelWrapper) wheelWrapper.style.display = "none";
      if (spinBtn) spinBtn.style.display = "none";

      const couponBadge = document.getElementById("headerCouponBadge");
      if (couponBadge) {
        couponBadge.innerHTML = `<i class="fa-solid fa-gift"></i> 100%OFFクーポン適用中！全品 ¥0`;
        couponBadge.classList.add("pulse-glow");
      }
    }, 4200);
  },

  claimReward() {
    this.closeModal();
    const catalog = document.getElementById("productGrid");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  }
};
