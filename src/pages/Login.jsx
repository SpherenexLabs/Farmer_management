import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'farmer',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login (handles both admin and regular users)
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Redirect based on role
          if (result.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      } else {
        // Signup with Firebase
        const result = await signup(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          location: formData.location
        });
        
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Signup failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p>{isLogin ? 'Sign in to your account' : 'Register to get started'}</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>
                    <User size={20} />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={20} />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <MapPin size={20} />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Village, Taluk, District"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <User size={20} />
                    <span>Role</span>
                  </label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required={!isLogin}
                    disabled={loading}
                  >
                    <option value="farmer">Farmer</option>
                    <option value="customer">Customer</option>
                    <option value="buyer">Buyer/Wholesaler</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label>
                <Mail size={20} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <Lock size={20} />
                <span>Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="login-switch">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="switch-btn"
                disabled={loading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-info">
          <h2>Farmer Management System</h2>
          <ul>
            <li>✓ AI-driven crop recommendations</li>
            <li>✓ Real-time weather alerts</li>
            <li>✓ Direct market access</li>
            <li>✓ Bilingual support (English & Kannada)</li>
            <li>✓ Analytics & insights</li>
          </ul>
          
          <div className="admin-info">
            <h3>🔐 Admin Dashboard</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
              Analytics • User Management • System Monitoring
            </p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7, fontStyle: 'italic' }}>
              Admin login: admin@farmmanagement.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
