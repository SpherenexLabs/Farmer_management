import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    cropPlanning: 'Crop Planning',
    analytics: 'Analytics',
    marketplace: 'Marketplace',
    marketIntel: 'Market Intel',
    buyerHub: 'Buyer Hub',
    trustCenter: 'Trust Center',
    voiceSupport: 'Voice Support',
    adminDashboard: 'Admin Dashboard',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    
    // Common
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Module specific
    cropRecommendations: 'Crop Recommendations',
    weatherAlerts: 'Weather Alerts',
    soilHealth: 'Soil Health',
    fertilizerSchedule: 'Fertilizer Schedule',
    irrigationSchedule: 'Irrigation Schedule',
    pestForecasting: 'Pest & Disease Forecasting',
    
    // Analytics Page
    analyticsSubtitle: 'Real-time farming analytics and market insights',
    loadingAnalytics: 'Loading analytics data...',
    unableToLoad: 'Unable to load analytics data',
    totalFarmers: 'Total Farmers',
    cultivatedArea: 'Cultivated Area',
    totalProduction: 'Total Production',
    currentTemperature: 'Current Temperature',
    cropDistributionByArea: 'Crop Distribution by Area',
    seasonalCroppingTrends: 'Seasonal Cropping Trends (Last 6 Months)',
    regionalFarmerDistribution: 'Regional Farmer Distribution',
    liveMarketPriceAnalysis: 'Live Market Price Analysis (₹/Quintal)',
    upcomingHarvestPredictions: 'Upcoming Harvest Predictions',
    crop: 'Crop',
    expectedYield: 'Expected Yield',
    readyDate: 'Ready Date',
    estimatedVolume: 'Estimated Volume (tons)',
    rice: 'Rice',
    maize: 'Maize',
    wheat: 'Wheat',
    groundnut: 'Groundnut',
    current: 'Current',
    yesterday: 'Yesterday',
    weekAgo: 'Week Ago',
    farmers: 'farmers',
    up: 'up',
    down: 'down',
  },
  kn: {
    // Navigation (Kannada)
    home: 'ಮುಖಪುಟ',
    cropPlanning: 'ಬೆಳೆ ಯೋಜನೆ',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    marketplace: 'ಮಾರುಕಟ್ಟೆ',
    marketIntel: 'ಮಾರುಕಟ್ಟೆ ಒಳನೋಟ',
    buyerHub: 'ಖರೀದಿದಾರ ಕೇಂದ್ರ',
    trustCenter: 'ವಿಶ್ವಾಸ ಕೇಂದ್ರ',
    voiceSupport: 'ವಾಚ್ ಸಹಾಯ',
    adminDashboard: 'ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    profile: 'ಪ್ರೊಫೈಲ್',
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗೌಟ್',
    
    // Common
    welcome: 'ಸ್ವಾಗತ',
    dashboard: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್',
    save: 'ಉಳಿಸು',
    cancel: 'ರದ್ದುಮಾಡಿ',
    submit: 'ಸಲ್ಲಿಸು',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    
    // Module specific
    cropRecommendations: 'ಬೆಳೆ ಶಿಫಾರಸುಗಳು',
    weatherAlerts: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
    soilHealth: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ',
    fertilizerSchedule: 'ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ',
    irrigationSchedule: 'ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ',
    pestForecasting: 'ಕೀಟ ಮತ್ತು ರೋಗ ಮುನ್ಸೂಚನೆ',
    
    // Analytics Page
    analyticsSubtitle: 'ನೈಜ ಸಮಯದ ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು',
    loadingAnalytics: 'ವಿಶ್ಲೇಷಣಾ ಡೇಟಾವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    unableToLoad: 'ವಿಶ್ಲೇಷಣಾ ಡೇಟಾವನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ',
    totalFarmers: 'ಒಟ್ಟು ರೈತರು',
    cultivatedArea: 'ಕೃಷಿ ಮಾಡಿದ ಪ್ರದೇಶ',
    totalProduction: 'ಒಟ್ಟು ಉತ್ಪಾದನೆ',
    currentTemperature: 'ಪ್ರಸ್ತುತ ತಾಪಮಾನ',
    cropDistributionByArea: 'ಪ್ರದೇಶದ ಮೂಲಕ ಬೆಳೆ ವಿತರಣೆ',
    seasonalCroppingTrends: 'ಕಾಲೋಚಿತ ಬೆಳೆ ಪ್ರವೃತ್ತಿಗಳು (ಕಳೆದ 6 ತಿಂಗಳು)',
    regionalFarmerDistribution: 'ಪ್ರಾದೇಶಿಕ ರೈತರ ವಿತರಣೆ',
    liveMarketPriceAnalysis: 'ನೇರ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ (₹/ಕ್ವಿಂಟಾಲ್)',
    upcomingHarvestPredictions: 'ಮುಂಬರುವ ಕೊಯ್ಲು ಭವಿಷ್ಯ',
    crop: 'ಬೆಳೆ',
    expectedYield: 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ',
    readyDate: 'ಸಿದ್ಧ ದಿನಾಂಕ',
    estimatedVolume: 'ಅಂದಾಜು ಪ್ರಮಾಣ (ಟನ್)',
    rice: 'ಅಕ್ಕಿ',
    maize: 'ಜೋಳ',
    wheat: 'ಗೋಧಿ',
    groundnut: 'ಕಡಲೆಕಾಯಿ',
    current: 'ಪ್ರಸ್ತುತ',
    yesterday: 'ನಿನ್ನೆ',
    weekAgo: 'ವಾರದ ಹಿಂದೆ',
    farmers: 'ರೈತರು',
    up: 'ಹೆಚ್ಚು',
    down: 'ಕಡಿಮೆ',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'kn' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    toggleLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
