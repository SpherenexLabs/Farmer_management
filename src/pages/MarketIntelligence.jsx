import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Truck, Calendar, MapPin, Loader } from 'lucide-react';
import { getMarketPrices, predictPrices } from '../services/marketPriceService';

const MarketIntelligence = () => {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [loading, setLoading] = useState(true);
  const [currentPriceData, setCurrentPriceData] = useState(null);
  const [pricePredictions, setPricePredictions] = useState([]);
  const [quantity, setQuantity] = useState(50);
  const [distance, setDistance] = useState(100);

  useEffect(() => {
    loadMarketData();
  }, [selectedCrop]);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      
      // Fetch current market prices
      const prices = await getMarketPrices(selectedCrop, 'Karnataka');
      setCurrentPriceData(prices);
      
      // Fetch price predictions
      const predictions = await predictPrices(selectedCrop, 14);
      setPricePredictions(predictions);
      
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTransportCost = () => {
    const costPerKm = 15;
    const totalCost = (distance * costPerKm).toFixed(2);
    const costPerQuintal = (totalCost / quantity).toFixed(2);
    return { totalCost, costPerQuintal };
  };

  const transportCost = calculateTransportCost();

  if (loading) {
    return (
      <div className="market-intelligence-page">
        <div className="loading" style={{ textAlign: 'center', padding: '60px' }}>
          <Loader size={48} className="spinner" />
          <p>Loading market intelligence data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="market-intelligence-page">
      <div className="page-header">
        <h1>
          <TrendingUp size={32} />
          Market & Price Intelligence
        </h1>
        <p>Real-time prices, predictions, and AI-powered selling recommendations</p>
      </div>

      {/* Crop Selector */}
      <div className="crop-selector-section">
        <div className="selector-container">
          <label>Select Crop:</label>
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
            <option value="rice">Rice (ಅಕ್ಕಿ)</option>
            <option value="maize">Maize (ಜೋಳ)</option>
            <option value="wheat">Wheat (ಗೋಧಿ)</option>
            <option value="groundnut">Groundnut (ಕಡಲೆಕಾಯಿ)</option>
          </select>
        </div>
      </div>

      {/* Real-time Mandi Prices */}
      {currentPriceData && (
        <div className="section-card">
          <div className="section-header">
            <h2>
              <DollarSign size={24} />
              Real-Time Mandi Prices
            </h2>
            <div className={`price-trend ${currentPriceData.trend}`}>
              <TrendingUp size={20} />
              <span>{currentPriceData.trend === 'up' ? 'Trending Up' : 'Trending Down'}</span>
            </div>
          </div>

          <div className="current-price-card">
            <div className="price-main">
              <h3>Current Average Price</h3>
              <div className="location-badge">
                <MapPin size={16} />
                <span>Karnataka State Markets</span>
              </div>
              <div className="price-display">
                <span className="price-amount">₹{currentPriceData.current}</span>
                <span className="price-unit">per quintal</span>
              </div>
              <div className="price-changes">
                <span className="change-item">
                  Yesterday: ₹{currentPriceData.yesterday}
                  <span className={currentPriceData.current > currentPriceData.yesterday ? 'up' : 'down'}>
                    ({currentPriceData.current > currentPriceData.yesterday ? '+' : ''}
                    {currentPriceData.current - currentPriceData.yesterday})
                  </span>
                </span>
                <span className="change-item">
                  Last Week: ₹{currentPriceData.weekAgo}
                  <span className={currentPriceData.current > currentPriceData.weekAgo ? 'up' : 'down'}>
                    ({currentPriceData.current > currentPriceData.weekAgo ? '+' : ''}
                    {currentPriceData.current - currentPriceData.weekAgo})
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="markets-grid">
            {currentPriceData.markets.map((market, index) => (
              <div key={index} className="market-card">
                <h4>{market.name}</h4>
                <div className="market-price">₹{market.price}</div>
                <span className="market-updated">Updated {market.updated}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Predictions */}
      {pricePredictions.length > 0 && (
        <div className="section-card">
          <div className="section-header">
            <h2>
              <TrendingUp size={24} />
              14-Day Price Prediction (AI-Powered)
            </h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={pricePredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Actual Price"
                  dot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="prediction-insights">
            <div className="insight">
              <h4>Peak Price Expected</h4>
              <p>Day 14 (estimated increase)</p>
            </div>
            <div className="insight">
              <h4>Best Selling Period</h4>
              <p>Days 6-8 for optimal returns</p>
            </div>
            <div className="insight">
              <h4>Data Source</h4>
              <p>AGMARKNET & eNAM APIs</p>
            </div>
          </div>
        </div>
      )}

      {/* Transport Cost Calculator */}
      <div className="section-card">
        <div className="section-header">
          <h2>
            <Truck size={24} />
            Transport Cost Calculator
          </h2>
        </div>
        <div className="calculator-container">
          <div className="calculator-inputs">
            <div className="input-group">
              <label>Quantity (quintals)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
              />
            </div>
            <div className="input-group">
              <label>Distance to Mandi (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                min="1"
              />
            </div>
          </div>
          <div className="calculator-results">
            <div className="result-card">
              <h4>Total Transport Cost</h4>
              <p className="result-value">₹{transportCost.totalCost}</p>
            </div>
            <div className="result-card">
              <h4>Cost Per Quintal</h4>
              <p className="result-value">₹{transportCost.costPerQuintal}</p>
            </div>
            {currentPriceData && (
              <div className="result-card comparison">
                <h4>Net Profit Calculation</h4>
                <div className="comparison-details">
                  <div>
                    <span>Market Price:</span>
                    <strong>₹{currentPriceData.current}</strong>
                  </div>
                  <div>
                    <span>Less Transport:</span>
                    <strong>₹{transportCost.costPerQuintal}</strong>
                  </div>
                  <div className="savings">
                    Net Earnings: ₹{(currentPriceData.current - parseFloat(transportCost.costPerQuintal)).toFixed(2)} per quintal
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
