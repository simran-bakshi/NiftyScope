/**
 * API Route: /api/index
 * Fetches Nifty 50 and Sensex index levels from NSE directly.
 */

import { NseIndia } from 'stock-nse-india';

const nse = new NseIndia();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // getAllIndices gives us Nifty 50, Bank Nifty, etc.
    const data = await nse.getAllIndices();

    const indices = data?.data || [];

    const nifty50 = indices.find(
      (i) => i.index === 'NIFTY 50' || i.indexSymbol === 'NIFTY 50'
    );
    const bankNifty = indices.find(
      (i) => i.index === 'NIFTY BANK' || i.indexSymbol === 'NIFTY BANK'
    );

    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=30');
    return res.status(200).json({
      success: true,
      nifty: nifty50
        ? {
            price: nifty50.last,
            change: nifty50.variation,
            changePct: nifty50.percentChange,
            high: nifty50.high,
            low: nifty50.low,
            prevClose: nifty50.previousClose || nifty50.last - nifty50.variation,
          }
        : null,
      sensex: null, // Sensex is BSE, NSE API doesn't include it
      bankNifty: bankNifty
        ? {
            price: bankNifty.last,
            change: bankNifty.variation,
            changePct: bankNifty.percentChange,
          }
        : null,
    });
  } catch (err) {
    console.error('[/api/index] Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
