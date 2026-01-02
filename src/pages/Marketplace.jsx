import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Plus, Search, Filter, MessageCircle, ShoppingCart, 
  Truck, MapPin, Calendar, DollarSign, User, Star, Phone, Clock, Package, CheckCircle 
} from 'lucide-react';
import { 
  getListings, 
  getUserListings, 
  createListing, 
  updateListing, 
  deleteListing,
  createOrder,
  logActivity,
  getOrders,
  getTransporters,
  createTransporter,
  deleteTransporter,
  createTransportBooking,
  getTransportBookings
} from '../services/firebaseService';

const Marketplace = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(user?.role === 'farmer' ? 'myListings' : 'browse');
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cropListings, setCropListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [transportBookings, setTransportBookings] = useState([]);
  const [showTransporterModal, setShowTransporterModal] = useState(false);

  // Fetch orders for transport tab
  useEffect(() => {
    if (user && activeTab === 'transport') {
      const unsubscribe = getOrders((orderData) => {
        const userOrders = orderData.filter(o => 
          o.buyerId === user.uid || o.farmerId === user.uid
        );
        setOrders(userOrders);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  // Fetch transporters from Firebase
  useEffect(() => {
    if (activeTab === 'transport') {
      const unsubscribe = getTransporters((transportersData) => {
        setTransporters(transportersData);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  // Fetch transport bookings
  useEffect(() => {
    if (user && activeTab === 'transport') {
      const unsubscribe = getTransportBookings(user.uid, (bookingsData) => {
        setTransportBookings(bookingsData);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  // Fetch all listings for browse tab
  useEffect(() => {
    if (activeTab === 'browse') {
      const unsubscribe = getListings((listings) => {
        setCropListings(listings.filter(l => l.status === 'active'));
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  // Fetch user's listings
  useEffect(() => {
    if (user && activeTab === 'myListings') {
      const unsubscribe = getUserListings(user.uid, (listings) => {
        setMyListings(listings);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  // Remove old mock data
  const oldCropListings = [
    {
      id: 1,
      farmer: 'Rajesh Kumar',
      farmerLocation: 'Mandya, Karnataka',
      crop: 'Rice',
      kannadaName: 'ಅಕ್ಕಿ',
      variety: 'BPT 5204',
      quantity: 50,
      unit: 'quintals',
      price: 2100,
      harvestDate: '2024-12-15',
      quality: 'Grade A',
      organic: true,
      rating: 4.8,
      image: '🌾'
    },
    {
      id: 2,
      farmer: 'Manjunath S',
      farmerLocation: 'Hassan, Karnataka',
      crop: 'Maize',
      kannadaName: 'ಜೋಳ',
      variety: 'DHM 117',
      quantity: 35,
      unit: 'quintals',
      price: 1850,
      harvestDate: '2024-12-20',
      quality: 'Grade A',
      organic: false,
      rating: 4.5,
      image: '🌽'
    },
    {
      id: 3,
      farmer: 'Lakshmi Devi',
      farmerLocation: 'Mysore, Karnataka',
      crop: 'Groundnut',
      kannadaName: 'ಕಡಲೆಕಾಯಿ',
      variety: 'TMV 2',
      quantity: 25,
      unit: 'quintals',
      price: 5500,
      harvestDate: '2024-12-10',
      quality: 'Premium',
      organic: true,
      rating: 4.9,
      image: '🥜'
    },
    {
      id: 4,
      farmer: 'Suresh Gowda',
      farmerLocation: 'Bangalore Rural, Karnataka',
      crop: 'Tomato',
      kannadaName: 'ಟೊಮೇಟೋ',
      variety: 'Hybrid',
      quantity: 100,
      unit: 'kg',
      price: 35,
      harvestDate: '2024-12-05',
      quality: 'Grade A',
      organic: false,
      rating: 4.6,
      image: '🍅'
    }
  ];

  const handleCreateListing = () => {
    setShowListingModal(true);
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const listingData = {
      farmer: user.name || 'Unknown Farmer',
      farmerLocation: user.location || 'Karnataka',
      crop: formData.get('crop'),
      variety: formData.get('variety'),
      quantity: parseInt(formData.get('quantity')),
      unit: formData.get('unit'),
      price: parseInt(formData.get('price')),
      harvestDate: formData.get('harvestDate'),
      quality: formData.get('quality'),
      organic: formData.get('organic') === 'on',
      details: formData.get('details'),
      rating: 5.0,
      image: getCropEmoji(formData.get('crop')),
      kannadaName: getKannadaName(formData.get('crop'))
    };
    
    const result = await createListing(user.uid, listingData);
    
    if (result.success) {
      await logActivity(user.uid, {
        action: 'Created new listing',
        details: `${listingData.crop} - ${listingData.quantity} ${listingData.unit}`,
        type: 'marketplace'
      });
      setShowListingModal(false);
      alert('Listing created successfully!');
    } else {
      alert('Error creating listing: ' + result.error);
    }
  };

  const handleBuyNow = async (listing) => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    if (user.uid === listing.userId) {
      alert('You cannot buy your own listing');
      return;
    }

    const totalAmount = listing.price * listing.quantity;
    
    // Razorpay Payment Integration
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Test API Key
      amount: totalAmount * 100, // Amount in paise (₹1 = 100 paise)
      currency: 'INR',
      name: 'Farmer Management',
      description: `${listing.crop} - ${listing.quantity} ${listing.unit}`,
      image: '/vite.svg',
      handler: async function (response) {
        // Payment successful
        const orderData = {
          buyerId: user.uid,
          buyerName: user.name,
          buyerEmail: user.email,
          buyerPhone: user.phone,
          farmerId: listing.userId,
          farmerName: listing.farmer, // Fixed: use listing.farmer instead of listing.farmerName
          farmerLocation: listing.farmerLocation,
          farmerRating: listing.rating || 0,
          listingId: listing.id,
          crop: listing.crop,
          variety: listing.variety,
          quantity: listing.quantity,
          unit: listing.unit,
          pricePerUnit: listing.price,
          totalAmount: totalAmount,
          quality: listing.quality,
          organic: listing.organic,
          paymentId: response.razorpay_payment_id,
          paymentStatus: 'completed',
          status: 'pending',
          orderDate: Date.now(),
          expectedDelivery: Date.now() + (5 * 24 * 60 * 60 * 1000)
        };

        const result = await createOrder(orderData);
        if (result.success) {
          await logActivity(user.uid, {
            action: `Ordered ${listing.crop} - ${listing.quantity} ${listing.unit}`,
            details: `Order ID: ${result.id}, Payment ID: ${response.razorpay_payment_id}`,
            type: 'marketplace'
          });
          await logActivity(listing.userId, {
            action: `New order received for ${listing.crop}`,
            details: `Order ID: ${result.id}, Buyer: ${user.name}`,
            type: 'marketplace'
          });
          alert(`Payment Successful! \nPayment ID: ${response.razorpay_payment_id}\nOrder placed successfully!`);
        } else {
          alert('Error placing order: ' + result.error);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || ''
      },
      notes: {
        crop: listing.crop,
        farmer: listing.farmer,
        quantity: `${listing.quantity} ${listing.unit}`
      },
      theme: {
        color: '#10b981'
      },
      modal: {
        ondismiss: function() {
          alert('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      alert(`Payment Failed!\nError: ${response.error.description}`);
    });
    razorpay.open();
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const result = await deleteListing(listingId);
      if (result.success) {
        await logActivity(user.uid, {
          action: 'Deleted listing',
          details: `Listing ID: ${listingId}`,
          type: 'marketplace'
        });
        alert('Listing deleted successfully!');
      } else {
        alert('Error deleting listing: ' + result.error);
      }
    }
  };
  const handleBookTransport = (order, transporter) => {
    setSelectedOrder(order);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (formData) => {
    const booking = {
      orderId: formData.orderId,
      buyerId: user.uid,
      buyerName: user.name,
      farmerId: formData.farmerId,
      transporterId: formData.transporterId,
      transporterName: formData.transporterName,
      vehicleType: formData.vehicleType,
      pickupLocation: formData.pickup,
      deliveryLocation: formData.delivery,
      distance: parseFloat(formData.distance),
      cost: parseFloat(formData.cost),
      pickupDate: formData.pickupDate,
      status: 'booked'
    };

    const result = await createTransportBooking(booking);
    
    if (result.success) {
      await logActivity(user.uid, {
        action: 'Booked transport',
        details: `${booking.transporterName} - ₹${booking.cost}`,
        type: 'transport'
      });
      alert(`Transport booked successfully! Booking ID: ${result.id}`);
    } else {
      alert('Error booking transport: ' + result.error);
    }
  };

  const calculateCost = (distance, pricePerKm) => {
    return Math.round(distance * pricePerKm);
  };

  const handleAddTransporter = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const transporterData = {
      name: formData.get('name'),
      vehicleType: formData.get('vehicleType'),
      pricePerKm: parseFloat(formData.get('pricePerKm')),
      phone: formData.get('phone'),
      location: formData.get('location'),
      email: formData.get('email'),
      available: formData.get('available') === 'on',
      rating: 5.0,
      deliveries: 0
    };
    
    const result = await createTransporter(transporterData);
    
    if (result.success) {
      setShowTransporterModal(false);
      alert('Transporter added successfully!');
    } else {
      alert('Error adding transporter: ' + result.error);
    }
  };

  const handleDeleteTransporter = async (transporterId) => {
    if (window.confirm('Are you sure you want to delete this transporter?')) {
      const result = await deleteTransporter(transporterId);
      if (result.success) {
        alert('Transporter deleted successfully!');
      } else {
        alert('Error deleting transporter: ' + result.error);
      }
    }
  };

  const getCropEmoji = (cropName) => {
    const emojiMap = {
      'rice': '🌾',
      'wheat': '🌾',
      'maize': '🌽',
      'corn': '🌽',
      'groundnut': '🥜',
      'peanut': '🥜',
      'tomato': '🍅',
      'potato': '🥔',
      'onion': '🧅',
      'chili': '🌶️',
      'pepper': '🌶️'
    };
    return emojiMap[cropName.toLowerCase()] || '🌿';
  };

  const getKannadaName = (cropName) => {
    const kannadaMap = {
      'rice': 'ಅಕ್ಕಿ',
      'wheat': 'ಗೋಧಿ',
      'maize': 'ಜೋಳ',
      'groundnut': 'ಕಡಲೆಕಾಯಿ',
      'tomato': 'ಟೊಮೇಟೋ',
      'potato': 'ಆಲೂಗಡ್ಡೆ',
      'onion': 'ಈರುಳ್ಳಿ',
      'chili': 'ಮೆಣಸಿನಕಾಯಿ'
    };
    return kannadaMap[cropName.toLowerCase()] || cropName;
  };

  const filteredListings = cropListings.filter(listing => {
    // Exclude user's own listings from browse tab
    if (user && listing.userId === user.uid) {
      return false;
    }
    
    const matchesSearch = listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          (selectedCategory === 'organic' && listing.organic);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading marketplace...</div>;
  }

  return (
    <div className="marketplace-page">
      <div className="page-header">
        <h1>{t('marketplace')}</h1>
        <p>Direct Farmer-to-Customer marketplace</p>
        {user?.role === 'farmer' && (
          <button className="btn btn-primary" onClick={handleCreateListing}>
            <Plus size={20} />
            Create New Listing
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          <ShoppingCart size={20} />
          Browse Listings
        </button>
        {user?.role === 'farmer' && (
          <button 
            className={`tab ${activeTab === 'myListings' ? 'active' : ''}`}
            onClick={() => setActiveTab('myListings')}
          >
            <User size={20} />
            My Listings
          </button>
        )}
        <button 
          className={`tab ${activeTab === 'transport' ? 'active' : ''}`}
          onClick={() => setActiveTab('transport')}
        >
          <Truck size={20} />
          Transport
        </button>
      </div>

      {/* Browse Listings Tab */}
      {activeTab === 'browse' && (
        <div className="browse-section">
          {/* Filters */}
          <div className="marketplace-filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search crops, farmers, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Crops
              </button>
              <button 
                className={`filter-btn ${selectedCategory === 'organic' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('organic')}
              >
                <Filter size={16} />
                Organic Only
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="listing-image">
                  <span className="crop-emoji">{listing.image}</span>
                  {listing.organic && (
                    <span className="organic-badge">🌱 Organic</span>
                  )}
                </div>
                <div className="listing-content">
                  <div className="listing-header">
                    <div>
                      <h3>{listing.crop}</h3>
                      <p className="kannada-name">{listing.kannadaName}</p>
                      <p className="variety">{listing.variety}</p>
                    </div>
                    <div className="rating">
                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                      <span>{listing.rating}</span>
                    </div>
                  </div>

                  <div className="listing-details">
                    <div className="detail-row">
                      <User size={16} />
                      <span>{listing.farmer}</span>
                    </div>
                    <div className="detail-row">
                      <MapPin size={16} />
                      <span>{listing.farmerLocation}</span>
                    </div>
                    <div className="detail-row">
                      <Calendar size={16} />
                      <span>Harvest: {listing.harvestDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="quality-badge">{listing.quality}</span>
                    </div>
                  </div>

                  <div className="listing-footer">
                    <div className="price-section">
                      <span className="price">₹{listing.price}</span>
                      <span className="unit">per {listing.unit}</span>
                    </div>
                    <div className="quantity">
                      <span>{listing.quantity} {listing.unit}</span>
                    </div>
                  </div>

                  <div className="listing-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBuyNow(listing)}
                    >
                      <ShoppingCart size={18} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <p>No listings found. {user?.role === 'farmer' ? 'Create your first listing!' : 'Check back later for new listings.'}</p>
            </div>
          )}
        </div>
      )}

      {/* My Listings Tab */}
      {activeTab === 'myListings' && (
        <div className="my-listings-section">
          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Posted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{listing.crop} ({listing.variety})</td>
                    <td>{listing.quantity} {listing.unit}</td>
                    <td>₹{listing.price}</td>
                    <td>
                      <span className={`status-badge ${listing.status.toLowerCase()}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {myListings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <p>You haven't created any listings yet. Click "Create New Listing" to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Transport Tab */}
      {activeTab === 'transport' && (
        <div className="transport-section">
          <div className="section-header">
            <h2>
              <Truck size={24} />
              Transport & Logistics
            </h2>
            <p>Book reliable transport for your orders</p>
          </div>

          {/* Available Transporters */}
          <div className="transporters-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Available Transport Providers</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowTransporterModal(true)}
              >
                <Plus size={18} />
                Add Transporter
              </button>
            </div>
            <div className="transporters-grid">
              {transporters.map(transporter => (
                <div key={transporter.id} className={`transporter-card ${!transporter.available ? 'unavailable' : ''}`}>
                  <div className="transporter-header">
                    <div className="transporter-info">
                      <h4>{transporter.name}</h4>
                      <div className="rating">
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span>{transporter.rating}</span>
                        <span className="deliveries">({transporter.deliveries} deliveries)</span>
                      </div>
                    </div>
                    <div className={`availability-badge ${transporter.available ? 'available' : 'busy'}`}>
                      {transporter.available ? 'Available' : 'Busy'}
                    </div>
                  </div>
                  <div className="transporter-details">
                    <div className="detail-item">
                      <Truck size={18} />
                      <span>{transporter.vehicleType}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={18} />
                      <span>{transporter.location}</span>
                    </div>
                    <div className="detail-item">
                      <Phone size={18} />
                      <span>{transporter.phone}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={18} />
                      <span>₹{transporter.pricePerKm}/km</span>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <button 
                      className="btn btn-danger btn-sm"
                      style={{ marginTop: '10px', width: '100%' }}
                      onClick={() => handleDeleteTransporter(transporter.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {transporters.length === 0 && (
              <div className="empty-state">
                <Truck size={48} strokeWidth={1} style={{ color: '#94a3b8' }} />
                <p>No transporters available. Add transporters to get started.</p>
              </div>
            )}
          </div>

          {/* Orders Needing Transport */}
          <div className="orders-transport-section">
            <h3>Your Orders</h3>
            {orders.length > 0 ? (
              <div className="orders-transport-list">
                {orders.map(order => (
                  <div key={order.id} className="order-transport-card">
                    <div className="order-info-section">
                      <div className="order-header-info">
                        <h4>{order.crop} - {order.quantity} {order.unit}</h4>
                        <span className={`status-badge ${order.status}`}>{order.status}</span>
                      </div>
                      <div className="order-details-grid">
                        <div className="detail">
                          <User size={16} />
                          <span>{order.farmerName}</span>
                        </div>
                        <div className="detail">
                          <MapPin size={16} />
                          <span>{order.farmerLocation || 'Karnataka'}</span>
                        </div>
                        <div className="detail">
                          <Package size={16} />
                          <span>₹{order.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div className="detail">
                          <Calendar size={16} />
                          <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transport Calculator */}
                    <div className="transport-calculator">
                      <h5>Book Transport</h5>
                      <div className="calculator-form">
                        <div className="calc-row">
                          <label>Distance (km)</label>
                          <input 
                            type="number" 
                            placeholder="Enter distance" 
                            id={`distance-${order.id}`}
                            onChange={(e) => {
                              const distance = parseFloat(e.target.value) || 0;
                              const select = document.getElementById(`transporter-${order.id}`);
                              const pricePerKm = select ? parseFloat(select.value) : 15;
                              const cost = calculateCost(distance, pricePerKm);
                              document.getElementById(`cost-${order.id}`).textContent = `₹${cost}`;
                            }}
                          />
                        </div>
                        <div className="calc-row">
                          <label>Select Transporter</label>
                          <select 
                            id={`transporter-${order.id}`}
                            onChange={(e) => {
                              const pricePerKm = parseFloat(e.target.value);
                              const distanceInput = document.getElementById(`distance-${order.id}`);
                              const distance = parseFloat(distanceInput.value) || 0;
                              const cost = calculateCost(distance, pricePerKm);
                              document.getElementById(`cost-${order.id}`).textContent = `₹${cost}`;
                            }}
                          >
                            {transporters.filter(t => t.available).map(t => (
                              <option key={t.id} value={t.pricePerKm}>
                                {t.name} - ₹{t.pricePerKm}/km
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="calc-result">
                          <strong>Estimated Cost:</strong>
                          <span id={`cost-${order.id}`} className="cost-value">₹0</span>
                        </div>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            const distance = document.getElementById(`distance-${order.id}`).value;
                            const select = document.getElementById(`transporter-${order.id}`);
                            const transporter = transporters.find(t => t.pricePerKm === parseFloat(select.value));
                            
                            if (!distance || distance <= 0) {
                              alert('Please enter valid distance');
                              return;
                            }

                            const booking = {
                              orderId: order.id,
                              farmerId: order.farmerId,
                              transporterId: transporter.id,
                              transporterName: transporter.name,
                              vehicleType: transporter.vehicleType,
                              pickup: order.farmerLocation || 'Karnataka',
                              delivery: order.buyerLocation || 'Delivery Location',
                              distance: parseFloat(distance),
                              cost: calculateCost(parseFloat(distance), transporter.pricePerKm),
                              pickupDate: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]
                            };

                            handleConfirmBooking(booking);
                          }}
                        >
                          <CheckCircle size={16} />
                          Book Transport
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Package size={48} strokeWidth={1} style={{ color: '#94a3b8' }} />
                <p>No orders available for transport booking</p>
              </div>
            )}
          </div>

          {/* Booked Transports */}
          {transportBookings.length > 0 && (
            <div className="booked-transports-section">
              <h3>Booked Transports</h3>
              <div className="bookings-list">
                {transportBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h4>Booking #{booking.id}</h4>
                      <span className="status-badge booked">Booked</span>
                    </div>
                    <div className="booking-details">
                      <div className="detail-row">
                        <strong>Transporter:</strong>
                        <span>{booking.transporterName}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Vehicle:</strong>
                        <span>{booking.vehicleType}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Route:</strong>
                        <span>{booking.pickupLocation} → {booking.deliveryLocation}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Distance:</strong>
                        <span>{booking.distance} km</span>
                      </div>
                      <div className="detail-row">
                        <strong>Cost:</strong>
                        <span className="cost-highlight">₹{booking.cost}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Pickup Date:</strong>
                        <span>{booking.pickupDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Transporter Modal */}
      {showTransporterModal && (
        <div className="modal-overlay" onClick={() => setShowTransporterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Transport Provider</h2>
              <button className="close-btn" onClick={() => setShowTransporterModal(false)}>×</button>
            </div>
            <form className="listing-form" onSubmit={handleAddTransporter}>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" name="name" placeholder="e.g., Express Logistics" required />
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select name="vehicleType" required>
                    <option value="">Select vehicle</option>
                    <option value="Mini Truck (1 Ton)">Mini Truck (1 Ton)</option>
                    <option value="Medium Truck (3 Ton)">Medium Truck (3 Ton)</option>
                    <option value="Large Truck (5 Ton)">Large Truck (5 Ton)</option>
                    <option value="Tempo (500 kg)">Tempo (500 kg)</option>
                    <option value="Pickup Van">Pickup Van</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price per KM (₹)</label>
                  <input type="number" name="pricePerKm" placeholder="e.g., 15" required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="transporter@example.com" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" placeholder="e.g., Bangalore" required />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="available" defaultChecked />
                  <span>Currently Available</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTransporterModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Transporter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showListingModal && (
        <div className="modal-overlay" onClick={() => setShowListingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Listing</h2>
              <button className="close-btn" onClick={() => setShowListingModal(false)}>×</button>
            </div>
            <form className="listing-form" onSubmit={handleSubmitListing}>
              <div className="form-row">
                <div className="form-group">
                  <label>Crop Name</label>
                  <input type="text" name="crop" placeholder="e.g., Rice" required />
                </div>
                <div className="form-group">
                  <label>Variety</label>
                  <input type="text" name="variety" placeholder="e.g., BPT 5204" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" name="quantity" placeholder="Enter quantity" required />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select name="unit" required>
                    <option value="">Select unit</option>
                    <option value="quintals">Quintals</option>
                    <option value="kg">Kilograms</option>
                    <option value="tons">Tons</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price per Unit (₹)</label>
                  <input type="number" name="price" placeholder="Enter price" required />
                </div>
                <div className="form-group">
                  <label>Harvest Date</label>
                  <input type="date" name="harvestDate" required />
                </div>
              </div>
              <div className="form-group">
                <label>Quality Grade</label>
                <select name="quality" required>
                  <option value="">Select grade</option>
                  <option value="Premium">Premium</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="organic" />
                  <span>This is an organic crop</span>
                </label>
              </div>
              <div className="form-group">
                <label>Additional Details</label>
                <textarea name="details" placeholder="Add any additional information..." rows="4"></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowListingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
