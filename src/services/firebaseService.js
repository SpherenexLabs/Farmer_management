import { ref, set, push, get, onValue, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';

// Listings Operations
export const createListing = async (userId, listingData) => {
  try {
    const listingsRef = ref(database, 'listings');
    const newListingRef = push(listingsRef);
    
    const listing = {
      ...listingData,
      userId,
      createdAt: new Date().toISOString(),
      status: 'active',
      id: newListingRef.key
    };
    
    await set(newListingRef, listing);
    return { success: true, id: newListingRef.key };
  } catch (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: error.message };
  }
};

export const getListings = (callback) => {
  const listingsRef = ref(database, 'listings');
  return onValue(listingsRef, (snapshot) => {
    const data = snapshot.val();
    const listings = data ? Object.values(data) : [];
    callback(listings);
  });
};

export const getUserListings = (userId, callback) => {
  const listingsRef = ref(database, 'listings');
  const userListingsQuery = query(listingsRef, orderByChild('userId'), equalTo(userId));
  
  return onValue(userListingsQuery, (snapshot) => {
    const data = snapshot.val();
    const listings = data ? Object.values(data) : [];
    callback(listings);
  });
};

export const updateListing = async (listingId, updates) => {
  try {
    const listingRef = ref(database, `listings/${listingId}`);
    await update(listingRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: error.message };
  }
};

export const deleteListing = async (listingId) => {
  try {
    const listingRef = ref(database, `listings/${listingId}`);
    await remove(listingRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: error.message };
  }
};

// Orders Operations
export const createOrder = async (orderData) => {
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    
    const order = {
      ...orderData,
      id: newOrderRef.key,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    await set(newOrderRef, order);
    return { success: true, id: newOrderRef.key };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

export const getOrders = (callback) => {
  const ordersRef = ref(database, 'orders');
  return onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    const orders = data ? Object.values(data) : [];
    callback(orders);
  });
};

export const getUserOrders = (userId, callback) => {
  const ordersRef = ref(database, 'orders');
  const userOrdersQuery = query(ordersRef, orderByChild('buyerId'), equalTo(userId));
  
  return onValue(userOrdersQuery, (snapshot) => {
    const data = snapshot.val();
    const orders = data ? Object.values(data) : [];
    callback(orders);
  });
};

export const getFarmerOrders = (farmerId, callback) => {
  const ordersRef = ref(database, 'orders');
  const farmerOrdersQuery = query(ordersRef, orderByChild('farmerId'), equalTo(farmerId));
  
  return onValue(farmerOrdersQuery, (snapshot) => {
    const data = snapshot.val();
    const orders = data ? Object.values(data) : [];
    callback(orders);
  });
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, { 
      status,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// User Profile Operations
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getAllUsers = (callback) => {
  const usersRef = ref(database, 'users');
  return onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const users = data ? Object.entries(data).map(([uid, userData]) => ({
      uid,
      ...userData
    })) : [];
    callback(users);
  });
};

