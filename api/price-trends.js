// Vercel Serverless Function - Price Trends from AGMARKNET API
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
    const { commodity = 'Rice', days = 30 } = req.query;
    const cacheKey = `${commodity}-${days}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached data');
      return res.status(200).json(cached.data);
    }

    const AGMARKNET_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';
    const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

    const url = `${AGMARKNET_BASE}?api-key=${API_KEY}&format=json&limit=100&filters[commodity]=${encodeURIComponent(commodity)}`;

    console.log('Fetching trends from:', url);

    // Add timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

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
    console.error('Error fetching price trends:', error.message);
    return res.status(200).json({
      success: false,
      error: error.message,
      data: { records: [] }
    });
  }
}
