/**
 * Calculate electricity cost for an appliance
 * @param {number} powerConsumption - Power consumption in kW
 * @param {number} hours - Usage duration in hours
 * @param {number} pricePerKWh - Electricity price in euros per kWh
 * @returns {number} - Cost in euros
 */
export const calculateCost = (powerConsumption, hours, pricePerKWh) => {
    return powerConsumption * hours * pricePerKWh;
  };
  
  /**
   * Format cost to display with appropriate units
   * @param {number} cost - Cost in euros
   * @returns {string} - Formatted cost string
   */
  export const formatCost = (cost) => {
    if (cost < 0.01) {
      return `${(cost * 100).toFixed(2)} cents`;
    } else {
      return `${cost.toFixed(2)} €`;
    }
  };
  
  /**
   * Determine price level based on current price
   * @param {number} price - Current price in euros per kWh
   * @returns {string} - Price level: 'low', 'medium', or 'high'
   */
  export const getPriceLevel = (price) => {
    if (price < 0.05) return 'low';
    if (price < 0.15) return 'medium';
    return 'high';
  };
  
  /**
   * Calculate total daily cost for an appliance
   * @param {Object} appliance - Appliance object
   * @param {number} pricePerKWh - Electricity price in euros per kWh
   * @returns {number} - Daily cost in euros
   */
  export const calculateDailyCost = (appliance, pricePerKWh) => {
    // For daily cost, we assume the appliance is used once per day
    return calculateCost(appliance.powerConsumption, appliance.duration, pricePerKWh);
  };
  
  /**
   * Calculate monthly cost for an appliance based on usage frequency
   * @param {Object} appliance - Appliance object
   * @param {number} pricePerKWh - Electricity price in euros per kWh
   * @param {number} timesPerMonth - Usage frequency per month
   * @returns {number} - Monthly cost in euros
   */
  export const calculateMonthlyCost = (appliance, pricePerKWh, timesPerMonth = 30) => {
    return calculateDailyCost(appliance, pricePerKWh) * timesPerMonth;
  };