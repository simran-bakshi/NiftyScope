/**
 * HeatMap Component
 *
 * Visual grid where each stock is a colored tile.
 * Color intensity indicates % change magnitude.
 * Green = positive, Red = negative
 *
 * Grouped by sector for easy market-wide reading.
 */

import { useMemo } from 'react';
import { formatChangePct, formatPrice } from '../lib/formatters';

// Map a % change to a color intensity
function getHeatColor(pct) {
  if (pct > 3) return '#0d7a45';
  if (pct > 2) return '#15a058';
  if (pct > 1) return '#22c576';
  if (pct > 0) return '#4de89a';
  if (pct === 0) return '#64748b';
  if (pct > -1) return '#f87171';
  if (pct > -2) return '#ef4444';
  if (pct > -3) return '#dc2626';
  return '#b91c1c';
}

function getTextColor(pct) {
  const abs = Math.abs(pct);
  return abs > 1 ? '#fff' : pct >= 0 ? '#064e2b' : '#7f1d1d';
}

export default function HeatMap({ quotes }) {
  // Group by sector
  const sectors = useMemo(() => {
    const map = {};
    quotes.forEach((q) => {
      if (!map[q.sector]) map[q.sector] = [];
      map[q.sector].push(q);
    });
    // Sort each sector by market cap descending
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
    );
    return map;
  }, [quotes]);

  return (
    <div className="heatmap-section">
      <h2 className="section-title">Market Heat Map</h2>
      <div className="heatmap-legend">
        <span style={{ color: '#0d7a45' }}>▮ Strong Gain (&gt;3%)</span>
        <span style={{ color: '#22c576' }}>▮ Gain</span>
        <span style={{ color: '#64748b' }}>▮ Flat</span>
        <span style={{ color: '#ef4444' }}>▮ Loss</span>
        <span style={{ color: '#b91c1c' }}>▮ Strong Loss</span>
      </div>
      <div className="heatmap-grid">
        {Object.entries(sectors).map(([sector, stocks]) => (
          <div key={sector} className="heatmap-sector">
            <span className="heatmap-sector-label">{sector}</span>
            <div className="heatmap-tiles">
              {stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="heatmap-tile"
                  style={{
                    backgroundColor: getHeatColor(stock.changePct),
                    color: getTextColor(stock.changePct),
                  }}
                  title={`${stock.name}\n₹${formatPrice(stock.price)}\n${formatChangePct(stock.changePct)}`}
                >
                  <span className="tile-symbol">{stock.displaySymbol}</span>
                  <span className="tile-pct">{formatChangePct(stock.changePct)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
