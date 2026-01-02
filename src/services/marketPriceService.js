// AGMARKNET API Integration for Market Prices
// Real Government API: Variety-wise Daily Market Prices Data of Commodity

const AGMARKNET_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'; // Sample key from data.gov.in

// Map crop names to commodity codes
const COMMODITY_CODES = {
  rice: 'Rice',
  maize: 'Maize',
  wheat: 'Wheat',
  groundnut: 'Groundnut',
  tomato: 'Tomato',
  potato: 'Potato',
  onion: 'Onion'
};

export const getMarketPrices = async (commodity = 'rice', state = 'Karnataka') => {
  try {
    const commodityName = COMMODITY_CODES[commodity.toLowerCase()] || commodity;
    
    console.log(`Fetching market prices for ${commodityName} in ${state}`);
    
    // NOTE: Direct browser access to government APIs is blocked by CORS
    // The API requires backend server access. Using enhanced sample data for now.
    // To enable real API: Set up Node.js backend and proxy the request
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return realistic sample data based on commodity
    return getSampleMarketData(commodity);
    
    /* PRODUCTION CODE - Uncomment when backend proxy is ready:
    
    const url = `${AGMARKNET_BASE}?api-key=${API_KEY}&format=json&limit=10&filters[state]=${state}&filters[commodity]=${commodityName}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.records && data.records.length > 0) {
      return processRealMarketData(data.records, commodity);
    }
    */
    
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return getSampleMarketData(commodity);
  }
};

export const getPriceTrends = async (commodity, days = 30) => {
  try {
    // Fetch historical price data
    // Note: Actual implementation depends on API availability
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Mock implementation - replace with actual API call
    return generateTrendData(commodity, days);
  } catch (error) {
    console.error('Error fetching price trends:', error);
    return [];
  }
};

// Process real API data from AGMARKNET
const processRealMarketData = (records, commodity) => {
  // Group records by market
  const marketMap = {};
  
  records.forEach(record => {
    const marketName = record.market || 'Unknown Market';
    const modal_price = parseFloat(record.modal_price) || 0;
    const arrival_date = record.arrival_date || 'N/A';
    
    if (!marketMap[marketName] || new Date(record.arrival_date) > new Date(marketMap[marketName].date)) {
      marketMap[marketName] = {
        name: marketName,
        price: modal_price,
        updated: formatDate(arrival_date),
        minPrice: parseFloat(record.min_price) || modal_price,
        maxPrice: parseFloat(record.max_price) || modal_price
      };
    }
  });
  
  const markets = Object.values(marketMap).slice(0, 4);
  const prices = markets.map(m => m.price).filter(p => p > 0);
  
  if (prices.length === 0) {
    return getSampleMarketData(commodity);
  }
  
  const currentPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  
  return {
    current: currentPrice,
    yesterday: Math.round(currentPrice * 0.99),
    weekAgo: Math.round(currentPrice * 0.97),
    trend: currentPrice > (currentPrice * 0.99) ? 'up' : 'down',
    markets: markets
  };
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

// Helper function to parse AGMARKNET data (deprecated - use processRealMarketData)
const parseMarketData = (data, commodity) => {
  if (!data.records || data.records.length === 0) {
    return getSampleMarketData(commodity);
  }
  
  const basePrices = {
    rice: 2100,
    maize: 1850,
    wheat: 2350,
    groundnut: 5500
  };
  
  return {
    current: basePrices[commodity] || 2000,
    yesterday: (basePrices[commodity] || 2000) - 20,
    weekAgo: (basePrices[commodity] || 2000) - 50,
    trend: 'up',
    markets: [
      { name: 'Bangalore APMC', price: basePrices[commodity], updated: '2 hours ago' },
      { name: 'Mysore Mandi', price: basePrices[commodity] - 15, updated: '3 hours ago' },
      { name: 'Mandya Market', price: basePrices[commodity] - 5, updated: '1 hour ago' },
      { name: 'Hassan Mandi', price: basePrices[commodity] - 25, updated: '4 hours ago' }
    ]
  };
};

// Sample data structure for when API is unavailable
const getSampleMarketData = (commodity) => {
  const basePrices = {
    rice: 2100,
    maize: 1850,
    wheat: 2350,
    groundnut: 5500
  };
  
  const variation = Math.floor(Math.random() * 30) - 15;
  const basePrice = basePrices[commodity] || 2000;
  
  return {
    current: basePrice + variation,
    yesterday: basePrice + variation - 20,
    weekAgo: basePrice + variation - 50,
    trend: variation > 0 ? 'up' : 'down',
    markets: [
      { name: 'Bangalore APMC', price: basePrice + variation, updated: '2 hours ago' },
      { name: 'Mysore Mandi', price: basePrice + variation - 15, updated: '3 hours ago' },
      { name: 'Mandya Market', price: basePrice + variation - 5, updated: '1 hour ago' },
      { name: 'Hassan Mandi', price: basePrice + variation - 25, updated: '4 hours ago' }
    ]
  };
};

// Generate trend data for charts
const generateTrendData = (commodity, days) => {
  const data = [];
  const basePrices = {
    rice: 2100,
    maize: 1850,
    wheat: 2350,
    groundnut: 5500
  };
  
  const basePrice = basePrices[commodity] || 2000;
  
  for (let i = 0; i < days; i++) {
    const variation = Math.floor(Math.random() * 100) - 50;
    data.push({
      day: `Day ${i + 1}`,
      price: basePrice + variation,
      predicted: i > days / 2 ? basePrice + variation + Math.floor(Math.random() * 50) : null
    });
  }
  
  return data;
};

export const predictPrices = async (commodity, days = 14) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // AI-based price prediction
    // This would use ML models in production
    const basePrices = {
      rice: 2100,
      maize: 1850,
      wheat: 2350,
      groundnut: 5500
    };
    
    const basePrice = basePrices[commodity] || 2000;
    const predictions = [];
    
    predictions.push({ day: 'Today', actual: basePrice, predicted: basePrice });
    
    for (let i = 1; i <= days; i++) {
      const increase = Math.floor(Math.random() * 20) + 5;
      const trend = i / days;
      predictions.push({
        day: `Day ${i + 1}`,
        predicted: Math.round(basePrice + (increase * trend * 100))
      });
    }
    
    return predictions;
  } catch (error) {
    console.error('Error predicting prices:', error);
    return [];
  }
};
