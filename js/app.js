// MINETEMU メインアプリケーション
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  currentCategory: "all",
  searchQuery: "",
  selectedProduct: null,

  init() {
    this.initTimer();
    this.renderCategories();
    this.renderProducts();
    this.initEventListeners();
    CartManager.updateCartBadge();
    CartManager.renderCartUI();
    RouletteManager.init();
    this.initFakeNotificationStream();
  },

  // カウントダウンタイマー（セール終了まで）
  initTimer() {
    let seconds = 3 * 3600 + 42 * 60 + 15; // 03:42:15
    const timerEls = document.querySelectorAll(".countdown-timer-val");

    setInterval(() => {
      if (seconds > 0) seconds--;
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      timerEls.forEach(el => {
        el.textContent = `${h}:${m}:${s}`;
      });
    }, 1000);
  },

  // カテゴリタブの描画
  renderCategories() {
    const container = document.getElementById("categoryTabs");
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
      <button class="cat-tab ${cat.id === this.currentCategory ? "active" : ""}" 
              onclick="App.setCategory('${cat.id}')">
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.name}</span>
      </button>
    `).join("");
  },

  setCategory(catId) {
    this.currentCategory = catId;
    this.renderCategories();
    this.renderProducts();
  },

  setSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.renderProducts();
  },

  // 商品リスト描画
  renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    let filtered = PRODUCTS.filter(product => {
      const matchCat = this.currentCategory === "all" || product.category === this.currentCategory;
      const matchSearch = !this.searchQuery ||
        product.title.toLowerCase().includes(this.searchQuery) ||
        product.description.toLowerCase().includes(this.searchQuery) ||
        product.tags.some(t => t.toLowerCase().includes(this.searchQuery));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <i class="fa-solid fa-magnifying-glass"></i>
          <h3>該当する商品が見つかりませんでした</h3>
          <p>検索キーワードを変えて再度お試しください</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(product => {
      const badgeHtml = product.badge
        ? `<div class="temu-badge badge-${product.badgeType}"><i class="fa-solid fa-bolt"></i> ${product.badge}</div>`
        : "";

      return `
        <div class="product-card" onclick="App.openDetail('${product.id}')">
          <div class="card-media">
            ${getProductImageHtml(product)}
            ${badgeHtml}
            <div class="discount-pill">100% OFF</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${product.title}</h3>
            <div class="card-sales-info">
              <span class="sold-text">${product.soldCount.toLocaleString()}個販売済み</span>
              <span class="stock-text">残り${product.stockLeft}個</span>
            </div>
            <div class="sales-progress-bar">
              <div class="sales-progress-fill" style="width: ${Math.min(98, 85 + (product.id.length % 12))}%"></div>
            </div>
            <div class="card-price-row">
              <div class="price-group">
                <span class="currency">¥</span>
                <span class="main-price">0</span>
                <span class="orig-price">¥${product.originalPrice.toLocaleString()}</span>
              </div>
            </div>
            <div class="card-footer-tags">
              <span class="tag-free"><i class="fa-solid fa-truck-fast"></i> 即時無料DL</span>
              <span class="tag-rating"><i class="fa-solid fa-star"></i> ${product.rating} (${product.reviewsCount})</span>
            </div>
            <div class="card-btn-row">
              <button class="add-to-cart-btn" onclick="event.stopPropagation(); App.quickAddToCart('${product.id}')">
                <i class="fa-solid fa-cart-plus"></i> カートに追加
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  // クイックカート追加
  quickAddToCart(id) {
    CartManager.addItem(id, 1);
    this.showToast("カートに追加しました (¥0)");
  },

  // トースト通知
  showToast(message) {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;
    toast.querySelector(".toast-text").textContent = message;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 2200);
  },

  // 商品詳細モーダルを開く
  openDetail(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    this.selectedProduct = product;

    const modal = document.getElementById("productDetailModal");
    if (!modal) return;

    modal.querySelector(".modal-img-container").innerHTML = getProductImageHtml(product);
    modal.querySelector(".modal-title").textContent = product.title;
    modal.querySelector(".modal-orig-price").textContent = `¥${product.originalPrice.toLocaleString()}`;
    modal.querySelector(".modal-desc").textContent = product.description;
    modal.querySelector(".modal-filename").textContent = product.fileName;
    modal.querySelector(".modal-filesize").textContent = product.fileSize;
    modal.querySelector(".modal-version").textContent = product.version;
    modal.querySelector(".modal-sold").textContent = `${product.soldCount.toLocaleString()}人が入手`;
    modal.querySelector(".modal-stock").textContent = `残り${product.stockLeft}個`;
    modal.querySelector(".modal-rating").innerHTML = `<i class="fa-solid fa-star"></i> ${product.rating} (${product.reviewsCount} 件のレビュー)`;

    // タグ
    const tagsContainer = modal.querySelector(".modal-tags");
    tagsContainer.innerHTML = product.tags.map(t => `<span class="detail-tag">#${t}</span>`).join("");

    // レビュー
    const reviewsContainer = modal.querySelector(".modal-reviews-list");
    reviewsContainer.innerHTML = product.reviews.map(r => `
      <div class="review-item">
        <div class="review-header">
          <div class="review-user"><i class="fa-solid fa-circle-user"></i> ${r.user}</div>
          <div class="review-stars">${"★".repeat(r.rating)}</div>
          <div class="review-date">${r.date}</div>
        </div>
        <div class="review-content">${r.comment}</div>
      </div>
    `).join("");

    modal.classList.add("active");
  },

  closeDetail() {
    const modal = document.getElementById("productDetailModal");
    if (modal) modal.classList.remove("active");
  },

  // 詳細モーダルからカートへ追加
  detailAddToCart() {
    if (!this.selectedProduct) return;
    CartManager.addItem(this.selectedProduct.id, 1);
    this.showToast(`「${this.selectedProduct.title.slice(0, 15)}...」をカートに追加しました`);
  },

  // 詳細モーダルから「今すぐ0円で購入＆DL」
  detailInstantBuy() {
    if (!this.selectedProduct) return;
    const p = this.selectedProduct;
    this.closeDetail();
    this.executeCheckout([p]);
  },

  // カートドロワーのトグル
  toggleCart(open) {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    if (!drawer) return;

    if (open) {
      drawer.classList.add("active");
      if (overlay) overlay.classList.add("active");
      CartManager.renderCartUI();
    } else {
      drawer.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
    }
  },

  // カートの全商品をチェックアウト
  checkoutCart() {
    const items = CartManager.getItems();
    if (items.length === 0) return;

    const productsToDownload = [];
    items.forEach(item => {
      const p = PRODUCTS.find(prod => prod.id === item.id);
      if (p) {
        productsToDownload.push(p);
      }
    });

    this.toggleCart(false);
    this.executeCheckout(productsToDownload);
    CartManager.clear();
  },

  // チェックアウト・購入完了＆ダウンロード処理
  executeCheckout(products) {
    if (!products || products.length === 0) return;

    // 紙吹雪エフェクト (Confetti)
    if (typeof confetti === "function") {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    }

    // ダウンロード開始処理
    this.triggerDownloads(products);

    // 完了モーダル表示
    const modal = document.getElementById("checkoutSuccessModal");
    if (modal) {
      const listContainer = modal.querySelector(".download-links-list");
      listContainer.innerHTML = products.map(p => `
        <div class="download-link-row">
          <div class="dl-info">
            <span class="dl-name">${p.fileName}</span>
            <span class="dl-size">(${p.fileSize}) - ¥0</span>
          </div>
          <a href="${p.downloadUrl}" download="${p.fileName}" class="dl-manual-btn">
            <i class="fa-solid fa-download"></i> 再ダウンロード
          </a>
        </div>
      `).join("");

      modal.classList.add("active");
    }
  },

  // 自動ダウンロードの実行
  triggerDownloads(products) {
    products.forEach((p, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = p.downloadUrl;
        link.download = p.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 400); // 複数アイテムがある場合は少しずらしてブラウザのポップアップブロックを回避
    });
  },

  closeSuccessModal() {
    const modal = document.getElementById("checkoutSuccessModal");
    if (modal) modal.classList.remove("active");
  },

  // TEMUあるある: 画面下部に「○○さんが今¥0で購入しました」をランダム表示
  initFakeNotificationStream() {
    const toast = document.getElementById("liveActivityToast");
    if (!toast) return;

    const names = ["PublicVoic博士", "Binary444ちゃん", "長いAlex", "1つ目のSteveさん", "胴長Steve", "1つ目のXXX"];
    const items = PRODUCTS.map(p => p.title.slice(0, 18) + "...");

    function showRandom() {
      const name = names[Math.floor(Math.random() * names.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      toast.querySelector(".live-text").innerHTML = `<strong>${name}</strong> さんが <strong>${item}</strong> を ¥0 で購入しました`;
      toast.classList.add("active");

      setTimeout(() => {
        toast.classList.remove("active");
      }, 3500);
    }

    setInterval(() => {
      showRandom();
    }, 9000);
  },

  initEventListeners() {
    // 検索窓入力
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.setSearch(e.target.value);
      });
    }

    // モーダルの背景クリックで閉じる
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    });
  }
};
