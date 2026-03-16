/**
 * StockTable Component
 *
 * The main feature of the dashboard — a sortable, filterable table
 * showing all 50 Nifty stocks with live data.
 *
 * Features:
 * - Sort by any column (click header)
 * - Filter by sector
 * - Search by symbol/name
 * - Color-coded rows based on positive/negative change
 * - Animated flash on data update
 */

import { useState, useMemo } from 'react';
import {
  formatPrice,
  formatChange,
  formatChangePct,
  formatVolume,
  formatMarketCap,
  colorClass,
} from '../lib/formatters';

const COLUMNS = [
  { key: 'displaySymbol', label: 'Symbol', sortable: true },
  { key: 'name', label: 'Company', sortable: true },
  { key: 'sector', label: 'Sector', sortable: true },
  { key: 'price', label: 'LTP (₹)', sortable: true, align: 'right' },
  { key: 'change', label: 'Change', sortable: true, align: 'right' },
  { key: 'changePct', label: '% Change', sortable: true, align: 'right' },
  { key: 'volume', label: 'Volume', sortable: true, align: 'right' },
  { key: 'high', label: "Day's High", sortable: true, align: 'right' },
  { key: 'low', label: "Day's Low", sortable: true, align: 'right' },
  { key: 'prevClose', label: 'Prev Close', sortable: true, align: 'right' },
  { key: 'marketCap', label: 'Mkt Cap', sortable: true, align: 'right' },
];

export default function StockTable({ quotes, loading }) {
  const [sortKey, setSortKey] = useState('changePct');
  const [sortDir, setSortDir] = useState('desc');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Get unique sectors for filter dropdown
  const sectors = useMemo(() => {
    const s = [...new Set(quotes.map((q) => q.sector))].sort();
    return ['All', ...s];
  }, [quotes]);

  // Sort handler — toggle direction if same column, else set new column descending
  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  // Apply filters and sorting
  const displayData = useMemo(() => {
    let data = [...quotes];

    // Filter by sector
    if (sectorFilter !== 'All') {
      data = data.filter((q) => q.sector === sectorFilter);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          s.displaySymbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      );
    }

    // Sort
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });

    return data;
  }, [quotes, sortKey, sortDir, sectorFilter, search]);

  function SortIcon({ col }) {
    if (sortKey !== col) return <span className="sort-icon inactive">↕</span>;
    return <span className="sort-icon active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="table-section">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <h2 className="section-title">Nifty 50 Stocks</h2>
          <span className="stock-count">{displayData.length} stocks</span>
        </div>
        <div className="toolbar-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search symbol or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="sector-select"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th className="th-index">#</th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`${col.sortable ? 'sortable' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && quotes.length === 0 ? (
              // Skeleton rows while loading
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <td key={j}>
                      <div className="skeleton-cell" />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={12} className="empty-state">
                  No stocks match your search
                </td>
              </tr>
            ) : (
              displayData.map((stock, idx) => (
                <tr key={stock.symbol} className={`stock-row ${colorClass(stock.change)}-row`}>
                  <td className="td-index">{idx + 1}</td>
                  <td className="td-symbol">
                    <span className="symbol-badge">{stock.displaySymbol}</span>
                  </td>
                  <td className="td-name">{stock.name}</td>
                  <td className="td-sector">
                    <span className="sector-tag">{stock.sector}</span>
                  </td>
                  <td className="text-right td-price">
                    ₹{formatPrice(stock.price)}
                  </td>
                  <td className={`text-right ${colorClass(stock.change)}`}>
                    {formatChange(stock.change)}
                  </td>
                  <td className={`text-right td-changepct ${colorClass(stock.changePct)}`}>
                    <span className="pct-badge">{formatChangePct(stock.changePct)}</span>
                  </td>
                  <td className="text-right">{formatVolume(stock.volume)}</td>
                  <td className="text-right">{formatPrice(stock.high)}</td>
                  <td className="text-right">{formatPrice(stock.low)}</td>
                  <td className="text-right td-muted">{formatPrice(stock.prevClose)}</td>
                  <td className="text-right td-muted">{formatMarketCap(stock.marketCap)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