// Analytics Operations
export const saveAnalyticsData = async (type, data) => {
  try {
    const analyticsRef = ref(database, `analytics/${type}`);
    const newDataRef = push(analyticsRef);
    
    await set(newDataRef, {
      ...data,
      timestamp: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving analytics:', error);
    return { success: false, error: error.message };
  }
};

export const getAnalyticsData = (type, callback) => {
  const analyticsRef = ref(database, `analytics/${type}`);
  return onValue(analyticsRef, (snapshot) => {
    const data = snapshot.val();
    const analytics = data ? Object.values(data) : [];
    callback(analytics);
  });
};

// Activity Log Operations
export const logActivity = async (userId, activityData) => {
  try {
    const activityRef = ref(database, `activities/${userId}`);
    const newActivityRef = push(activityRef);
    
    await set(newActivityRef, {
      ...activityData,
      timestamp: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

export const getUserActivities = (userId, callback) => {
  const activityRef = ref(database, `activities/${userId}`);
  return onValue(activityRef, (snapshot) => {
    const data = snapshot.val();
    const activities = data ? Object.values(data).sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ) : [];
    callback(activities);
  });
};

// System Logs for Admin
export const logSystemActivity = async (activityData) => {
  try {
    const logsRef = ref(database, 'systemLogs');
    const newLogRef = push(logsRef);
    
    await set(newLogRef, {
      ...activityData,
      timestamp: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging system activity:', error);
    return { success: false, error: error.message };
  }
};

export const getSystemLogs = (callback, limit = 50) => {
  const logsRef = ref(database, 'systemLogs');
  return onValue(logsRef, (snapshot) => {
    const data = snapshot.val();
    const logs = data ? Object.values(data)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit) : [];
    callback(logs);
  });
};

// Statistics Operations
export const updateStatistics = async (statType, value) => {
  try {
    const statsRef = ref(database, `statistics/${statType}`);
    await set(statsRef, {
      value,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating statistics:', error);
    return { success: false, error: error.message };
  }
};

export const getStatistics = (callback) => {
  const statsRef = ref(database, 'statistics');
  return onValue(statsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
};

// Transporter Management
export const getTransporters = (callback) => {
  const transportersRef = ref(database, 'transporters');
  return onValue(transportersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const transportersArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      callback(transportersArray);
    } else {
      callback([]);
    }
  });
};

export const createTransporter = async (transporterData) => {
  try {
    const transportersRef = ref(database, 'transporters');
    const newTransporterRef = push(transportersRef);
    
    await set(newTransporterRef, {
      ...transporterData,
      createdAt: Date.now(),
      status: 'active',
      rating: transporterData.rating || 5.0,
      deliveries: transporterData.deliveries || 0
    });
    
    return { success: true, id: newTransporterRef.key };
  } catch (error) {
    console.error('Error creating transporter:', error);
    return { success: false, error: error.message };
  }
};

export const updateTransporter = async (transporterId, updates) => {
  try {
    const transporterRef = ref(database, `transporters/${transporterId}`);
    await update(transporterRef, {
      ...updates,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating transporter:', error);
    return { success: false, error: error.message };
  }
};

export const deleteTransporter = async (transporterId) => {
  try {
    const transporterRef = ref(database, `transporters/${transporterId}`);
    await remove(transporterRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting transporter:', error);
    return { success: false, error: error.message };
  }
};

// Transport Bookings Management
export const createTransportBooking = async (bookingData) => {
  try {
    const bookingsRef = ref(database, 'transportBookings');
    const newBookingRef = push(bookingsRef);
    
    await set(newBookingRef, {
      ...bookingData,
      bookingId: newBookingRef.key,
      bookedAt: Date.now(),
      status: bookingData.status || 'booked'
    });
    
    return { success: true, id: newBookingRef.key };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: error.message };
  }
};

export const getTransportBookings = (userId, callback) => {
  const bookingsRef = ref(database, 'transportBookings');
  return onValue(bookingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const bookingsArray = Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key]
        }))
        .filter(booking => 
          booking.buyerId === userId || booking.farmerId === userId
        );
      callback(bookingsArray);
    } else {
      callback([]);
    }
  });
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = ref(database, `transportBookings/${bookingId}`);
    await update(bookingRef, {
      status,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { success: false, error: error.message };
  }
};

// Admin User Management
export const deleteUser = async (userId) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await remove(userRef);
    
    // Log the action
    await logActivity('Admin', 'delete_user', `Deleted user ${userId}`, 'warning');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

export const suspendUser = async (userId, suspended = true) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      suspended,
      suspendedAt: suspended ? new Date().toISOString() : null
    });
    
    await logActivity('Admin', suspended ? 'suspend_user' : 'unsuspend_user', 
      `${suspended ? 'Suspended' : 'Unsuspended'} user ${userId}`, 'warning');
    return { success: true };
  } catch (error) {
    console.error('Error suspending user:', error);
    return { success: false, error: error.message };
  }
};

export const verifyUser = async (userId, verified = true) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      verified,
      verifiedAt: verified ? new Date().toISOString() : null
    });
    
    await logActivity('Admin', 'verify_user', `Verified user ${userId}`, 'success');
    return { success: true };
  } catch (error) {
    console.error('Error verifying user:', error);
    return { success: false, error: error.message };
  }
};
