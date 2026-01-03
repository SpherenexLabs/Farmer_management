import { ref, set, get } from 'firebase/database';
import { database } from '../firebase/config';

// Cache market data in Firebase for fast retrieval
export const cacheMarketData = async (commodity, state, data) => {
  try {
    const cacheRef = ref(database, `marketCache/${state}/${commodity}`);
    await set(cacheRef, {
      data,
      timestamp: Date.now(),
      lastUpdated: new Date().toISOString()
    });
    console.log(`✅ Cached market data for ${commodity} in ${state}`);
  } catch (error) {
    console.error('Error caching market data:', error);
  }
};

export const getCachedMarketData = async (commodity, state) => {
  try {
    const cacheRef = ref(database, `marketCache/${state}/${commodity}`);
    const snapshot = await get(cacheRef);
    
    if (snapshot.exists()) {
      const cached = snapshot.val();
      const age = Date.now() - cached.timestamp;
      const ageMinutes = Math.floor(age / 60000);
      
      console.log(`📦 Using cached data (${ageMinutes} minutes old)`);
      return cached.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached market data:', error);
    return null;
  }
};

// Fetch and cache data from government API (to be run periodically)
export const updateMarketCache = async () => {
  const commodities = ['Rice', 'Maize', 'Wheat', 'Cotton', 'Sugarcane'];
  const state = 'Karnataka';
  
  for (const commodity of commodities) {
    try {
      const AGMARKNET_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';
      const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
      const url = `${AGMARKNET_BASE}?api-key=${API_KEY}&format=json&limit=10&filters[state]=${encodeURIComponent(state)}&filters[commodity]=${encodeURIComponent(commodity)}`;
      
      console.log(`Fetching ${commodity} data from government API...`);
      
      // Give it 60 seconds for background fetch
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.records && result.records.length > 0) {
          await cacheMarketData(commodity, state, result);
          console.log(`✅ Updated cache for ${commodity}: ${result.records.length} records`);
        }
      }
      
      // Wait 2 seconds between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error updating ${commodity}:`, error.message);
    }
  }
  
  console.log('✅ Market cache update complete');
};
