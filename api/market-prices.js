// Vercel Serverless Function - Market Prices from AGMARKNET API
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { commodity = 'Rice', state = 'Karnataka', limit = 10 } = req.query;
    const cacheKey = `${commodity}-${state}-${limit}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached data');
      return res.status(200).json(cached.data);
    }

    const AGMARKNET_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';
    const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

    const url = `${AGMARKNET_BASE}?api-key=${API_KEY}&format=json&limit=${limit}&filters[state]=${encodeURIComponent(state)}&filters[commodity]=${encodeURIComponent(commodity)}`;

    console.log('Fetching from:', url);

    // Abort after 23s so Vercel never hits 30s hard timeout (avoids 504)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 23000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));

    if (response.status === 429) {
      console.warn('Government API rate-limited (429). Returning empty records to trigger cache/sample fallback.');
      return res.status(200).json({ success: false, error: 'API returned 429', data: { records: [] } });
    }

    if (!response.ok) {
      console.error(`API returned ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data.records?.length || 0, 'records');

    const result = {
      success: true,
      data: data,
      source: 'AGMARKNET Government API',
      timestamp: new Date().toISOString()
    };

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return res.status(200).json(result);

  } catch (error) {
    const isAbort = error.name === 'AbortError';
    console.error('Error fetching market prices:', error.message);
    return res.status(isAbort ? 200 : 200).json({
      success: false,
      error: isAbort ? 'Upstream API timed out after 23s' : error.message,
      data: { records: [] }
    });
  }
}
