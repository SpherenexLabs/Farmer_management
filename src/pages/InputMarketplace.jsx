import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Package, Search, Filter, ShoppingCart, Star, Loader } from 'lucide-react';
import { getListings, createListing } from '../services/firebaseService';

const InputMarketplace = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample products (in production, these would come from Firebase)
  const sampleProducts = [
    {
      id: 'seed1',
      name: 'BPT 5204 Rice Seeds',
      category: 'seeds',
      price: 2500,
      unit: 'kg',
      seller: 'Karnataka Seeds Corporation',
      rating: 4.8,
      inStock: true,
      description: 'High-yield paddy seeds, suitable for Karnataka climate',
      image: '🌾'
    },
    {
      id: 'seed2',
      name: 'DHM 117 Maize Seeds',
      category: 'seeds',
      price: 800,
      unit: 'kg',
      seller: 'Maize Seed Agency',
      rating: 4.6,
      inStock: true,
      description: 'Hybrid maize seeds with excellent disease resistance',
      image: '🌽'
    },
    {
      id: 'fert1',
      name: 'Urea Fertilizer (46% N)',
      category: 'fertilizers',
      price: 280,
      unit: '50kg bag',
      seller: 'IFFCO',
      rating: 4.9,
      inStock: true,
      description: 'High-quality nitrogen fertilizer for all crops',
      image: '💊'
    },
    {
      id: 'fert2',
      name: 'DAP (Di-Ammonium Phosphate)',
      category: 'fertilizers',
      price: 1350,
      unit: '50kg bag',
      seller: 'RCF',
      rating: 4.7,
      inStock: true,
      description: 'Phosphate-rich fertilizer for root development',
      image: '💊'
    },
    {
      id: 'fert3',
      name: 'Organic Compost',
      category: 'fertilizers',
      price: 450,
      unit: '50kg bag',
      seller: 'Green Earth Organics',
      rating: 4.8,
      inStock: true,
      description: 'Fully decomposed organic matter, enriches soil',
      image: '🌱'
    },
    {
      id: 'pest1',
      name: 'Bio-Pesticide (Neem Based)',
      category: 'pesticides',
      price: 650,
      unit: 'liter',
      seller: 'EcoAgro Solutions',
      rating: 4.5,
      inStock: true,
      description: 'Organic pest control, safe for environment',
      image: '🧪'
    },
    {
      id: 'tool1',
      name: 'Knapsack Sprayer (16L)',
      category: 'tools',
      price: 1200,
      unit: 'piece',
      seller: 'AgriTools India',
      rating: 4.6,
      inStock: true,
      description: 'Manual sprayer for pesticides and fertilizers',
      image: '🎒'
    },
    {
      id: 'tool2',
      name: 'Drip Irrigation Kit',
      category: 'tools',
      price: 8500,
      unit: '1 acre kit',
      seller: 'Jain Irrigation',
      rating: 4.9,
      inStock: true,
      description: 'Complete drip irrigation system for 1 acre',
      image: '💧'
    },
    {
      id: 'tool3',
      name: 'Power Weeder',
      category: 'tools',
      price: 12500,
      unit: 'piece',
      seller: 'VST Tillers',
      rating: 4.7,
      inStock: true,
      description: 'Petrol-powered weeder for efficient weed removal',
      image: '⚙️'
    },
    {
      id: 'tool4',
      name: 'Soil Testing Kit',
      category: 'tools',
      price: 2500,
      unit: 'kit',
      seller: 'AgriLab',
      rating: 4.8,
      inStock: true,
      description: 'Test NPK, pH levels at home',
      image: '🧪'
    }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'All Products', icon: '📦' },
    { id: 'seeds', name: 'Seeds', icon: '🌾' },
    { id: 'fertilizers', name: 'Fertilizers', icon: '💊' },
    { id: 'pesticides', name: 'Pesticides', icon: '🧪' },
    { id: 'tools', name: 'Tools & Equipment', icon: '⚙️' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    alert(`${product.name} added to cart!\nPrice: ₹${product.price}/${product.unit}`);
  };

  if (loading) {
    return (
      <div className="input-marketplace-page">
        <div className="loading">
          <Loader size={48} className="spinner" />
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="input-marketplace-page">
      <div className="page-header">
        <div>
          <h1>
            <Package size={32} />
            Input Marketplace
          </h1>
          <p>Seeds, Fertilizers, Tools & Equipment for modern farming</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="marketplace-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters */}
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

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <span className="product-emoji">{product.image}</span>
              {product.inStock && <span className="stock-badge">In Stock</span>}
            </div>

            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>

              <div className="product-seller">
                <span>Sold by: {product.seller}</span>
              </div>

              <div className="product-rating">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span>{product.rating}</span>
              </div>

              <div className="product-footer">
                <div className="product-price">
                  <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="unit">/{product.unit}</span>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <Package size={64} color="#ccc" />
          <h3>No products found</h3>
          <p>Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Info Section */}
      <div className="marketplace-info">
        <div className="info-card">
          <h3>🚚 Free Delivery</h3>
          <p>On orders above ₹5,000</p>
        </div>
        <div className="info-card">
          <h3>✅ Quality Assured</h3>
          <p>All products are verified and certified</p>
        </div>
        <div className="info-card">
          <h3>💰 Best Prices</h3>
          <p>Direct from manufacturers</p>
        </div>
        <div className="info-card">
          <h3>📞 Expert Support</h3>
          <p>Get help choosing the right products</p>
        </div>
      </div>
    </div>
  );
};

export default InputMarketplace;
