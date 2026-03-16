/**
 * GainersLosers Component
 *
 * Side-by-side cards showing top 5 gainers and top 5 losers of the day.
 * Quick visual summary of who's winning and who's not.
 */

import { formatPrice, formatChangePct } from '../lib/formatters';

function StockMiniRow({ stock, rank }) {
  const isPositive = stock.changePct >= 0;
  return (
    <div className="mini-row">
      <span className="mini-rank">{rank}</span>
      <div className="mini-info">
        <span className="mini-symbol">{stock.displaySymbol}</span>
        <span className="mini-sector">{stock.sector}</span>
      </div>
      <div className="mini-right">
        <span className="mini-price">₹{formatPrice(stock.price)}</span>
        <span className={`mini-pct ${isPositive ? 'positive' : 'negative'}`}>
          {formatChangePct(stock.changePct)}
        </span>
      </div>
    </div>
  );
}

export default function GainersLosers({ gainers, losers }) {
  return (
    <div className="gl-grid">
      <div className="gl-card">
        <div className="gl-header gainers-header">
          <span className="gl-icon">▲</span>
          <h3>Top Gainers</h3>
        </div>
        <div className="gl-body">
          {gainers.length === 0 ? (
            <p className="gl-empty">No gainers yet</p>
          ) : (
            gainers.map((s, i) => <StockMiniRow key={s.symbol} stock={s} rank={i + 1} />)
          )}
        </div>
      </div>

      <div className="gl-card">
        <div className="gl-header losers-header">
          <span className="gl-icon">▼</span>
          <h3>Top Losers</h3>
        </div>
        <div className="gl-body">
          {losers.length === 0 ? (
            <p className="gl-empty">No losers yet</p>
          ) : (
            losers.map((s, i) => <StockMiniRow key={s.symbol} stock={s} rank={i + 1} />)
          )}
        </div>
      </div>
    </div>
  );
}
