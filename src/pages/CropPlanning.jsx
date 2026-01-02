import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Cloud, CloudRain, Sun, Wind, Droplets, 
  Sprout, AlertTriangle, Calendar, MapPin, TrendingUp, Loader 
} from 'lucide-react';
import { getCurrentWeather, getWeatherForecast } from '../services/weatherService';
import { getSoilHealthData, getCropRecommendations, getFertilizerSchedule } from '../services/soilHealthService';

const CropPlanning = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [soilData, setSoilData] = useState(null);
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [fertilizerSchedule, setFertilizerSchedule] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch weather data
      const weather = await getCurrentWeather();
      setWeatherData(weather);
      
      const forecastData = await getWeatherForecast();
      setForecast(forecastData);
      
      // Fetch soil health data
      const soil = await getSoilHealthData(user?.uid || 'demo', user?.location || 'Bangalore');
      setSoilData(soil);
      
      // Get crop recommendations based on soil and weather
      const recommendations = getCropRecommendations(soil, weather);
      setCropRecommendations(recommendations);
      
      // Get fertilizer schedule for primary crop
      if (recommendations.length > 0) {
        const schedule = getFertilizerSchedule(recommendations[0].name, soil);
        setFertilizerSchedule(schedule);
      }
      
    } catch (error) {
      console.error('Error loading planning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain size={64} />;
    if (cond.includes('cloud')) return <Cloud size={64} />;
    return <Sun size={64} />;
  };

  const irrigationSchedule = [
    { day: 'Day 1', water: '50mm', method: 'Flooding', duration: '2 hours' },
    { day: 'Day 7', water: '30mm', method: 'Drip', duration: '3 hours' },
    { day: 'Day 14', water: '35mm', method: 'Drip', duration: '3 hours' },
    { day: 'Day 21', water: '40mm', method: 'Sprinkler', duration: '2.5 hours' },
    { day: 'Day 28', water: '30mm', method: 'Drip', duration: '3 hours' }
  ];

  if (loading) {
    return (
      <div className="crop-planning-page">
        <div className="loading" style={{ textAlign: 'center', padding: '60px' }}>
          <Loader size={48} className="spinner" />
          <p>Loading crop planning data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crop-planning-page">
      <div className="page-header">
        <h1>{t('cropPlanning')}</h1>
        <p>AI-powered insights for better crop management</p>
      </div>

      {/* Weather Dashboard */}
      {weatherData && (
        <div className="weather-section">
          <div className="weather-card">
            <div className="weather-header">
              <h2>
                <Cloud size={24} />
                Current Weather
              </h2>
              <div className="location">
                <MapPin size={16} />
                <span>{weatherData.location}</span>
              </div>
            </div>
            <div className="weather-content">
              <div className="current-weather">
                <div className="temp-display">
                  {getWeatherIcon(weatherData.condition)}
                  <span className="temp">{weatherData.temperature}°C</span>
                </div>
                <p className="condition">{weatherData.description}</p>
              </div>
              <div className="weather-stats">
                <div className="stat">
                  <Droplets size={20} />
                  <div>
                    <span className="value">{weatherData.humidity}%</span>
                    <span className="label">Humidity</span>
                  </div>
                </div>
                <div className="stat">
                  <CloudRain size={20} />
                  <div>
                    <span className="value">{weatherData.rainfall}mm</span>
                    <span className="label">Rainfall</span>
                  </div>
                </div>
                <div className="stat">
                  <Wind size={20} />
                  <div>
                    <span className="value">{weatherData.windSpeed} km/h</span>
                    <span className="label">Wind Speed</span>
                  </div>
                </div>
              </div>
              {forecast.length > 0 && (
                <div className="weather-forecast">
                  {forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                      <span>{day.day}</span>
                      {day.condition.includes('rain') ? <CloudRain size={24} /> : 
                       day.condition.includes('cloud') ? <Cloud size={24} /> : <Sun size={24} />}
                      <span>{day.temp}°C</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <Sprout size={20} />
          {t('cropRecommendations')}
        </button>
        <button 
          className={`tab ${activeTab === 'fertilizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('fertilizer')}
        >
          <TrendingUp size={20} />
          {t('fertilizerSchedule')}
        </button>
        <button 
          className={`tab ${activeTab === 'irrigation' ? 'active' : ''}`}
          onClick={() => setActiveTab('irrigation')}
        >
          <Droplets size={20} />
          {t('irrigationSchedule')}
        </button>
        <button 
          className={`tab ${activeTab === 'soil' ? 'active' : ''}`}
          onClick={() => setActiveTab('soil')}
        >
          <AlertTriangle size={20} />
          Soil Health
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'recommendations' && (
          <div className="recommendations-section">
            <h2>Recommended Crops for Your Farm</h2>
            <p className="section-subtitle">Based on soil health, weather patterns, and market analysis</p>
            <div className="recommendations-grid">
              {cropRecommendations.map((crop, index) => (
                <div key={index} className="recommendation-card">
                  <div className="card-header">
                    <div>
                      <h3>{crop.name}</h3>
                      <p className="kannada-name">{crop.kannadaName}</p>
                    </div>
                    <div className="suitability-badge" style={{
                      background: crop.suitability > 90 ? '#10b981' : 
                                 crop.suitability > 80 ? '#f59e0b' : '#6b7280'
                    }}>
                      {crop.suitability}%
                    </div>
                  </div>
                  <div className="card-details">
                    <div className="detail">
                      <Calendar size={16} />
                      <div>
                        <span className="detail-label">Sowing Window</span>
                        <span className="detail-value">{crop.sowingWindow}</span>
                      </div>
                    </div>
                    <div className="detail">
                      <TrendingUp size={16} />
                      <div>
                        <span className="detail-label">Expected Yield</span>
                        <span className="detail-value">{crop.expectedYield}</span>
                      </div>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Market Price</span>
                      <span className="detail-value highlight">{crop.marketPrice}</span>
                    </div>
                  </div>
                  <div className="reasons">
                    <h4>Why this crop?</h4>
                    <ul>
                      {crop.reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn btn-primary">Select This Crop</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fertilizer' && (
          <div className="schedule-section">
            <h2>{t('fertilizerSchedule')}</h2>
            <p className="section-subtitle">Optimized fertilizer application based on soil health analysis</p>
            <div className="schedule-table">
              <table>
                <thead>
                  <tr>
                    <th>Growth Stage</th>
                    <th>Days After Sowing</th>
                    <th>Fertilizer Type</th>
                    <th>Quantity</th>
                    <th>Application Method</th>
                  </tr>
                </thead>
                <tbody>
                  {fertilizerSchedule.map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.stage}</strong></td>
                      <td>{item.days}</td>
                      <td>{item.type}</td>
                      <td>{item.quantity}</td>
                      <td>{item.application}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'irrigation' && (
          <div className="schedule-section">
            <h2>{t('irrigationSchedule')}</h2>
            <p className="section-subtitle">Water management schedule based on crop needs and weather</p>
            <div className="schedule-table">
              <table>
                <thead>
                  <tr>
                    <th>Schedule</th>
                    <th>Water Required</th>
                    <th>Method</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {irrigationSchedule.map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.day}</strong></td>
                      <td>{item.water}</td>
                      <td>{item.method}</td>
                      <td>{item.duration}</td>
                      <td>
                        <button className="btn btn-sm">Mark Complete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'soil' && soilData && (
          <div className="soil-section">
            <h2>Soil Health Report</h2>
            <p className="section-subtitle">Based on latest soil analysis</p>
            
            <div className="soil-metrics">
              <div className="metric-card">
                <h4>Soil Type</h4>
                <p className="metric-value">{soilData.soilType}</p>
              </div>
              <div className="metric-card">
                <h4>pH Level</h4>
                <p className="metric-value">{soilData.pH}</p>
                <span className={soilData.pH >= 6 && soilData.pH <= 7 ? 'status-good' : 'status-warning'}>
                  {soilData.pH >= 6 && soilData.pH <= 7 ? 'Optimal' : 'Needs Attention'}
                </span>
              </div>
              <div className="metric-card">
                <h4>Nitrogen</h4>
                <p className="metric-value">{soilData.nitrogen}</p>
              </div>
              <div className="metric-card">
                <h4>Phosphorus</h4>
                <p className="metric-value">{soilData.phosphorus}</p>
              </div>
              <div className="metric-card">
                <h4>Potassium</h4>
                <p className="metric-value">{soilData.potassium}</p>
              </div>
              <div className="metric-card">
                <h4>Organic Carbon</h4>
                <p className="metric-value">{soilData.organicCarbon}%</p>
              </div>
            </div>

            <div className="recommendations-list">
              <h3>Nutrient Recommendations</h3>
              {soilData.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <div className="rec-header">
                    <h4>{rec.nutrient}</h4>
                    <span className={`status-badge ${rec.status.toLowerCase()}`}>{rec.status}</span>
                  </div>
                  <p className="rec-text">{rec.recommendation}</p>
                  <p className="rec-timing"><Calendar size={14} /> {rec.timing}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanning;
