# MINETEMU (Minecraft_Temu) 🛒✨

**GitHub Pages対応！TEMU風 0円ショッピング型ファイルダウンロードサイト**

「億万長者気分でお買い物（全品¥0）」をテーマにした、TEMUパロディUIのMinecraftファイル（MOD、データパック、リソースパック、配布マップなど）配布用Webサイトです。

ユーザーは通常のECサイトのように商品をカートに入れ、「¥0で注文を確定」すると紙吹雪演出とともにブラウザから直接ファイルが自動ダウンロードされます。

---

## 🌟 主な機能・特徴

1. **TEMU名物ギミック完全再現**:
   - オレンジ基調の爆安ショッピングUI
   - カウントダウンタイマー付き「24時間限定フラッシュセール」
   - 「100% OFF」「¥9,800 → ¥0」「残り2個」「98%が購入」などの誘導演出
   - 画面左下にランダム表示される「○○さんが¥0で購入しました」リアルタイム通知
   - 初回訪問時の「確定100%OFF ラッキースピン（ルーレット）」
2. **0円ショッピング & 即時ダウンロード**:
   - カートへの追加・数量変更・削除（ローカルストレージ保持）
   - 「¥0で注文を確定」ボタンで豪華な紙吹雪（Confetti）が舞い、登録されたファイルが自動ダウンロード
   - ポップアップブロッカー対策として、注文完了モーダル内に手動再ダウンロードボタンを完備
3. **GitHub Pages 完全対応**:
   - ビルド（npm build）一切不要の純粋なHTML/CSS/JS構成
   - 相対パス設計により、`https://<ユーザー名>.github.io/Minecraft_Temu/` などのサブディレクトリでも完全動作

---

## 🚀 GitHub Pages での公開手順 (約1分)

1. このリポジトリの変更をコミットして GitHub にプッシュします。
   ```bash
   git add .
   git commit -m "feat: MINETEMU 0円ダウンロードサイト完成"
   git push origin main
   ```
2. GitHubのリポジトリページを開き、**Settings** タブをクリック。
3. 左サイドバーの **Pages** を選択。
4. **Build and deployment** の設定：
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)` を選択して **Save**
5. 数十秒〜1分ほど待つと、上部に公開URL（例: `https://<あなたのユーザー名>.github.io/Minecraft_Temu/`）が表示されます！

---

## 🛠️ 配布ファイルや商品の追加・変更方法

### 1. 配布したいファイルを配置
`downloads/` フォルダの中に、配布したいMOD、データパック、zipファイルなどを保存します。
（※ Google DriveやDropbox、GitHub Releasesなどの外部直リンクURLを指定することも可能です）

### 2. `js/products.js` を編集
`js/products.js` の `PRODUCTS` 配列に商品情報を追加または編集します。

```javascript
{
  id: "my-custom-mod",
  title: "【自作】超便利アイテム追加MOD",
  category: "mods",            // 'mods', 'datapacks', 'textures', 'worlds'
  badge: "新作",
  badgeType: "hot",           // 'hot', 'sale', 'warn'
  originalPrice: 15800,       // 定価（¥0への割引前価格）
  price: 0,                   // 実際の購入金額（0円）
  soldCount: 1200,            // 見た目の販売数
  stockLeft: 3,               // 残り在庫数
  rating: 5.0,
  reviewsCount: 420,
  description: "ここにMODの説明文を書きます。",
  tags: ["MOD", "便利", "1.20+"],
  downloadUrl: "downloads/my_mod.zip", // ダウンロード対象ファイル
  fileName: "My_Custom_Mod_v1.0.zip", // 保存時のファイル名
  fileSize: "2.4 MB",
  version: "1.20.1",
  iconSvg: `...`,            // SVGアイコン
  reviews: [ ... ]
}
```

---

## 📁 ディレクトリ構造

```
Minecraft_Temu/
├── index.html            # メインページ
├── css/
│   ├── style.css         # TEMU風デザインシステム
│   └── animations.css    # 各種キーフレームアニメーション
├── js/
│   ├── products.js       # 商品一覧データ設定ファイル（★ここを編集）
│   ├── cart.js           # カート管理モジュール
│   ├── roulette.js       # ルーレット（ラッキースピン）演出
│   └── app.js            # メインUIロジック・ダウンロード処理
├── downloads/            # 配布用ファイル格納場所
│   └── sample_pack.txt   # サンプルファイル
└── README.md             # 本ドキュメント
```
