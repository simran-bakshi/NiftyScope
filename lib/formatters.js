/**
 * Utility functions for formatting numbers, currency, and percentages
 * Used throughout the dashboard components
 */

// Format a number as Indian Rupee price (e.g. 2,45,678.50)
export function formatPrice(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format change value with + or - sign
export function formatChange(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
}

// Format percent change
export function formatChangePct(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Format large volume numbers (e.g. 1.2M, 45.3K)
export function formatVolume(value) {
  if (!value) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

// Format market cap (e.g. ₹12.4L Cr, ₹4.5K Cr)
export function formatMarketCap(value) {
  if (!value) return '—';
  const crore = value / 10_000_000; // 1 Crore = 10M
  if (crore >= 100_000) return `₹${(crore / 100_000).toFixed(2)}L Cr`;
  if (crore >= 1_000) return `₹${(crore / 1_000).toFixed(2)}K Cr`;
  return `₹${crore.toFixed(0)} Cr`;
}

// Get CSS class based on positive/negative value
export function colorClass(value) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

// Format time from ISO string (e.g. "3:45 PM")
export function formatTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
