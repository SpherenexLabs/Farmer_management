import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { MapPin, TrendingUp, Calendar, Users, Package, Loader } from 'lucide-react';
import { getMarketPrices } from '../services/marketPriceService';
import { getCurrentWeather } from '../services/weatherService';

const Analytics = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch market data for different crops
      const [riceData, maizeData, wheatData, groundnutData] = await Promise.all([
        getMarketPrices('rice', 'Karnataka'),
        getMarketPrices('maize', 'Karnataka'),
        getMarketPrices('wheat', 'Karnataka'),
        getMarketPrices('groundnut', 'Karnataka')
      ]);

      // Fetch weather data
      const weather = await getCurrentWeather(12.9716, 77.5946);

      // Process crop distribution
      const cropDistribution = [
        { name: 'Rice', value: 35, area: 450, farmers: 1250, color: '#10b981' },
        { name: 'Maize', value: 25, area: 320, farmers: 890, color: '#f59e0b' },
        { name: 'Wheat', value: 20, area: 280, farmers: 720, color: '#3b82f6' },
        { name: 'Groundnut', value: 20, area: 250, farmers: 650, color: '#8b5cf6' }
      ];

      // Seasonal trends (last 6 months)
      const seasonalTrends = [
        { month: 'Jul', rice: 420, maize: 310, wheat: 180, groundnut: 240 },
        { month: 'Aug', rice: 450, maize: 330, wheat: 200, groundnut: 250 },
        { month: 'Sep', rice: 480, maize: 340, wheat: 220, groundnut: 260 },
        { month: 'Oct', rice: 460, maize: 350, wheat: 260, groundnut: 270 },
        { month: 'Nov', rice: 450, maize: 320, wheat: 280, groundnut: 250 },
        { month: 'Dec', rice: 470, maize: 340, wheat: 290, groundnut: 265 }
      ];

      // Market price trends using real data
      const priceTrends = [
        { crop: 'Rice', current: riceData.current, yesterday: riceData.yesterday, weekAgo: riceData.weekAgo, trend: riceData.trend },
        { crop: 'Maize', current: maizeData.current, yesterday: maizeData.yesterday, weekAgo: maizeData.weekAgo, trend: maizeData.trend },
        { crop: 'Wheat', current: wheatData.current, yesterday: wheatData.yesterday, weekAgo: wheatData.weekAgo, trend: wheatData.trend },
        { crop: 'Groundnut', current: groundnutData.current, yesterday: groundnutData.yesterday, weekAgo: groundnutData.weekAgo, trend: groundnutData.trend }
      ];

      // Regional statistics
      const regionalStats = [
        { district: 'Bangalore', farmers: 1250, area: 580, production: 2340 },
        { district: 'Mysore', farmers: 980, area: 450, production: 1890 },
        { district: 'Mandya', farmers: 850, area: 420, production: 1680 },
        { district: 'Hassan', farmers: 720, area: 380, production: 1520 },
        { district: 'Tumkur', farmers: 680, area: 350, production: 1400 }
      ];

      // Harvest predictions
      const harvestPredictions = [
        { crop: 'Rice', expectedYield: '4.5 tons/acre', readyDate: 'Jan 15, 2026', volume: 5625 },
        { crop: 'Maize', expectedYield: '3.8 tons/acre', readyDate: 'Jan 22, 2026', volume: 3040 },
        { crop: 'Wheat', expectedYield: '3.2 tons/acre', readyDate: 'Feb 5, 2026', volume: 2688 },
        { crop: 'Groundnut', expectedYield: '2.5 tons/acre', readyDate: 'Feb 12, 2026', volume: 2000 }
      ];

      setAnalyticsData({
        cropDistribution,
        seasonalTrends,
        priceTrends,
        regionalStats,
        harvestPredictions,
        weather,
        totalFarmers: 3510,
        totalArea: 1330,
        totalProduction: 13310
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading-container">
          <Loader className="spinner" size={48} />
          <p>{t('loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="analytics-page">
        <div className="error-message">{t('unableToLoad')}</div>
      </div>
    );
  }

  const { cropDistribution, seasonalTrends, priceTrends, regionalStats, harvestPredictions, weather, totalFarmers, totalArea, totalProduction } = analyticsData;

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>{t('analytics')}</h1>
        <p>{t('analyticsSubtitle')}</p>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card">
          <Users size={32} color="#10b981" />
          <div>
            <h3>{totalFarmers.toLocaleString()}</h3>
            <p>{t('totalFarmers')}</p>
          </div>
        </div>
        <div className="summary-card">
          <MapPin size={32} color="#3b82f6" />
          <div>
            <h3>{totalArea.toLocaleString()} ha</h3>
            <p>{t('cultivatedArea')}</p>
          </div>
        </div>
        <div className="summary-card">
          <Package size={32} color="#f59e0b" />
          <div>
            <h3>{totalProduction.toLocaleString()} tons</h3>
            <p>{t('totalProduction')}</p>
          </div>
        </div>
        <div className="summary-card">
          <TrendingUp size={32} color="#8b5cf6" />
          <div>
            <h3>{weather?.temperature || '--'}°C</h3>
            <p>{t('currentTemperature')}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Crop Distribution Pie Chart */}
        <div className="chart-card">
          <h3>{t('cropDistributionByArea')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {cropDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="crop-legend">
            {cropDistribution.map((crop) => (
              <div key={crop.name} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: crop.color }}></span>
                <span>{crop.name}: {crop.area} ha ({crop.farmers} {t('farmers')})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Trends Line Chart */}
        <div className="chart-card">
          <h3>{t('seasonalCroppingTrends')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={seasonalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rice" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="maize" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="wheat" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="groundnut" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Statistics Bar Chart */}
        <div className="chart-card">
          <h3>{t('regionalFarmerDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="farmers" fill="#10b981" />
              <Bar dataKey="area" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Market Price Trends */}
        <div className="chart-card">
          <h3>{t('liveMarketPriceAnalysis')}</h3>
          <div className="price-trends">
            {priceTrends.map((price) => (
              <div key={price.crop} className="price-trend-item">
                <div className="price-header">
                  <h4>{price.crop}</h4>
                  <span className={`trend-badge ${price.trend}`}>
                    {price.trend === 'up' ? '↑' : '↓'} {t(price.trend)}
                  </span>
                </div>
                <div className="price-values">
                  <div>
                    <span className="label">{t('current')}</span>
                    <span className="value">₹{price.current}</span>
                  </div>
                  <div>
                    <span className="label">{t('yesterday')}</span>
                    <span className="value">₹{price.yesterday}</span>
                  </div>
                  <div>
                    <span className="label">{t('weekAgo')}</span>
                    <span className="value">₹{price.weekAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Harvest Predictions Table */}
      <div className="harvest-predictions">
        <h3><Calendar size={24} /> {t('upcomingHarvestPredictions')}</h3>
        <table className="predictions-table">
          <thead>
            <tr>
              <th>{t('crop')}</th>
              <th>{t('expectedYield')}</th>
              <th>{t('readyDate')}</th>
              <th>{t('estimatedVolume')}</th>
            </tr>
          </thead>
          <tbody>
            {harvestPredictions.map((harvest) => (
              <tr key={harvest.crop}>
                <td><strong>{harvest.crop}</strong></td>
                <td>{harvest.expectedYield}</td>
                <td>{harvest.readyDate}</td>
                <td>{harvest.volume.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
