export const COLORS = {
    primary: '#0066AA', // Deeper Finnish blue
    secondary: '#FFFFFF',
    background: '#F5F8FA', 
    card: '#FFFFFF',
    text: '#2D3748',
    border: '#E2E8F0',
    notification: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
    danger: '#FF4D4F',
    lowPrice: '#52C41A', // Green for low electricity prices
    mediumPrice: '#FAAD14', // Orange/yellow for medium electricity prices
    highPrice: '#FF4D4F', // Red for high electricity prices
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F7FAFC',
    chartLine: '#0066AA',
    chartGrid: '#E2E8F0',
  };
  
  export const SIZES = {
    base: 8,
    small: 12,
    font: 14,
    medium: 16,
    large: 18,
    extraLarge: 24,
  };
  
  export const FONTS = {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: 'bold',
    },
  };
  
  export const SHADOWS = {
    light: {
      shadowColor: COLORS.text + '20',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    medium: {
      shadowColor: COLORS.text + '30',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
    },
  };
  
  export default { COLORS, SIZES, FONTS, SHADOWS };