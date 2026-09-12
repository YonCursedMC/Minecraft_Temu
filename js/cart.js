// MINETEMU カート管理モジュール
const CartManager = {
  CART_KEY: "minetemu_cart_v1",

  // カートアイテム取得: [{ id, count }]
  getItems() {
    try {
      const data = localStorage.getItem(this.CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load cart", e);
      return [];
    }
  },

  // カート保存
  saveItems(items) {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(items));
      this.updateCartBadge();
      this.renderCartUI();
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items } }));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  },

  // カートに追加
  addItem(productId, quantity = 1) {
    const items = this.getItems();
    const existing = items.find(item => item.id === productId);

    if (existing) {
      existing.count += quantity;
    } else {
      items.push({ id: productId, count: quantity });
    }

    this.saveItems(items);
    this.playCartBounceAnimation();
  },

  // 数量更新
  updateCount(productId, count) {
    let items = this.getItems();
    if (count <= 0) {
      items = items.filter(item => item.id !== productId);
    } else {
      const item = items.find(i => i.id === productId);
      if (item) item.count = count;
    }
    this.saveItems(items);
  },

  // カートから削除
  removeItem(productId) {
    const items = this.getItems().filter(item => item.id !== productId);
    this.saveItems(items);
  },

  // カートを空にする
  clear() {
    this.saveItems([]);
  },

  // 合計個数
  getTotalCount() {
    return this.getItems().reduce((sum, item) => sum + item.count, 0);
  },

  // 元値の合計（おトク感の演出用）
  getOriginalTotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return sum + (product ? product.originalPrice * item.count : 0);
    }, 0);
  },

  // カートバッジの更新
  updateCartBadge() {
    const badges = document.querySelectorAll(".cart-count-badge");
    const count = this.getTotalCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });
  },

  // カートアイコンのアニメーション
  playCartBounceAnimation() {
    const cartIcons = document.querySelectorAll(".header-cart-btn");
    cartIcons.forEach(btn => {
      btn.classList.remove("cart-bounce");
      void btn.offsetWidth; // reflow
      btn.classList.add("cart-bounce");
    });
  },

  // カートドロワーのレンダリング
  renderCartUI() {
    const listContainer = document.getElementById("cartItemsList");
    const totalOriginalEl = document.getElementById("cartOriginalTotal");
    const cartSavingsEl = document.getElementById("cartSavings");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const emptyState = document.getElementById("cartEmptyState");

    if (!listContainer) return;

    const items = this.getItems();

    if (items.length === 0) {
      listContainer.innerHTML = "";
      if (emptyState) emptyState.style.display = "flex";
      if (checkoutBtn) checkoutBtn.disabled = true;
      if (totalOriginalEl) totalOriginalEl.textContent = "¥0";
      if (cartSavingsEl) cartSavingsEl.textContent = "¥0";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (checkoutBtn) checkoutBtn.disabled = false;

    const originalTotal = this.getOriginalTotal();
    if (totalOriginalEl) totalOriginalEl.textContent = `¥${originalTotal.toLocaleString()}`;
    if (cartSavingsEl) cartSavingsEl.textContent = `¥${originalTotal.toLocaleString()} おトク! (100% OFF)`;

    listContainer.innerHTML = items.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return "";

      return `
        <div class="cart-item" data-id="${product.id}">
          <div class="cart-item-img">
            ${getProductImageHtml(product)}
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-title">${product.title}</h4>
            <div class="cart-item-price-row">
              <span class="cart-current-price">¥0</span>
              <span class="cart-original-price">¥${product.originalPrice.toLocaleString()}</span>
              <span class="cart-discount-tag">100% OFF</span>
            </div>
            <div class="cart-item-file-info">
              <i class="fa-solid fa-file-arrow-down"></i> ${product.fileName} (${product.fileSize})
            </div>
            <div class="cart-item-actions">
              <div class="qty-control">
                <button type="button" class="qty-btn" onclick="CartManager.updateCount('${product.id}', ${item.count - 1})">-</button>
                <span class="qty-num">${item.count}</span>
                <button type="button" class="qty-btn" onclick="CartManager.updateCount('${product.id}', ${item.count + 1})">+</button>
              </div>
              <button type="button" class="cart-remove-btn" onclick="CartManager.removeItem('${product.id}')" title="削除">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
};
