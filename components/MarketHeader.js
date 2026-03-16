/**
 * MarketHeader Component
 *
 * Displays the top banner with:
 * - Nifty 50 and Sensex index values
 * - Market status (open/closed)
 * - Last updated time
 * - Auto-refresh countdown
 * - Manual refresh button
 */

import { formatPrice, formatChange, formatChangePct, colorClass } from '../lib/formatters';

// NSE market hours: 9:15 AM - 3:30 PM IST, Mon-Fri
function isMarketOpen() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay(); // 0=Sun, 6=Sat
  const hour = ist.getHours();
  const min = ist.getMinutes();
  const timeInMin = hour * 60 + min;
  if (day === 0 || day === 6) return false;
  return timeInMin >= 9 * 60 + 15 && timeInMin <= 15 * 60 + 30;
}

export default function MarketHeader({ indexData, lastUpdated, countdown, onRefresh, loading }) {
  const marketOpen = isMarketOpen();
  const nifty = indexData?.nifty;
  const sensex = indexData?.sensex;

  return (
    <header className="market-header">
      <div className="header-brand">
        <div className="brand-logo">
          <span className="logo-icon">◈</span>
          <div>
            <h1 className="brand-name">NiftyScope</h1>
            <p className="brand-sub">Live Market Dashboard</p>
          </div>
        </div>
        <div className={`market-status ${marketOpen ? 'open' : 'closed'}`}>
          <span className="status-dot" />
          {marketOpen ? 'Market Open' : 'Market Closed'}
        </div>
      </div>

      <div className="index-cards">
        {/* Nifty 50 Card */}
        <div className="index-card">
          <span className="index-label">NIFTY 50</span>
          <span className="index-price">
            {nifty ? formatPrice(nifty.price) : '—'}
          </span>
          <span className={`index-change ${nifty ? colorClass(nifty.change) : ''}`}>
            {nifty ? `${formatChange(nifty.change)} (${formatChangePct(nifty.changePct)})` : '—'}
          </span>
        </div>

        {/* Sensex Card */}
        <div className="index-card">
          <span className="index-label">SENSEX</span>
          <span className="index-price">
            {sensex ? formatPrice(sensex.price) : '—'}
          </span>
          <span className={`index-change ${sensex ? colorClass(sensex.change) : ''}`}>
            {sensex ? `${formatChange(sensex.change)} (${formatChangePct(sensex.changePct)})` : '—'}
          </span>
        </div>
      </div>

      <div className="header-controls">
        {lastUpdated && (
          <div className="last-updated">
            <span className="updated-label">Updated</span>
            <span className="updated-time">
              {lastUpdated.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
        )}
        <button
          className={`refresh-btn ${loading ? 'spinning' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh now"
        >
          <span className="refresh-icon">↻</span>
          <span className="refresh-countdown">{countdown}s</span>
        </button>
      </div>
    </header>
  );
}
