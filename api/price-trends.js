// Vercel Serverless Function - Price Trends from AGMARKNET API
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

    const AGMARKNET_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';
    const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const url = `${AGMARKNET_BASE}?api-key=${API_KEY}&format=json&limit=100&filters[commodity]=${encodeURIComponent(commodity)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FarmerManagementSystem/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data: data,
      source: 'AGMARKNET Government API',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching price trends:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
