# 🧧 Lì Xì Tết - Trò Chơi Lắc Lì Xì Online

**🇻🇳 [Tiếng Việt](#-tiếng-việt) | 🇬🇧 [English](#-english) | 🇯🇵 [日本語](#-日本語)**

---

## 🇻🇳 Tiếng Việt

Ứng dụng web tương tác (gamification) cho phép người dùng **lắc điện thoại** để nhận bao lì xì Tết. Xây dựng bằng Next.js, có hiệu ứng đẹp mắt và hỗ trợ cả desktop lẫn mobile.

> 🎮 **Luồng chơi:** Mở thiệp → Lắc/chạm để bao lì xì rơi → Trả lời quiz → Nhận thưởng tiền thật

### ✨ Tính Năng

- 🌸 **Cành mai treo bao lì xì** — Cành mai vàng trên nền gradient đỏ đậm, 3 bao lì xì treo lắc lư
- 📱 **Lắc điện thoại** hoặc **chạm màn hình** để bao lì xì rơi xuống
- ❓ **Trả lời câu hỏi** để mở niêm phong bao lì xì
- 💰 **Phong bao nằm ngang** với tờ tiền thật (5.000đ / 10.000đ) trượt ra kèm lời chúc Tết
- 🎆 Hiệu ứng pháo hoa (confetti) khi nhận thưởng
- 🔒 Mỗi thiết bị chỉ chơi được 1 lần (tránh gian lận)
- 📋 Thu thập thông tin ngân hàng để chuyển khoản thật

### 🚀 Cài Đặt & Chạy Thử

**Yêu cầu:** [Node.js](https://nodejs.org/) phiên bản 18+

```bash
# 1. Tải mã nguồn
git clone https://github.com/TEN-BAN/li-xi-tet-gamification.git
cd li-xi-tet-gamification

# 2. Cài đặt thư viện
npm install

# 3. Cấu hình biến môi trường
cp .env.example .env.local
# Mở .env.local → dán link Google Apps Script Web App của bạn vào NEXT_PUBLIC_SCRIPT_URL

# 4. Chạy ứng dụng
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

> 💡 **Mẹo:** Test trên điện thoại bằng cách kết nối cùng WiFi → truy cập `http://192.168.1.xxx:3000`

### 📤 Upload Lên GitHub

```bash
git init
git add .
git commit -m "Lì xì Tết gamification - phiên bản đầu tiên"
git branch -M main
git remote add origin https://github.com/TEN-BAN/li-xi-tet-gamification.git
git push -u origin main
```

### 🌐 Triển Khai Online (Deploy)

**Vercel (Khuyên dùng):**
1. Đăng ký tại [vercel.com](https://vercel.com)
2. **Import Project** → chọn repo GitHub → **Deploy**
3. Nhận link `https://ten-project.vercel.app`

**Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build && firebase deploy
```

### 🛠️ Tùy Chỉnh

| Mục | Cách làm |
|---|---|
| **Câu hỏi quiz** | Sửa mảng `QUESTIONS` trong `components/LixiGame.tsx` (~dòng 16) |
| **Mức thưởng** | Sửa `rewardAmount` (~dòng 136): `score >= 80 ? 10000 : 5000` |
| **Ảnh tiền** | Thay file `public/5000.png` và `public/10000.png` |
| **Lời chúc Tết** | Tìm phần `Chúc Mừng Năm Mới` trong screen `reward` |
| **Google Sheets** | Tạo `.env.local` từ `.env.example`, dán link Google Apps Script |

### 📁 Cấu Trúc Thư Mục

```
lì-xì-tết-gamification/
├── app/
│   ├── page.tsx          ← Wrapper (dynamic import, không SSR)
│   ├── layout.tsx        ← Bố cục trang + metadata
│   └── globals.css       ← CSS toàn cục
├── components/
│   └── LixiGame.tsx      ← Toàn bộ game logic (client-only)
├── public/
│   ├── 5000.png          ← Ảnh tờ 5.000đ
│   ├── 10000.png         ← Ảnh tờ 10.000đ
│   ├── cành mai.png      ← Ảnh cành mai vàng
│   └── bao lì xi.png    ← Ảnh bao lì xì đỏ
├── .env.example          ← Mẫu biến môi trường
├── .env.local            ← Link Apps Script thực tế (KHÔNG push lên Git)
├── package.json
└── README.md
```

---

## 🇬🇧 English

An interactive web gamification app where users **shake their phone** to receive a Tết (Vietnamese Lunar New Year) lucky money envelope. Built with Next.js, featuring beautiful animations for both desktop and mobile.

> 🎮 **Flow:** Open card → Shake/tap to drop envelope → Answer quiz → Receive real money reward

### ✨ Features

- 🌸 **Mai blossom branch with hanging red envelopes** — golden branch on dark gradient background, 3 swaying envelopes
- 📱 **Shake phone** or **tap screen** to trigger envelope drop
- ❓ **Answer quiz questions** to unseal the lucky envelope
- 💰 **Horizontal envelope** with real money bill image (5,000₫ / 10,000₫) sliding out + New Year blessing
- 🎆 Confetti celebration effect
- 🔒 One play per device (anti-cheat)
- 📋 Collects banking info for real money transfer

### 🚀 Setup & Run

**Requires:** [Node.js](https://nodejs.org/) v18+

```bash
git clone https://github.com/YOUR-NAME/li-xi-tet-gamification.git
cd li-xi-tet-gamification
npm install
cp .env.example .env.local
# Edit .env.local → paste your Google Apps Script Web App URL into NEXT_PUBLIC_SCRIPT_URL
npm run dev
```

Open browser: **http://localhost:3000**

### 🌐 Deploy

**Vercel (Recommended):**
1. Sign up at [vercel.com](https://vercel.com)
2. **Import Project** → select GitHub repo → **Deploy**
3. Get your link: `https://project-name.vercel.app`

### 🛠️ Customization

| Item | How |
|---|---|
| **Quiz questions** | Edit `QUESTIONS` array in `components/LixiGame.tsx` (~line 16) |
| **Reward amounts** | Edit `rewardAmount` (~line 136): `score >= 80 ? 10000 : 5000` |
| **Money images** | Replace `public/5000.png` and `public/10000.png` |
| **Blessing text** | Find `Chúc Mừng Năm Mới` in `reward` screen section |
| **Google Sheets** | Create `.env.local` from `.env.example`, paste your Apps Script URL |

---

## 🇯🇵 日本語

**テト（旧正月）のお年玉ゲーム** — スマートフォンを振ってお年玉袋を受け取るインタラクティブなWebアプリです。Next.jsで構築され、美しいアニメーションでデスクトップ・モバイル両対応。

> 🎮 **フロー:** カードを開く → 振る/タップで封筒が落ちる → クイズに答える → 本物のお金の報酬を受け取る

### ✨ 機能

- 🌸 **梅の枝に吊るされたお年玉袋** — ダークグラデーション背景に金色の梅の枝、3つの揺れる赤い封筒
- 📱 **スマホを振る**か**画面をタップ**でお年玉袋が落下
- ❓ **クイズに答えて**封筒の封を解く
- 💰 **横向きの封筒**からリアルなお札画像（5,000₫ / 10,000₫）がスライドアウト＋新年の挨拶
- 🎆 紙吹雪のお祝いエフェクト
- 🔒 1デバイス1回のみプレイ可能（不正防止）
- 📋 送金用の銀行情報を収集

### 🚀 セットアップ＆実行

**必要環境:** [Node.js](https://nodejs.org/) v18以上

```bash
git clone https://github.com/YOUR-NAME/li-xi-tet-gamification.git
cd li-xi-tet-gamification
npm install
cp .env.example .env.local
# .env.localを編集 → NEXT_PUBLIC_SCRIPT_URLにGoogle Apps Script Web App URLを貼り付け
npm run dev
```

ブラウザで開く: **http://localhost:3000**

### 🌐 デプロイ

**Vercel（推奨）:**
1. [vercel.com](https://vercel.com) でアカウント登録
2. **Import Project** → GitHubリポジトリを選択 → **Deploy**
3. リンクを取得: `https://project-name.vercel.app`

### 🛠️ カスタマイズ

| 項目 | 方法 |
|---|---|
| **クイズの質問** | `components/LixiGame.tsx`の`QUESTIONS`配列を編集（〜16行目） |
| **報酬額** | `rewardAmount`を編集（〜136行目）: `score >= 80 ? 10000 : 5000` |
| **お金の画像** | `public/5000.png`と`public/10000.png`を差し替え |
| **お祝いメッセージ** | `reward`画面の`Chúc Mừng Năm Mới`部分を変更 |
| **Google Sheets** | `.env.example`から`.env.local`を作成、Apps Script URLを設定 |

---

## 📝 Tech Stack / Công Nghệ / 技術スタック

| | |
|---|---|
| **Next.js 15** | React Framework |
| **TailwindCSS 4** | Utility-first CSS |
| **Motion** | Animation library |
| **canvas-confetti** | Confetti effects |
| **Lucide React** | Icon library |

## ⚖️ License / Giấy Phép / ライセンス

Open source — free to use and modify. Please credit the original source if redistributing.

Mã nguồn mở — tự do sử dụng và chỉnh sửa. Vui lòng ghi nguồn nếu chia sẻ lại.

オープンソース — 自由に使用・改変可能。再配布の際は出典を明記してください。
