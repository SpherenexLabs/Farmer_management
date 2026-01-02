import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🌾</span>
          <span className="brand-text">Farmer Management</span>
        </Link>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
            {t('home')}
          </Link>
          {user && (
            <>
              <Link to="/crop-planning" className={`nav-link ${location.pathname === '/crop-planning' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                {t('cropPlanning')}
              </Link>
              <Link to="/analytics" className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                {t('analytics')}
              </Link>
              <Link to="/marketplace" className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                {t('marketplace')}
              </Link>
              <Link to="/market-intelligence" className={`nav-link ${location.pathname === '/market-intelligence' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                {t('marketIntel')}
              </Link>
              {user.role === 'buyer' || user.role === 'customer' ? (
                <Link to="/buyer-dashboard" className={`nav-link ${location.pathname === '/buyer-dashboard' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  {t('buyerHub')}
                </Link>
              ) : null}
              <Link to="/voice-support" className={`nav-link ${location.pathname === '/voice-support' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                {t('voiceSupport')}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  {t('adminDashboard')}
                </Link>
              )}
            </>
          )}
        </div>

        <div className="nav-actions">
          <button className="language-btn" onClick={toggleLanguage} title="Toggle Language">
            <Globe size={20} />
            <span>{language.toUpperCase()}</span>
          </button>

          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="profile-btn">
                <User size={20} />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={20} />
                <span>{t('logout')}</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
