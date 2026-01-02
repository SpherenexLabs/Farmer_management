import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;

// AGMARKNET API Configuration
const AGMARKNET_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Market Price API Server is running' });
});

// Market prices endpoint - Proxy to government API
app.get('/api/market-prices', async (req, res) => {
  try {
    const { commodity = 'Rice', state = 'Karnataka', limit = 10 } = req.query;
    
    console.log(`Fetching market prices for ${commodity} in ${state}`);
    
    const url = `${AGMARKNET_BASE}?api-key=${API_KEY}&format=json&limit=${limit}&filters[state]=${state}&filters[commodity]=${commodity}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FarmerManagementSystem/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`Fetched ${data.records?.length || 0} records for ${commodity}`);
    
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching market prices:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch market prices from government API'
    });
  }
});

// Price trends endpoint
app.get('/api/price-trends', async (req, res) => {
  try {
    const { commodity = 'Rice', state = 'Karnataka', days = 30 } = req.query;
    
    console.log(`Fetching price trends for ${commodity} (${days} days)`);
    
    // Fetch more records for historical data
    const url = `${AGMARKNET_BASE}?api-key=${API_KEY}&format=json&limit=50&filters[state]=${state}&filters[commodity]=${commodity}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching price trends:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// All available commodities
app.get('/api/commodities', async (req, res) => {
  res.json({
    success: true,
    commodities: [
      'Rice', 'Maize', 'Wheat', 'Groundnut',
      'Tomato', 'Potato', 'Onion', 'Cotton',
      'Sugarcane', 'Turmeric', 'Chilli'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Market Price API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💰 Market prices: http://localhost:${PORT}/api/market-prices?commodity=Rice&state=Karnataka\n`);
});
