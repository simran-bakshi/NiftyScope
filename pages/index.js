/**
 * Main Dashboard Page: pages/index.js
 *
 * This is the entry point of the app. Next.js treats files in /pages
 * as routes. This file = the "/" root route.
 *
 * Layout:
 * ┌─────────────────────────────────┐
 * │ MarketHeader (top bar)          │
 * ├─────────────────────────────────┤
 * │ SummaryBar (A/D stats)          │
 * ├─────────────────────────────────┤
 * │ GainersLosers │  HeatMap        │
 * ├─────────────────────────────────┤
 * │ StockTable (full Nifty 50)      │
 * └─────────────────────────────────┘
 */

import Head from 'next/head';
import { useMarketData } from '../lib/useMarketData';
import MarketHeader from '../components/MarketHeader';
import SummaryBar from '../components/SummaryBar';
import StockTable from '../components/StockTable';
import GainersLosers from '../components/GainersLosers';
import HeatMap from '../components/HeatMap';

export default function Dashboard() {
  const {
    quotes,
    indexData,
    loading,
    error,
    lastUpdated,
    countdown,
    gainers,
    losers,
    advancers,
    decliners,
    unchanged,
    refresh,
  } = useMarketData();

  return (
    <>
      <Head>
        <title>NiftyScope — Live Nifty 50 Dashboard</title>
        <meta name="description" content="Live Nifty 50 trading data dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Google Fonts - Syne for headings, DM Mono for numbers */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="app">
        <MarketHeader
          indexData={indexData}
          lastUpdated={lastUpdated}
          countdown={countdown}
          onRefresh={refresh}
          loading={loading}
        />

        <main className="main-content">
          {error && (
            <div className="error-banner">
              ⚠ {error} — showing last cached data. Retrying automatically.
            </div>
          )}

          <SummaryBar
            advancers={advancers}
            decliners={decliners}
            unchanged={unchanged}
            quotes={quotes}
            gainers={gainers}
            losers={losers}
          />

          <div className="mid-grid">
            <GainersLosers gainers={gainers} losers={losers} />
            <HeatMap quotes={quotes} />
          </div>

          <StockTable quotes={quotes} loading={loading} />
        </main>

        <footer className="footer">
          <p>
            Data sourced from Yahoo Finance · Updates every 30 seconds · For informational purposes
            only · Not financial advice
          </p>
        </footer>
      </div>
    </>
  );
}
