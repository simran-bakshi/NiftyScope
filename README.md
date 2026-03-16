# NiftyScope — Live Nifty 50 Trading Dashboard

A real-time Nifty 50 market data dashboard built with Next.js, deployed on Vercel.

---

## Live Demo
> Deploy to Vercel and paste your link here

## GitHub
> Paste your GitHub repo link here

---

## What This App Does

- Displays live prices, change, % change, volume, high/low for all 50 Nifty stocks
- Shows Nifty 50 and Sensex index levels in the header
- Auto-refreshes every 30 seconds with a live countdown timer
- Heatmap view grouped by sector
- Top 5 Gainers and Top 5 Losers sidebar
- Sortable table (click any column header)
- Filter by sector, search by company name or symbol
- Market open/closed indicator (IST hours)
- Responsive — works on mobile

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (React) | File-based routing, SSR, API routes in one repo |
| Backend | Next.js API Routes (Serverless) | Acts as a proxy — avoids CORS, no separate server needed |
| Data Source | Yahoo Finance v7 API | Free, no auth key required, covers all NSE stocks |
| Deployment | Vercel | Native Next.js support, zero-config deploy |
| Fonts | Google Fonts (Syne + DM Mono) | Trading terminal aesthetic |

---

## Project Structure

```
nifty-dashboard/
│
├── pages/                      ← Next.js routing (each file = a URL)
│   ├── _app.js                 ← Wraps all pages, imports global CSS
│   ├── index.js                ← Main dashboard page (route: "/")
│   └── api/                    ← Backend API routes (serverless functions)
│       ├── quotes.js           ← GET /api/quotes  → all 50 stock quotes
│       └── index.js            ← GET /api/index   → Nifty 50 & Sensex index
│
├── components/                 ← Reusable UI components
│   ├── MarketHeader.js         ← Top sticky header with index values
│   ├── SummaryBar.js           ← Advance/Decline stats bar
│   ├── StockTable.js           ← Main sortable/filterable stock table
│   ├── GainersLosers.js        ← Top 5 gainers and losers cards
│   └── HeatMap.js              ← Color-coded sector heatmap
│
├── lib/                        ← Shared logic (no UI)
│   ├── nifty50symbols.js       ← All 50 NSE symbols + names + sectors
│   ├── formatters.js           ← Number/currency/volume formatting utils
│   └── useMarketData.js        ← Custom React hook: fetching + polling
│
├── styles/
│   └── globals.css             ← All styles (dark terminal theme)
│
├── public/                     ← Static assets (favicon etc.)
├── package.json
├── next.config.js
├── vercel.json                 ← Vercel deployment config
└── .gitignore
```

---

## How the Data Flow Works

```
Browser (React UI)
      │
      │  fetch('/api/quotes')  every 30s
      ▼
Next.js API Route (/pages/api/quotes.js)   ← runs on Vercel's servers
      │
      │  fetch Yahoo Finance v7 API
      │  (server-to-server, no CORS issue)
      ▼
Yahoo Finance API
https://query1.finance.yahoo.com/v7/finance/quote?symbols=TCS.NS,INFY.NS,...
      │
      │  returns raw JSON with price, change, volume etc.
      ▼
API Route enriches data (adds sector, display name, formats)
      │
      ▼
Browser receives clean JSON → React state → renders table
```

**Why the proxy pattern?**
Yahoo Finance blocks direct browser requests (CORS policy). By routing through our own API endpoint, the request comes from a server (Vercel), which Yahoo allows.

---

## How Auto-Refresh Works

In `lib/useMarketData.js`:

```js
// Fetch on mount, then every 30 seconds
useEffect(() => {
  fetchAll();  // immediate first fetch
  
  const interval = setInterval(fetchAll, 30000);
  return () => clearInterval(interval);  // cleanup on unmount
}, []);
```

A countdown timer in the header shows seconds until the next refresh. The user can also click the ↻ button to refresh manually at any time.

---

## Local Development Setup

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- npm (comes with Node.js)
- Git

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/nifty-dashboard.git
cd nifty-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

That's it — no `.env` file, no API keys, no database setup needed.

---

## Deployment on Vercel

### Method 1: Vercel Dashboard (Recommended — easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
3. Click **"Add New Project"**
4. Select your `nifty-dashboard` repository
5. Framework will auto-detect as **Next.js**
6. Click **Deploy**
7. Done — you get a `https://your-app.vercel.app` URL

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Pushing to GitHub

```bash
# Inside your project folder
git init
git add .
git commit -m "Initial commit: Nifty 50 live dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nifty-dashboard.git
git push -u origin main
```

---

## API Endpoints

### `GET /api/quotes`

Returns live data for all 50 Nifty stocks.

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "count": 50,
  "data": [
    {
      "symbol": "TCS.NS",
      "displaySymbol": "TCS",
      "name": "TCS",
      "sector": "IT",
      "price": 3456.75,
      "change": 23.45,
      "changePct": 0.68,
      "volume": 1234567,
      "high": 3470.00,
      "low": 3420.50,
      "open": 3430.00,
      "prevClose": 3433.30,
      "week52High": 4255.00,
      "week52Low": 3056.05,
      "marketCap": 1254000000000
    }
  ]
}
```

### `GET /api/index`

Returns Nifty 50 and Sensex index levels.

**Response:**
```json
{
  "success": true,
  "nifty": {
    "price": 22345.65,
    "change": 123.45,
    "changePct": 0.56,
    "high": 22400.00,
    "low": 22200.00,
    "prevClose": 22222.20
  },
  "sensex": {
    "price": 73456.78,
    "change": 345.67,
    "changePct": 0.47,
    "prevClose": 73111.11
  }
}
```

---

## Key Concepts Explained

### Next.js API Routes
Files inside `pages/api/` automatically become HTTP endpoints. `pages/api/quotes.js` → `GET /api/quotes`. No Express, no separate server, just a file.

### React Custom Hook
`useMarketData.js` is a custom hook that packages all the fetching, polling, and state logic together. Any component can call `const { quotes, loading } = useMarketData()` without caring how the data is fetched.

### Serverless Functions
On Vercel, `pages/api/*.js` files run as AWS Lambda functions. They spin up on request, run, and shut down. No always-on server cost.

### `useMemo` for Performance
Filtering and sorting 50 stocks on every keystroke would be slow. `useMemo` caches the result and only recalculates when dependencies (`quotes`, `sortKey`, `search`, etc.) actually change.

---

## Known Limitations

- Yahoo Finance is an unofficial API — it may occasionally be slow or return errors
- Data has a ~15 second delay from actual market (Yahoo Finance limitation)
- Pre-market and after-market data may differ from official NSE data
- NSE does not have a free official public API

---

## Possible Improvements

- [ ] Add a candlestick chart for individual stocks (using `recharts` or `lightweight-charts`)
- [ ] Add portfolio tracker (localStorage)
- [ ] WebSocket-based real-time updates
- [ ] Add alerts when a stock moves > X%
- [ ] PWA support for mobile home screen

---

## License
MIT — free to use, modify, and submit for assignments.
