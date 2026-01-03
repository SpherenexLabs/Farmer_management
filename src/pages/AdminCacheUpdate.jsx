import { useState } from 'react';
import '../App.css';

function AdminCacheUpdate() {
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [lastUpdate, setLastUpdate] = useState(localStorage.getItem('lastCacheUpdate') || 'Never');
  const commodities = ['Rice', 'Maize', 'Wheat', 'Cotton', 'Sugarcane'];

  const handleUpdateCache = async () => {
    setUpdating(true);
    setStatus('Updating market data cache on server...');
    
    try {
      let allSucceeded = true;
      for (const commodity of commodities) {
        setStatus(`Fetching ${commodity}...`);
        const resp = await fetch(`/api/update-cache?commodity=${encodeURIComponent(commodity)}&state=Karnataka`, {
          method: 'POST'
        });

        const data = await resp.json().catch(() => ({ success: false, error: 'Invalid JSON' }));

        if (data.success) {
          setStatus(`✅ Cached ${commodity}: ${data.records || 0} records`);
        } else {
          setStatus(`⚠️ ${commodity}: ${data.error || 'No data'}`);
          allSucceeded = false;
        }

        // small gap between commodities
        await new Promise(r => setTimeout(r, 500));
      }

      if (allSucceeded) {
        const now = new Date().toLocaleString();
        setLastUpdate(now);
        localStorage.setItem('lastCacheUpdate', now);
        setStatus('✅ Cache updated successfully! All market data is now fresh.');
      } else {
        setStatus('⚠️ Finished with some errors. See above messages.');
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>🔄 Market Data Cache Manager</h1>
        <p>Update real-time market prices from government AGMARKNET API</p>
      </div>

      <div className="admin-cache-card">
        <h3>Cache Status</h3>
        <div className="cache-info">
          <p><strong>Last Updated:</strong> {lastUpdate}</p>
          <p><strong>Data Source:</strong> AGMARKNET Government API</p>
          <p><strong>Commodities:</strong> Rice, Maize, Wheat, Cotton, Sugarcane</p>
          <p><strong>State:</strong> Karnataka</p>
        </div>

        <button 
          className="primary-button"
          onClick={handleUpdateCache}
          disabled={updating}
          style={{ marginTop: '20px' }}
        >
          {updating ? 'Updating...' : 'Update Market Data Now'}
        </button>

        {status && (
          <div className={`status-message ${status.includes('✅') ? 'success' : 'error'}`}>
            {status}
          </div>
        )}

        <div className="cache-instructions">
          <h4>How to use:</h4>
          <ol>
            <li>Click "Update Market Data Now" to fetch latest prices from government API</li>
            <li>This process takes 30-60 seconds as it fetches data for all commodities</li>
            <li>Data is stored in Firebase for instant access across the app</li>
            <li>Update daily or whenever you need fresh market prices</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AdminCacheUpdate;
