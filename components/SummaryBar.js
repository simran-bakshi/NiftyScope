/**
 * SummaryBar Component
 *
 * Shows aggregate market statistics:
 * - Advances vs Declines
 * - Total volume traded
 * - Top gainer and loser highlights
 */

import { formatChangePct, formatVolume } from '../lib/formatters';

export default function SummaryBar({ advancers, decliners, unchanged, quotes, gainers, losers }) {
  const totalVolume = quotes.reduce((sum, q) => sum + (q.volume || 0), 0);
  const topGainer = gainers[0];
  const topLoser = losers[0];

  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">Advances</span>
        <span className="summary-value positive">{advancers}</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-item">
        <span className="summary-label">Declines</span>
        <span className="summary-value negative">{decliners}</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-item">
        <span className="summary-label">Unchanged</span>
        <span className="summary-value neutral">{unchanged}</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-item">
        <span className="summary-label">Total Volume</span>
        <span className="summary-value">{formatVolume(totalVolume)}</span>
      </div>
      {topGainer && (
        <>
          <div className="summary-divider" />
          <div className="summary-item">
            <span className="summary-label">Top Gainer</span>
            <span className="summary-value">
              <span className="highlight-symbol">{topGainer.displaySymbol}</span>
              <span className="positive"> {formatChangePct(topGainer.changePct)}</span>
            </span>
          </div>
        </>
      )}
      {topLoser && (
        <>
          <div className="summary-divider" />
          <div className="summary-item">
            <span className="summary-label">Top Loser</span>
            <span className="summary-value">
              <span className="highlight-symbol">{topLoser.displaySymbol}</span>
              <span className="negative"> {formatChangePct(topLoser.changePct)}</span>
            </span>
          </div>
        </>
      )}

      {/* A/D Ratio Bar */}
      <div className="summary-divider" />
      <div className="summary-item ad-ratio">
        <span className="summary-label">A/D Ratio</span>
        <div className="ratio-bar">
          <div
            className="ratio-fill positive"
            style={{ width: `${(advancers / (quotes.length || 1)) * 100}%` }}
          />
          <div
            className="ratio-fill negative"
            style={{ width: `${(decliners / (quotes.length || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
