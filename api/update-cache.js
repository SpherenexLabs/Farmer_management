import { updateSingleCommodityCache } from '../src/services/marketDataCache.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const commodity = req.query?.commodity || 'Rice';
  const state = req.query?.state || 'Karnataka';

  try {
    const result = await updateSingleCommodityCache(commodity, state);
    return res.status(200).json({ success: result.success, records: result.records, commodity, state });
  } catch (error) {
    console.error('Error updating cache:', error.message);
    return res.status(200).json({ success: false, error: error.message, commodity, state });
  }
}
