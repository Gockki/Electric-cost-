import axios from 'axios';

// Base URL for the sahkohinta-api
const API_BASE_URL = 'https://www.sahkohinta-api.fi/api/v1';

/**
 * Fetch current electricity price
 * @returns {Promise} - Resolves to current price in €/kWh
 */
export const getCurrentPrice = async () => {
  try {
    // Get the current hour in Finnish time
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Get cheapest hour for today to check if today's data is available
    const response = await axios.get(`${API_BASE_URL}/halpa`, {
      params: {
        tunnit: 1,
        tulos: 'haja',
        aikaraja: today
      }
    });
    
    if (response.data && response.data.length > 0) {
      // If data is available, find the current hour's price
      const currentHour = now.getHours();
      
      // Get all hours for today
      const allHoursResponse = await axios.get(`${API_BASE_URL}/halpa`, {
        params: {
          tunnit: 24,
          tulos: 'haja',
          aikaraja: today
        }
      });
      
      // Find the current hour's data
      const currentHourData = allHoursResponse.data.find(item => {
        const itemHour = new Date(item.aikaleima_suomi).getHours();
        return itemHour === currentHour;
      });
      
      if (currentHourData) {
        // Convert from cents/kWh to euros/kWh
        return parseFloat(currentHourData.hinta) / 100;
      }
    }
    
    // If couldn't get current hour price, return a default
    return 0.12; // Default 12 cents (0.12€) per kWh
  } catch (error) {
    console.error('Error fetching current price:', error);
    return 0.12; // Default price if API call fails
  }
};

/**
 * Fetch hourly electricity prices for the current day
 * @returns {Promise} - Resolves to array of hourly prices
 */
export const getHourlyPrices = async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get all 24 hours for today
    const response = await axios.get(`${API_BASE_URL}/halpa`, {
      params: {
        tunnit: 24, // All hours of the day
        tulos: 'haja',
        aikaraja: today
      }
    });
    
    if (response.data && response.data.length > 0) {
      // Convert API response to our format
      return response.data.map(item => {
        const hour = new Date(item.aikaleima_suomi).getHours();
        const price = parseFloat(item.hinta) / 100; // Convert cents to euros
        
        return { hour, price };
      });
    } else {
      // If no data available for today, try to get tomorrow's data
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const tomorrowResponse = await axios.get(`${API_BASE_URL}/halpa`, {
        params: {
          tunnit: 24, // All hours of the day
          tulos: 'haja',
          aikaraja: tomorrowStr
        }
      });
      
      if (tomorrowResponse.data && tomorrowResponse.data.length > 0) {
        // Convert API response to our format
        return tomorrowResponse.data.map(item => {
          const hour = new Date(item.aikaleima_suomi).getHours();
          const price = parseFloat(item.hinta) / 100; // Convert cents to euros
          
          return { hour, price };
        });
      }
      
      // If still no data, throw error to use mock data
      throw new Error('No hourly price data available');
    }
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
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData = [];
    
    // Get data for each of the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get all hours for this day
      const response = await axios.get(`${API_BASE_URL}/halpa`, {
        params: {
          tunnit: 24, // All hours of the day
          tulos: 'haja',
          aikaraja: dateStr
        }
      });
      
      if (response.data && response.data.length > 0) {
        // Calculate average price for the day
        const sum = response.data.reduce((acc, item) => acc + parseFloat(item.hinta), 0);
        const average = sum / response.data.length / 100; // Convert to €/kWh
        
        dailyData.push({
          day: days[date.getDay()],
          average,
          date,
        });
      } else {
        // If no data for this day, add placeholder
        dailyData.push({
          day: days[date.getDay()],
          average: null,
          date,
        });
      }
    }
    
    // Filter out days with no data
    const validData = dailyData.filter(item => item.average !== null);
    
    if (validData.length > 0) {
      return validData;
    } else {
      throw new Error('No daily price data available');
    }
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
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Use the API's built-in functionality for finding cheapest consecutive hours
    const response = await axios.get(`${API_BASE_URL}/halpa`, {
      params: {
        tunnit: duration,
        tulos: 'sarja', // Get consecutive hours
        aikaraja: today
      }
    });
    
    if (response.data && response.data.length > 0) {
      // Extract start and end hours
      const startHour = new Date(response.data[0].aikaleima_suomi).getHours();
      const endHour = (startHour + duration) % 24;
      
      // Calculate average price
      const totalPrice = response.data.reduce((acc, item) => acc + parseFloat(item.hinta), 0);
      const averagePrice = totalPrice / response.data.length / 100; // Convert to €/kWh
      
      return {
        startHour,
        endHour,
        averagePrice,
      };
    } else {
      // Try tomorrow if today's data is not available
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const tomorrowResponse = await axios.get(`${API_BASE_URL}/halpa`, {
        params: {
          tunnit: duration,
          tulos: 'sarja', // Get consecutive hours
          aikaraja: tomorrowStr
        }
      });
      
      if (tomorrowResponse.data && tomorrowResponse.data.length > 0) {
        // Extract start and end hours
        const startHour = new Date(tomorrowResponse.data[0].aikaleima_suomi).getHours();
        const endHour = (startHour + duration) % 24;
        
        // Calculate average price
        const totalPrice = tomorrowResponse.data.reduce((acc, item) => acc + parseFloat(item.hinta), 0);
        const averagePrice = totalPrice / tomorrowResponse.data.length / 100; // Convert to €/kWh
        
        return {
          startHour,
          endHour,
          averagePrice,
        };
      }
      
      throw new Error('Could not find best time to run appliance');
    }
  } catch (error) {
    console.error('Error finding best time to run:', error);
    
    // Get hourly prices and calculate manually if API's built-in functionality fails
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
  }
};

export default {
  getCurrentPrice,
  getHourlyPrices,
  getDailyPrices,
  findBestTimeToRun,
};