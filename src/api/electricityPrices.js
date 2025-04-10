import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

// Fingrid API endpoint for electricity price data
const FINGRID_API_URL = API_CONFIG.FINGRID_BASE_URL;

// Price variable ID in Fingrid API
const PRICE_VARIABLE_ID = '248'; // Nord Pool Finland price variable ID

// API key from configuration
const API_KEY = API_CONFIG.API_KEY;

// Axios instance with auth header
const fingridApi = axios.create({
  headers: {
    'x-api-key': API_KEY,
  },
});

/**
 * Fetch current electricity price from Fingrid API
 * @returns {Promise} - Resolves to current price in €/kWh
 */
export const getCurrentPrice = async () => {
  try {
    const response = await fingridApi.get(`${FINGRID_API_URL}/${PRICE_VARIABLE_ID}/events/json`, {
      params: {
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour ahead
      },
    });
    
    // The API returns price in €/MWh, need to divide by 1000 to convert to €/kWh
    const priceInMWh = response.data[0]?.value || 0;
    const priceInKWh = priceInMWh / 1000;
    
    return priceInKWh;
  } catch (error) {
    console.error('Error fetching current price:', error);
    // Return a default price if API call fails
    return 0.12; // Default 12 cents per kWh
  }
};

/**
 * Fetch hourly electricity prices for the current day
 * @returns {Promise} - Resolves to array of hourly prices
 */
export const getHourlyPrices = async () => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const response = await fingridApi.get(`${FINGRID_API_URL}/${PRICE_VARIABLE_ID}/events/json`, {
      params: {
        start_time: today.toISOString(),
        end_time: tomorrow.toISOString(),
      },
    });
    
    // Process and transform the data
    return response.data.map(item => {
      const hour = new Date(item.start_time).getHours();
      // Convert from €/MWh to €/kWh
      const price = item.value / 1000;
      
      return { hour, price };
    });
  } catch (error) {
    console.error('Error fetching hourly prices:', error);
    
    // Return mock hourly data if API call fails
    const mockHourlyData = [];
    for (let i = 0; i < 24; i++) {
      // Generate somewhat realistic price
      const basePrice = 0.10; // 10 cents
      const variation = (Math.sin(i * Math.PI / 12) * 0.05) + (Math.random() * 0.02);
      mockHourlyData.push({
        hour: i,
        price: basePrice + variation,
      });
    }
    
    return mockHourlyData;
  }
};

/**
 * Fetch daily average prices for the past week
 * @returns {Promise} - Resolves to array of daily average prices
 */
export const getDailyPrices = async () => {
  try {
    // Get date from 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date at midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const response = await fingridApi.get(`${FINGRID_API_URL}/${PRICE_VARIABLE_ID}/events/json`, {
      params: {
        start_time: oneWeekAgo.toISOString(),
        end_time: tomorrow.toISOString(),
      },
    });
    
    // Process the data to get daily averages
    const dailyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Group by day and calculate averages
    const groupedByDay = response.data.reduce((acc, item) => {
      const date = new Date(item.start_time);
      const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!acc[dayKey]) {
        acc[dayKey] = {
          day: days[date.getDay()],
          values: [],
          date: date, // Store date for sorting
        };
      }
      
      acc[dayKey].values.push(item.value);
      return acc;
    }, {});
    
    // Calculate averages and convert to the format we need
    Object.values(groupedByDay).forEach(day => {
      const sum = day.values.reduce((a, b) => a + b, 0);
      const average = sum / day.values.length / 1000; // Convert to €/kWh
      
      dailyData.push({
        day: day.day,
        average,
        date: day.date,
      });
    });
    
    // Sort by date
    dailyData.sort((a, b) => a.date - b.date);
    
    // Return only the last 7 days if we have more
    return dailyData.slice(-7);
    
  } catch (error) {
    console.error('Error fetching daily prices:', error);
    
    // Return mock daily data if API call fails
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      average: 0.10 + (Math.random() * 0.05), // Random price between 0.10 and 0.15 €/kWh
    }));
  }
};

/**
 * Find the best time to run an appliance based on price
 * @param {number} duration - Duration of the appliance run in hours
 * @returns {Promise} - Resolves to the best starting hour (0-23)
 */
export const findBestTimeToRun = async (duration = 1) => {
  // Get hourly prices
  const hourlyPrices = await getHourlyPrices();
  
  let bestStartHour = 0;
  let lowestTotalCost = Infinity;
  
  // Find the consecutive 'duration' hours with the lowest total cost
  for (let startHour = 0; startHour <= 24 - duration; startHour++) {
    let totalCost = 0;
    
    for (let h = 0; h < duration; h++) {
      const hourData = hourlyPrices.find(data => data.hour === (startHour + h) % 24);
      if (hourData) {
        totalCost += hourData.price;
      }
    }
    
    if (totalCost < lowestTotalCost) {
      lowestTotalCost = totalCost;
      bestStartHour = startHour;
    }
  }
  
  return {
    startHour: bestStartHour,
    endHour: (bestStartHour + duration) % 24,
    averagePrice: lowestTotalCost / duration,
  };
};

export default {
  getCurrentPrice,
  getHourlyPrices,
  getDailyPrices,
  findBestTimeToRun,
};