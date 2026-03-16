/**
 * API Route: /api/quotes
 *
 * Uses the `stock-nse-india` npm package which talks directly
 * to NSE India's official servers. No API key needed. No CORS issues.
 * It handles all the NSE cookie/session management internally.
 */

import { NseIndia } from 'stock-nse-india';
import { SYMBOL_NAMES, SYMBOL_SECTORS } from '../../lib/nifty50symbols';

const nse = new NseIndia();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // getEquityStockIndices('NIFTY 50') returns ALL 50 stocks in one call
    // This is the official NSE endpoint used by nseindia.com itself
    const data = await nse.getEquityStockIndices('NIFTY 50');

    if (!data || !data.data || data.data.length === 0) {
      throw new Error('NSE returned empty data');
    }

    // data.data[0] is the index itself (NIFTY 50), rest are individual stocks
    const indexEntry = data.data[0];
    const stocks = data.data.slice(1);

    const enriched = stocks.map((s) => {
      const sym = s.symbol; // e.g. "TCS"
      const nsSym = sym + '.NS'; // for our metadata lookup

      return {
        symbol: sym,
        displaySymbol: sym,
        name: SYMBOL_NAMES[nsSym] || s.meta?.companyName || sym,
        sector: SYMBOL_SECTORS[nsSym] || 'Other',
        price: s.lastPrice ?? 0,
        change: s.change ?? 0,
        changePct: s.pChange ?? 0,
        volume: s.totalTradedVolume ?? 0,
        high: s.dayHigh ?? 0,
        low: s.dayLow ?? 0,
        open: s.open ?? 0,
        prevClose: s.previousClose ?? 0,
        week52High: s.yearHigh ?? 0,
        week52Low: s.yearLow ?? 0,
        marketCap: 0, // NSE index endpoint doesn't include marketCap
      };
    });

    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=30');
    return res.status(200).json({
      success: true,
      source: 'NSE India',
      timestamp: new Date().toISOString(),
      count: enriched.length,
      indexMeta: {
        // Pass index-level data to the frontend too
        price: indexEntry?.lastPrice,
        change: indexEntry?.change,
        changePct: indexEntry?.pChange,
        high: indexEntry?.dayHigh,
        low: indexEntry?.dayLow,
        prevClose: indexEntry?.previousClose,
      },
      data: enriched,
    });
  } catch (err) {
    console.error('[/api/quotes] NSE error:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
