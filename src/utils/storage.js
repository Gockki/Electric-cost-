import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  CUSTOM_APPLIANCES: 'fin_electricity_tracker_custom_appliances',
  SETTINGS: 'fin_electricity_tracker_settings',
  PRICE_HISTORY: 'fin_electricity_tracker_price_history',
};

/**
 * Save custom appliance settings
 * @param {Array} appliances - Array of appliance objects
 * @returns {Promise} - AsyncStorage promise
 */
export const saveAppliances = async (appliances) => {
  try {
    const jsonValue = JSON.stringify(appliances);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_APPLIANCES, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving appliances:', error);
    return false;
  }
};

/**
 * Load custom appliance settings
 * @returns {Promise} - Resolves to array of appliance objects
 */
export const loadAppliances = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_APPLIANCES);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading appliances:', error);
    return null;
  }
};

/**
 * Save app settings
 * @param {Object} settings - Settings object
 * @returns {Promise} - AsyncStorage promise
 */
export const saveSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Load app settings
 * @returns {Promise} - Resolves to settings object
 */
export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

/**
 * Save price history data
 * @param {Array} priceHistory - Array of price history objects
 * @returns {Promise} - AsyncStorage promise
 */
export const savePriceHistory = async (priceHistory) => {
  try {
    const jsonValue = JSON.stringify(priceHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving price history:', error);
    return false;
  }
};

/**
 * Load price history data
 * @returns {Promise} - Resolves to array of price history objects
 */
export const loadPriceHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading price history:', error);
    return [];
  }
};

/**
 * Clear all app data
 * @returns {Promise} - AsyncStorage promise
 */
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};

export default {
  saveAppliances,
  loadAppliances,
  saveSettings,
  loadSettings,
  savePriceHistory,
  loadPriceHistory,
  clearAllData,
};