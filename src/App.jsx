import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import CropPlanning from './pages/CropPlanning';
import Analytics from './pages/Analytics';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import VoiceSupport from './pages/VoiceSupport';
import MarketIntelligence from './pages/MarketIntelligence';
import BuyerDashboard from './pages/BuyerDashboard';
import TrustCenter from './pages/TrustCenter';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import FarmingActivity from './pages/FarmingActivity';
import InputMarketplace from './pages/InputMarketplace';
import EquipmentRental from './pages/EquipmentRental';
import GovernmentSchemes from './pages/GovernmentSchemes';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/crop-planning"
                  element={
                    <ProtectedRoute>
                      <CropPlanning />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/voice-support"
                  element={
                    <ProtectedRoute>
                      <VoiceSupport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/market-intelligence"
                  element={
                    <ProtectedRoute>
                      <MarketIntelligence />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buyer-dashboard"
                  element={
                    <ProtectedRoute>
                      <BuyerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trust-center"
                  element={
                    <ProtectedRoute>
                      <TrustCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farming-activity"
                  element={
                    <ProtectedRoute>
                      <FarmingActivity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/input-marketplace"
                  element={
                    <ProtectedRoute>
                      <InputMarketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/equipment-rental"
                  element={
                    <ProtectedRoute>
                      <EquipmentRental />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/government-schemes"
                  element={
                    <ProtectedRoute>
                      <GovernmentSchemes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={<AdminDashboard />}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
