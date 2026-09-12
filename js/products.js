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
    fileName: "XiAoMiProMax.zip",
    fileSize: "10MB",
    version: "1.0.0",
    reviews: [
      { user: "YCM_Staff", rating: 5, date: "3秒前", comment: "Sugosugiru" },
      { user: "魔理沙", rating: 1, date: "823万年前", comment: "ウイルスだろこれ" },
      { user: "フラン", rating: 2, date: "99999999年前", comment: "なんかウイルスに感染したとか出てくるんだけどーナニコレー" },
      { user: "れない食べたい", rating: 4, date: "-1000000000000000000年前", comment: "こういうのが欲しかった" },
      { user: "PV博士", rating: 5, date: "10日前", comment: "呪いではなくね？" }
    ]
  },
  {
    id: "ZipPatch",
    title: "XiAoMiProMaxクライアントパッチ",
    category: "ノロクラ変更箇所のみ",
    badge: "YCM",
    badgeType: "sale",
    originalPrice: 888888,
    price: 0,
    discount: "100% OFF",
    soldCount: 888888,
    stockLeft: 1,
    rating: 5,
    reviewsCount: 888888,
    freeShipping: true,
    description: "YCMが作成したノロクラ変更箇所のみのデータです。",
    tags: ["CreepyMinecraftVersionPatch", "ノロクラパッチ"],
    downloadUrl: "downloads/XiAoMiProMax_Client_Patch.zip",
    fileName: "XiAoMiProMax_Client_Patch.zip",
    fileSize: "9MB",
    version: "1.0.0",
    reviews: [
      { user: "CreepyWeeb", rating: 1, date: "100年前", comment: "どうやって動かすの？" }
    ]
  },
  {
    id: "CodePatch",
    title: "ソースコードの変更箇所のみのパッチ",
    category: "ソースコード",
    badge: "YCM",
    badgeType: "sale",
    originalPrice: 666666,
    price: 0,
    discount: "100% OFF",
    soldCount: 666666,
    stockLeft: 1,
    rating: 5,
    reviewsCount: 666666,
    freeShipping: true,
    description: "変更箇所のソースコードのパッチです。",
    tags: ["CreepyMinecraftVersion", "ソースコード"],
    downloadUrl: "downloads/client.patch",
    fileName: "client.patch",
    fileSize: "300KB",
    version: "1.0.0",
    reviews: [
      { user: "Li**s", rating: 1, date: "1日前", comment: "こんなぐちゃぐちゃなコード書いて恥ずかしくないのか？？？？？？？？？" }
    ]
  },
  {
    id: "resource",
    title: "リソース",
    category: "リソース",
    badge: "YCM",
    badgeType: "sale",
    originalPrice: 1334,
    price: 0,
    discount: "100% OFF",
    soldCount: 1334,
    stockLeft: 1,
    rating: 5,
    reviewsCount: 1334,
    freeShipping: true,
    description: "素材などのリソースです。",
    tags: ["CreepyMinecraftVersion", "利用素材"],
    downloadUrl: "downloads/XiAoMiProMax_resource.zip",
    fileName: "XiAoMiProMax_resource.zip",
    fileSize: "10MB",
    version: "1.0.0",
    reviews: [
      { user: "霊夢", rating: 4, date: "12日前", comment: "あの人がテクスチャ作りに協力したのか..." }
    ]
  }
];

// カテゴリ一覧
const CATEGORIES = [
  { id: "ノロクラ", name: "ノロクラ", icon: "fa-globe" }
];
