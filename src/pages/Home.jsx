import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, BarChart3, ShoppingCart, Cloud, Leaf, TrendingUp } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Sprout size={48} />,
      title: 'AI-Driven Crop Planning',
      description: 'Get personalized crop recommendations based on weather, soil health, and market trends',
      link: '/crop-planning',
      color: '#10b981'
    },
    {
      icon: <BarChart3 size={48} />,
      title: 'Farmer Analytics',
      description: 'Track your farm performance with detailed analytics and predictive insights',
      link: '/analytics',
      color: '#3b82f6'
    },
    {
      icon: <ShoppingCart size={48} />,
      title: 'F2C Marketplace',
      description: 'Sell directly to customers without intermediaries and get better prices',
      link: '/marketplace',
      color: '#f59e0b'
    },
    {
      icon: <Cloud size={48} />,
      title: 'Weather Alerts',
      description: 'Real-time weather updates and alerts in Kannada & English',
      link: '/crop-planning',
      color: '#06b6d4'
    },
    {
      icon: <Leaf size={48} />,
      title: 'Pest Forecasting',
      description: 'Early warnings for pest and disease outbreaks with preventive measures',
      link: '/crop-planning',
      color: '#84cc16'
    },
    {
      icon: <TrendingUp size={48} />,
      title: 'Market Intelligence',
      description: 'Stay updated with market prices and demand forecasts',
      link: '/marketplace',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Empowering Farmers with <span className="highlight">Data-Driven Insights</span>
          </h1>
          <p className="hero-subtitle">
            Plan better, grow smarter, and connect directly with customers through our comprehensive farmer management platform
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/crop-planning" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/about" className="btn btn-secondary">
                  Learn More
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            🌾🚜🌱
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Our Features</h2>
          <p>Comprehensive tools to help you succeed in modern farming</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              to={user ? feature.link : '/login'} 
              key={index} 
              className="feature-card"
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Registered Farmers</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Crop Varieties Supported</p>
          </div>
          <div className="stat-card">
            <h3>95%</h3>
            <p>Accuracy in Predictions</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="objectives">
        <div className="section-header">
          <h2>Our Mission</h2>
        </div>
        <div className="objectives-content">
          <div className="objective">
            <div className="objective-number">1</div>
            <div className="objective-text">
              <h3>Data-Driven Insights</h3>
              <p>Empower farmers with actionable insights for crop planning, fertilization, irrigation, and harvest timing</p>
            </div>
          </div>
          <div className="objective">
            <div className="objective-number">2</div>
            <div className="objective-text">
              <h3>Direct Market Access</h3>
              <p>Establish a Farmer-to-Customer marketplace, reducing dependency on intermediaries</p>
            </div>
          </div>
          <div className="objective">
            <div className="objective-number">3</div>
            <div className="objective-text">
              <h3>Real-Time Alerts</h3>
              <p>Deliver weather-based alerts, market intelligence, and personalized advisory services</p>
            </div>
          </div>
          <div className="objective">
            <div className="objective-number">4</div>
            <div className="objective-text">
              <h3>Transparency & Trust</h3>
              <p>Enhance transparency and traceability through AI analytics and blockchain integration</p>
            </div>
          </div>
          <div className="objective">
            <div className="objective-number">5</div>
            <div className="objective-text">
              <h3>Inclusive Interface</h3>
              <p>Bilingual, voice-assisted app interface for farmers with varying literacy levels</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta">
          <div className="cta-content">
            <h2>Ready to Transform Your Farming?</h2>
            <p>Join thousands of farmers who are already using our platform</p>
            <Link to="/login" className="btn btn-primary btn-large">
              Join Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
