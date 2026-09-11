// MINETEMU 商品データ定義
// ユーザーはこのファイルを編集するだけで商品や配布ファイルを簡単に追加・差し替えできます。

const PRODUCTS = [
  {
    id: "CM4",
    title: "XiAoMiProMax",
    category: "ノロクラ",
    badge: "CreepyWeeb",
    badgeType: "sale",
    originalPrice: 999999,
    price: 0,
    discount: "100% OFF",
    soldCount: 999999,
    stockLeft: 1,
    rating: 5,
    reviewsCount: 999999,
    freeShipping: true,
    description: "???",
    tags: ["CreepyMinecraftVersion", "ノロクラ"],
    downloadUrl: "downloads/XiAoMiProMax.zip",
    fileName: "XiAoMiProMax",
    fileSize: "10MB",
    version: "1.0.0",
    reviews: [
      { user: "YCM_Staff", rating: 5, date: "3秒前", comment: "?" }
    ]
  }
];

// カテゴリ一覧
const CATEGORIES = [
  { id: "ノロクラ", name: "ノロクラ", icon: "fa-globe" }
];
