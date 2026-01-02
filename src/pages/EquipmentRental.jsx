import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Tractor, Calendar, MapPin, IndianRupee, Phone, Star, Clock, Loader } from 'lucide-react';

const EquipmentRental = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [category, setCategory] = useState('all');
  const [equipment, setEquipment] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    duration: 1,
    location: ''
  });

  // Sample equipment data (in production, fetch from Firebase)
  const sampleEquipment = [
    {
      id: 'trac1',
      name: 'Mahindra 575 DI Tractor',
      category: 'tractors',
      hourlyRate: 500,
      dailyRate: 3500,
      hp: 45,
      owner: 'Ramesh Kumar',
      location: 'Kolar, Karnataka',
      rating: 4.8,
      reviews: 24,
      available: true,
      phone: '+91 98765 43210',
      description: '45 HP tractor with all attachments, well maintained',
      image: '🚜'
    },
    {
      id: 'trac2',
      name: 'John Deere 5050 E',
      category: 'tractors',
      hourlyRate: 600,
      dailyRate: 4200,
      hp: 50,
      owner: 'Farmers Cooperative Society',
      location: 'Chikballapur, Karnataka',
      rating: 4.9,
      reviews: 45,
      available: true,
      phone: '+91 98765 43211',
      description: '50 HP premium tractor with rotavator',
      image: '🚜'
    },
    {
      id: 'harv1',
      name: 'Mini Combine Harvester',
      category: 'harvesters',
      hourlyRate: 1200,
      dailyRate: 8000,
      owner: 'AgriMech Services',
      location: 'Tumakuru, Karnataka',
      rating: 4.7,
      reviews: 18,
      available: true,
      phone: '+91 98765 43212',
      description: 'Suitable for paddy, wheat, and maize harvesting',
      image: '🌾'
    },
    {
      id: 'harv2',
      name: 'Reaper Binder Machine',
      category: 'harvesters',
      hourlyRate: 800,
      dailyRate: 5500,
      owner: 'Suresh Agri Equipment',
      location: 'Bangalore Rural',
      rating: 4.6,
      reviews: 32,
      available: true,
      phone: '+91 98765 43213',
      description: 'Cuts and binds crops in one operation',
      image: '🌾'
    },
    {
      id: 'spray1',
      name: 'Power Sprayer (Petrol)',
      category: 'sprayers',
      hourlyRate: 200,
      dailyRate: 1200,
      owner: 'Krishna Rentals',
      location: 'Kolar, Karnataka',
      rating: 4.5,
      reviews: 15,
      available: true,
      phone: '+91 98765 43214',
      description: 'High-pressure sprayer for large fields',
      image: '💦'
    },
    {
      id: 'spray2',
      name: 'Drone Sprayer',
      category: 'sprayers',
      hourlyRate: 1500,
      dailyRate: 10000,
      owner: 'TechFarm Solutions',
      location: 'Bangalore',
      rating: 5.0,
      reviews: 8,
      available: true,
      phone: '+91 98765 43215',
      description: 'Advanced drone technology for precision spraying',
      image: '🚁'
    },
    {
      id: 'till1',
      name: 'Rotavator (7ft)',
      category: 'tillers',
      hourlyRate: 400,
      dailyRate: 2800,
      owner: 'Village Equipment Hire',
      location: 'Chikballapur',
      rating: 4.7,
      reviews: 28,
      available: true,
      phone: '+91 98765 43216',
      description: '7 feet rotavator for soil preparation',
      image: '⚙️'
    },
    {
      id: 'till2',
      name: 'Power Tiller',
      category: 'tillers',
      hourlyRate: 350,
      dailyRate: 2500,
      owner: 'Manjunath Equipment',
      location: 'Kolar',
      rating: 4.6,
      reviews: 22,
      available: true,
      phone: '+91 98765 43217',
      description: 'Compact power tiller for small and medium farms',
      image: '⚙️'
    }
  ];

  useEffect(() => {
    setEquipment(sampleEquipment);
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'All Equipment', icon: '🚜' },
    { id: 'tractors', name: 'Tractors', icon: '🚜' },
    { id: 'harvesters', name: 'Harvesters', icon: '🌾' },
    { id: 'sprayers', name: 'Sprayers', icon: '💦' },
    { id: 'tillers', name: 'Tillers', icon: '⚙️' }
  ];

  const filteredEquipment = equipment.filter(item => 
    category === 'all' || item.category === category
  );

  const handleBookNow = (item) => {
    setSelectedEquipment(item);
    setShowBookingModal(true);
    setBookingData({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      duration: 1,
      location: ''
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const totalCost = bookingData.duration * selectedEquipment.dailyRate;
    alert(`Booking Confirmed!\n\nEquipment: ${selectedEquipment.name}\nDuration: ${bookingData.duration} day(s)\nTotal Cost: ₹${totalCost.toLocaleString('en-IN')}\n\nOwner will contact you at: ${user?.phoneNumber || 'your registered number'}`);
    setShowBookingModal(false);
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const duration = calculateDuration(bookingData.startDate, bookingData.endDate);
      setBookingData(prev => ({ ...prev, duration }));
    }
  }, [bookingData.startDate, bookingData.endDate]);

  if (loading) {
    return (
      <div className="equipment-rental-page">
        <div className="loading">
          <Loader size={48} className="spinner" />
          <p>Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="equipment-rental-page">
      <div className="page-header">
        <div>
          <h1>
            <Tractor size={32} />
            Equipment Rental
          </h1>
          <p>Rent tractors, harvesters, and farm machinery at affordable rates</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="equipment-grid">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="equipment-card">
            <div className="equipment-header">
              <span className="equipment-emoji">{item.image}</span>
              {item.available && <span className="available-badge">Available</span>}
            </div>

            <div className="equipment-details">
              <h3>{item.name}</h3>
              {item.hp && <p className="equipment-spec">Power: {item.hp} HP</p>}
              <p className="equipment-description">{item.description}</p>

              <div className="equipment-owner">
                <span>Owner: {item.owner}</span>
              </div>

              <div className="equipment-location">
                <MapPin size={16} />
                <span>{item.location}</span>
              </div>

              <div className="equipment-rating">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span>{item.rating} ({item.reviews} reviews)</span>
              </div>

              <div className="equipment-pricing">
                <div className="price-item">
                  <Clock size={16} />
                  <span>₹{item.hourlyRate}/hour</span>
                </div>
                <div className="price-item">
                  <Calendar size={16} />
                  <span>₹{item.dailyRate.toLocaleString('en-IN')}/day</span>
                </div>
              </div>

              <div className="equipment-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBookNow(item)}
                >
                  <Calendar size={16} />
                  Book Now
                </button>
                <a href={`tel:${item.phone}`} className="btn btn-secondary">
                  <Phone size={16} />
                  Call Owner
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedEquipment && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {selectedEquipment.name}</h2>
              <button className="close-btn" onClick={() => setShowBookingModal(false)}>×</button>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={bookingData.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={bookingData.endDate}
                  min={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration: {bookingData.duration} day(s)</label>
              </div>

              <div className="form-group">
                <label>Your Location (Village/Taluk)</label>
                <input
                  type="text"
                  value={bookingData.location}
                  onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                  placeholder="Enter pickup location"
                  required
                />
              </div>

              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-row">
                  <span>Daily Rate:</span>
                  <span>₹{selectedEquipment.dailyRate.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Duration:</span>
                  <span>{bookingData.duration} day(s)</span>
                </div>
                <div className="summary-row total">
                  <span>Total Cost:</span>
                  <span>₹{(bookingData.duration * selectedEquipment.dailyRate).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="rental-info">
        <h2>Why Rent Equipment?</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>💰 Cost Effective</h3>
            <p>Save money by renting instead of buying expensive equipment</p>
          </div>
          <div className="info-card">
            <h3>🔧 Well Maintained</h3>
            <p>All equipment is regularly serviced and in good condition</p>
          </div>
          <div className="info-card">
            <h3>📞 Easy Booking</h3>
            <p>Book online or call the owner directly</p>
          </div>
          <div className="info-card">
            <h3>🚚 Flexible Duration</h3>
            <p>Rent by the hour or by the day as per your needs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentRental;
