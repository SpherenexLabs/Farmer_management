import { ref, push, set, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';

// Create a new farming activity (sowing/harvesting)
export const createActivity = async (farmerId, activityData) => {
  try {
    const activitiesRef = ref(database, 'farmingActivities');
    const newActivityRef = push(activitiesRef);
    
    const activity = {
      ...activityData,
      id: newActivityRef.key,
      farmerId,
      createdAt: new Date().toISOString(),
      status: activityData.type === 'sowing' ? 'sown' : 'harvested'
    };
    
    await set(newActivityRef, activity);
    return { success: true, id: newActivityRef.key };
  } catch (error) {
    console.error('Error creating activity:', error);
    return { success: false, error: error.message };
  }
};

// Get activities for a farmer
export const getFarmerActivities = (farmerId, callback) => {
  const activitiesRef = ref(database, 'farmingActivities');
  const farmerActivitiesQuery = query(activitiesRef, orderByChild('farmerId'), equalTo(farmerId));
  
  return onValue(farmerActivitiesQuery, (snapshot) => {
    const data = snapshot.val();
    const activities = data ? Object.values(data).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ) : [];
    callback(activities);
  });
};

// Update activity status
export const updateActivity = async (activityId, updates) => {
  try {
    const activityRef = ref(database, `farmingActivities/${activityId}`);
    await set(activityRef, updates, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating activity:', error);
    return { success: false, error: error.message };
  }
};

// Get activity statistics
export const getActivityStats = async (farmerId) => {
  try {
    const activitiesRef = ref(database, 'farmingActivities');
    const farmerActivitiesQuery = query(activitiesRef, orderByChild('farmerId'), equalTo(farmerId));
    
    const snapshot = await get(farmerActivitiesQuery);
    if (!snapshot.exists()) {
      return { totalSown: 0, totalHarvested: 0, totalArea: 0, crops: [] };
    }
    
    const activities = Object.values(snapshot.val());
    const sowingActivities = activities.filter(a => a.type === 'sowing');
    const harvestingActivities = activities.filter(a => a.type === 'harvesting');
    
    const totalArea = sowingActivities.reduce((sum, a) => sum + (parseFloat(a.area) || 0), 0);
    const crops = [...new Set(activities.map(a => a.crop))];
    
    return {
      totalSown: sowingActivities.length,
      totalHarvested: harvestingActivities.length,
      totalArea: totalArea.toFixed(2),
      crops
    };
  } catch (error) {
    console.error('Error getting activity stats:', error);
    return { totalSown: 0, totalHarvested: 0, totalArea: 0, crops: [] };
  }
};
