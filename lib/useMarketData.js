/**
 * Custom React Hook: useMarketData
 * Fetches from /api/quotes (which now uses NSE India directly).
 * Index data is bundled inside the quotes response as indexMeta.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const REFRESH_INTERVAL = 30000; // 30 seconds

export function useMarketData() {
  const [quotes, setQuotes] = useState([]);
  const [indexData, setIndexData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);

  const countdownRef = useRef(null);
  const refreshRef = useRef(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      // Single call — quotes + index bundled together now
      const quotesRes = await fetch('/api/quotes');
      if (!quotesRes.ok) throw new Error(`HTTP ${quotesRes.status}`);

      const quotesData = await quotesRes.json();
      if (!quotesData.success) throw new Error(quotesData.error || 'API error');

      setQuotes(quotesData.data || []);

      // indexMeta comes bundled inside the quotes response
      if (quotesData.indexMeta) {
        setIndexData({ nifty: quotesData.indexMeta, sensex: null });
      }

      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL / 1000);
    } catch (err) {
      setError(err.message);
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(REFRESH_INTERVAL / 1000);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);
  }, []);

  useEffect(() => {
    fetchAll();
    startCountdown();
    refreshRef.current = setInterval(() => {
      fetchAll();
      startCountdown();
    }, REFRESH_INTERVAL);
    return () => {
      clearInterval(refreshRef.current);
      clearInterval(countdownRef.current);
    };
  }, [fetchAll, startCountdown]);

  const gainers = [...quotes]
    .filter((q) => q.changePct > 0)
    .sort((a, b) => b.changePct - a.changePct)
    .slice(0, 5);

  const losers = [...quotes]
    .filter((q) => q.changePct < 0)
    .sort((a, b) => a.changePct - b.changePct)
    .slice(0, 5);

  const advancers = quotes.filter((q) => q.change > 0).length;
  const decliners = quotes.filter((q) => q.change < 0).length;
  const unchanged = quotes.filter((q) => q.change === 0).length;

  return {
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
    refresh: fetchAll,
    refreshInterval: REFRESH_INTERVAL,
  };
}
