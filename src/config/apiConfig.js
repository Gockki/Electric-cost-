// API Configuration for Finnish Electricity Cost Tracker
export const API_CONFIG = {
    // Primary API key for electricity price data
    API_KEY: 'eb8cdd792a444404a695ca94be70e35c',
    
    // Secondary API key (backup)
    SECONDARY_API_KEY: '16f3bbbb98814ef2bf5a095d16bf52b3',
    
    // Base URLs for the API endpoints
    FINGRID_BASE_URL: 'https://api.fingrid.fi/v1/variable',
    
    // Variable IDs for different data points
    VARIABLES: {
      PRICE: '248', // Nord Pool Finland price (Day-ahead price)
    }
  };
  
  export default API_CONFIG;