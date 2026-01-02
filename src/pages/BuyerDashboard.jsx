import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, Package, CheckCircle, Clock, Star, 
  Users, TrendingDown, MessageCircle, Filter 
} from 'lucide-react';
import { getUserOrders, updateOrderStatus, getListings, getAllUsers } from '../services/firebaseService';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [verifiedListings, setVerifiedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user orders
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = getUserOrders(user.uid, (userOrders) => {
      setOrders(userOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Load verified farmers with their listings from Firebase
  useEffect(() => {
    const unsubscribeListings = getListings((listings) => {
      // Filter active listings and format them for display
      const activeLis = listings.filter(l => l.status === 'active');
      
      // Get unique verified farmers
      const farmerListingsMap = {};
      activeLis.forEach(listing => {
        if (!farmerListingsMap[listing.userId] && listing.verified) {
          farmerListingsMap[listing.userId] = {
            id: listing.id,
            userId: listing.userId,
            farmer: listing.farmer || 'Unknown Farmer',
            rating: listing.rating || 0,
            totalDeliveries: listing.totalDeliveries || 0,
            successRate: listing.successRate || 0,
            crop: listing.crop,
            quantity: listing.quantity,
            unit: listing.unit,
            price: listing.price,
            harvestDate: listing.harvestDate,
            quality: listing.quality,
            verified: listing.verified || false,
            organic: listing.organic || false,
            certifications: []
          };
          
          if (listing.organic) {
            farmerListingsMap[listing.userId].certifications.push('Organic');
          }
        }
      });
      
      setVerifiedListings(Object.values(farmerListingsMap));
    });

    return () => unsubscribeListings();
  }, []);

  // Group buying opportunities (keeping as static for now - can be made dynamic later)
  const groupBuyingOpportunities = [
    {
      id: 'GB-001',
      fpo: 'Karnataka Farmers Producer Organization',
      crop: 'Rice',
      variety: 'IR 64',
      totalQuantity: 500,
      minOrderQuantity: 50,
      pricePerUnit: 1950,
      normalPrice: 2100,
      savings: 150,
      savingsPercent: 7.1,
      currentParticipants: 8,
      maxParticipants: 10,
      deadline: '2025-01-05',
      quality: 'Grade A',
      verified: true
    },
    {
      id: 'GB-002',
      fpo: 'Mandya Agricultural Cooperative',
      crop: 'Wheat',
      variety: 'Lokwan',
      totalQuantity: 300,
      minOrderQuantity: 30,
      pricePerUnit: 2200,
      normalPrice: 2350,
      savings: 150,
      savingsPercent: 6.4,
      currentParticipants: 5,
      maxParticipants: 10,
      deadline: '2025-01-08',
      quality: 'Premium',
      verified: true
    },
  ];

  // Verified farmer listings now loaded from Firebase via useEffect above

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#10b981';
      case 'completed': return '#10b981';
      case 'in-transit': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Calculate statistics from real orders
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'in-transit').length;
  const totalPurchaseValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
  const avgRating = completedOrders > 0 
    ? (orders.filter(o => o.status === 'completed' || o.status === 'delivered')
        .reduce((sum, o) => sum + (o.farmerRating || 0), 0) / completedOrders).toFixed(1)
    : 0;

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="buyer-dashboard-page">
      <div className="page-header">
        <div>
          <h1>
            <ShoppingBag size={32} />
            Buyer Dashboard
          </h1>
          <p>Manage your orders, track deliveries, and discover group buying opportunities</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            <Package size={32} />
          </div>
          <div className="stat-content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
            <span className="stat-change">{activeOrders} active orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>
            <CheckCircle size={32} />
          </div>
          <div className="stat-content">
            <h3>₹{(totalPurchaseValue / 100000).toFixed(2)}L</h3>
            <p>Total Purchase Value</p>
            <span className="stat-change">All time</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            <TrendingDown size={32} />
          </div>
          <div className="stat-content">
            <h3>Join Group</h3>
            <p>Potential Savings</p>
            <span className="stat-change positive">Via group buying</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            <Star size={32} />
          </div>
          <div className="stat-content">
            <h3>{avgRating || 'N/A'}</h3>
            <p>Avg Farmer Rating</p>
            <span className="stat-change">From your orders</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={20} />
          My Orders ({orders.length})
        </button>
        <button 
          className={`tab ${activeTab === 'groupBuying' ? 'active' : ''}`}
          onClick={() => setActiveTab('groupBuying')}
        >
          <Users size={20} />
          Group Buying
        </button>
        <button 
          className={`tab ${activeTab === 'verified' ? 'active' : ''}`}
          onClick={() => setActiveTab('verified')}
        >
          <CheckCircle size={20} />
          Verified Farmers
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          <div className="section-header">
            <h2>Order History & Tracking</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'in-transit' ? 'active' : ''}`}
                onClick={() => setFilterStatus('in-transit')}
              >
                In Transit
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
                onClick={() => setFilterStatus('delivered')}
              >
                Delivered
              </button>
            </div>
          </div>

          <div className="orders-grid">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div className="order-status" style={{ background: getStatusColor(order.status) }}>
                      {order.status.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="farmer-info">
                      <div className="farmer-avatar">👨‍🌾</div>
                      <div>
                        <h4>{order.farmer}</h4>
                        <div className="farmer-rating">
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{order.farmerRating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="crop-details">
                      <div className="detail-row">
                        <span className="label">Crop:</span>
                        <span className="value">{order.crop} ({order.variety})</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Quantity:</span>
                        <span className="value">{order.quantity} {order.unit}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Quality:</span>
                        <span className="value">
                          {order.quality}
                          {order.organic && <span className="organic-badge">🌱 Organic</span>}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Total Amount:</span>
                        <span className="value price">₹{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="delivery-info">
                      {order.status === 'delivered' || order.status === 'completed' ? (
                        <div className="delivered-info">
                          <CheckCircle size={20} color="#10b981" />
                          <span>Delivered on {new Date(order.deliveredDate || order.completedDate || order.createdAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <div className="expected-delivery">
                          <Clock size={20} />
                          <span>Expected by {new Date(order.expectedDelivery || order.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="order-actions">
                        {(order.status === 'delivered' || order.status === 'completed') && !order.reviewed && (
                          <button className="btn btn-primary">
                            <Star size={18} />
                            Rate & Review
                          </button>
                        )}
                        <button className="btn btn-secondary">
                          <MessageCircle size={18} />
                          Contact Farmer
                        </button>
                        {order.status !== 'delivered' && order.status !== 'completed' && (
                          <button className="btn btn-secondary">Track Order</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
              <div className="empty-state">
                <Package size={48} />
                <p>No orders found</p>
                {filterStatus !== 'all' && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setFilterStatus('all')}
                  >
                    View All Orders
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Group Buying Tab */}
      {activeTab === 'groupBuying' && (
        <div className="group-buying-section">
          <div className="section-header">
            <h2>
              <Users size={24} />
              Group Buying Opportunities from FPOs
            </h2>
            <p className="section-subtitle">Join with other buyers to get better prices and save costs</p>
          </div>

          <div className="group-buying-grid">
            {groupBuyingOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="group-buying-card">
                <div className="gb-header">
                  <div>
                    <h3>{opportunity.crop} - {opportunity.variety}</h3>
                    <p className="fpo-name">
                      {opportunity.verified && <CheckCircle size={16} color="#10b981" />}
                      {opportunity.fpo}
                    </p>
                  </div>
                  <div className="savings-badge">
                    Save {opportunity.savingsPercent}%
                  </div>
                </div>

                <div className="gb-body">
                  <div className="price-comparison">
                    <div className="normal-price">
                      <span className="label">Normal Price</span>
                      <span className="value strikethrough">₹{opportunity.normalPrice}</span>
                    </div>
                    <div className="group-price">
                      <span className="label">Group Price</span>
                      <span className="value highlight">₹{opportunity.pricePerUnit}</span>
                    </div>
                    <div className="savings">
                      <span>You save ₹{opportunity.savings}/quintal</span>
                    </div>
                  </div>

                  <div className="gb-details">
                    <div className="detail">
                      <span className="label">Total Quantity</span>
                      <span>{opportunity.totalQuantity} quintals</span>
                    </div>
                    <div className="detail">
                      <span className="label">Min Order</span>
                      <span>{opportunity.minOrderQuantity} quintals</span>
                    </div>
                    <div className="detail">
                      <span className="label">Quality</span>
                      <span>{opportunity.quality}</span>
                    </div>
                  </div>

                  <div className="participation-status">
                    <div className="participants-bar">
                      <div 
                        className="participants-fill"
                        style={{ width: `${(opportunity.currentParticipants / opportunity.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                    <span className="participants-text">
                      {opportunity.currentParticipants} / {opportunity.maxParticipants} buyers joined
                    </span>
                  </div>

                  <div className="deadline">
                    <Clock size={16} />
                    <span>Closes on {opportunity.deadline}</span>
                  </div>
                </div>

                <div className="gb-footer">
                  <button className="btn btn-primary btn-full">
                    Join Group Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="group-buying-benefits">
            <h3>Benefits of Group Buying</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <TrendingDown size={24} color="#10b981" />
                <h4>Lower Prices</h4>
                <p>Save 5-15% compared to individual purchases</p>
              </div>
              <div className="benefit-item">
                <CheckCircle size={24} color="#3b82f6" />
                <h4>Verified Quality</h4>
                <p>FPO-certified crops with quality guarantee</p>
              </div>
              <div className="benefit-item">
                <Package size={24} color="#f59e0b" />
                <h4>Bulk Benefits</h4>
                <p>Reduced transport and handling costs</p>
              </div>
              <div className="benefit-item">
                <Users size={24} color="#8b5cf6" />
                <h4>Community Support</h4>
                <p>Support farmer producer organizations</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Farmers Tab */}
      {activeTab === 'verified' && (
        <div className="verified-farmers-section">
          <div className="section-header">
            <h2>
              <CheckCircle size={24} />
              Verified Farmer Listings
            </h2>
            <p className="section-subtitle">High-rated farmers with proven track records</p>
          </div>

          <div className="verified-listings-grid">
            {verifiedListings.map((listing) => (
              <div key={listing.id} className="verified-listing-card">
                <div className="verified-badge">
                  <CheckCircle size={20} color="#10b981" />
                  <span>Verified Farmer</span>
                </div>

                <div className="farmer-profile">
                  <div className="farmer-avatar large">👨‍🌾</div>
                  <h3>{listing.farmer}</h3>
                  <div className="farmer-stats">
                    <div className="stat">
                      <Star size={18} fill="#f59e0b" color="#f59e0b" />
                      <span>{listing.rating}</span>
                    </div>
                    <div className="stat">
                      <Package size={18} />
                      <span>{listing.totalDeliveries} deliveries</span>
                    </div>
                    <div className="stat success">
                      <CheckCircle size={18} />
                      <span>{listing.successRate}% success</span>
                    </div>
                  </div>
                  <div className="certifications">
                    {listing.certifications.map((cert, index) => (
                      <span key={index} className="cert-badge">{cert}</span>
                    ))}
                  </div>
                </div>

                <div className="listing-details">
                  <h4>{listing.crop}</h4>
                  <div className="listing-info">
                    <div className="info-row">
                      <span>Quantity:</span>
                      <span>{listing.quantity} {listing.unit}</span>
                    </div>
                    <div className="info-row">
                      <span>Price:</span>
                      <span className="price">₹{listing.price}/{listing.unit}</span>
                    </div>
                    <div className="info-row">
                      <span>Quality:</span>
                      <span>{listing.quality}</span>
                    </div>
                    <div className="info-row">
                      <span>Harvest:</span>
                      <span>{listing.harvestDate}</span>
                    </div>
                  </div>
                </div>

                <div className="listing-actions">
                  <button className="btn btn-primary btn-full">
                    Place Order
                  </button>
                  <button className="btn btn-secondary btn-full">
                    <MessageCircle size={18} />
                    Contact Farmer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
