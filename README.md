# <img src="public/favicon.svg" width="28" alt="logo"/> NiftyScope — Live Nifty 50 Dashboard

<div align="center">

**A real-time Nifty 50 market dashboard powered directly by NSE India's live data feed.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-black?style=for-the-badge)](https://niftyscopeapp.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-NiftyScope-181717?style=for-the-badge&logo=github)](https://github.com/simran-bakshi/NiftyScope)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Data Source](https://img.shields.io/badge/Data-NSE%20India%20Live-0052CC)
![License](https://img.shields.io/badge/License-MIT-22c576)

</div>

---

## 🌐 Live Demo

> 🔗 **[https://your-app.vercel.app](https://niftyscopeapp.vercel.app/)**


---

## ✨ Features

- 📊 **Live Nifty 50 Data** — All 50 stocks with real-time price, change, volume, high/low
- 🔴🟢 **Advances & Declines** — Instant market breadth summary bar
- 🏆 **Top Gainers & Losers** — Top 5 movers updated every 30 seconds
- 🌡️ **Sector Heatmap** — Color-coded visual grid grouped by sector
- 🔃 **Sortable Table** — Click any column to sort ascending/descending
- 🔍 **Search & Filter** — Filter by sector, search by company name or symbol
- ⏱️ **Auto Refresh** — Live countdown timer, refreshes every 30 seconds
- 🟢 **Market Status** — Shows Market Open / Closed based on IST hours
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- ⚡ **No API Key Needed** — Uses NSE India's official public data feed

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| 🖥️ Frontend | Next.js 14 + React 18 | UI rendering, routing |
| ⚙️ Backend | Next.js API Routes | Serverless proxy to NSE |
| 📡 Data Source | NSE India (`stock-nse-india`) | Live market data |
| 🎨 Styling | Pure CSS (dark terminal theme) | Custom design system |
| 🚀 Deployment | Vercel | Zero-config hosting |
| 🔤 Fonts | Syne + DM Mono (Google Fonts) | Trading terminal aesthetic |

---

## 📂 Project Structure

```
NiftyScope/
│
├── 📁 pages/
│   ├── _app.js               # App entry, loads global CSS
│   ├── index.js              # Main dashboard page (route: "/")
│   └── 📁 api/
│       ├── quotes.js         # GET /api/quotes → all 50 stocks live
│       └── index.js          # GET /api/index  → Nifty 50 index level
│
├── 📁 components/
│   ├── MarketHeader.js       # Sticky header with index values + timer
│   ├── SummaryBar.js         # Advances / Declines / Volume strip
│   ├── StockTable.js         # Sortable, filterable main table
│   ├── GainersLosers.js      # Top 5 gainers & losers cards
│   └── HeatMap.js            # Color-coded sector heatmap
│
├── 📁 lib/
│   ├── nifty50symbols.js     # All 50 symbols, names, sectors
│   ├── formatters.js         # ₹ price, volume, % formatting utils
│   └── useMarketData.js      # Custom hook: fetching + 30s polling
│
├── 📁 styles/
│   └── globals.css           # Full dark terminal theme
│
├── package.json
├── next.config.js
├── vercel.json
└── .gitignore
```

---

## 🔄 How It Works

```
┌──────────────┐        ┌─────────────────────┐        ┌──────────────────┐
│              │ fetch  │                     │ fetch  │                  │
│   Browser    │──────► │  Next.js API Route  │──────► │   NSE India      │
│  (React UI)  │        │  /api/quotes        │        │   Official API   │
│              │◄─────  │  (Vercel Serverless)│◄────── │   Live Prices    │
│ Renders table│  JSON  │  Cleans & enriches  │  JSON  │                  │
└──────────────┘        └─────────────────────┘        └──────────────────┘
       ↑
  Re-fetches every 30s
```

**Why a proxy?** NSE blocks direct browser requests (CORS policy). The API route runs server-side on Vercel, fetches from NSE freely, and returns clean JSON to your browser.

**Which API exactly?**
```
https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050
```
NSE India's own official endpoint — the same one their website uses internally. No third-party service, no API key, no rate limits.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ → [nodejs.org](https://nodejs.org)
- Git → [git-scm.com](https://git-scm.com)

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/simran-bakshi/NiftyScope.git
cd NiftyScope

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

> ✅ No `.env` file needed. No API keys. Just clone and run.

---

## ☁️ Deploy to Vercel

### Option 1 — Vercel Dashboard (Recommended)

1. Push code to GitHub ✅
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your `NiftyScope` repository
4. Framework auto-detects as **Next.js**
5. Click **Deploy**
6. 🎉 Live in ~60 seconds

### Option 2 — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📡 API Reference

### `GET /api/quotes`
Returns live data for all 50 Nifty stocks.

```json
{
  "success": true,
  "source": "NSE India",
  "count": 50,
  "indexMeta": {
    "price": 22345.65,
    "change": 123.45,
    "changePct": 0.56
  },
  "data": [
    {
      "symbol": "TCS",
      "name": "TCS",
      "sector": "IT",
      "price": 3456.75,
      "change": 23.45,
      "changePct": 0.68,
      "volume": 1234567,
      "high": 3470.00,
      "low": 3420.50,
      "prevClose": 3433.30
    }
  ]
}
```

### `GET /api/index`
Returns Nifty 50 and Bank Nifty index levels.

---

## ⚠️ Disclaimer

> This dashboard is built for **educational purposes only**.
> Data is sourced from NSE India's public endpoints.
> Not intended as financial advice. Always verify on official sources before making investment decisions.

---

## 👩‍💻 Author

**Simran Bakshi**

[![GitHub](https://img.shields.io/badge/GitHub-simran--bakshi-181717?logo=github&style=flat-square)](https://github.com/simran-bakshi)

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ and ☕ &nbsp;|&nbsp; Data by 📊 NSE India

⭐ **Star this repo if you found it helpful!**

</div>
