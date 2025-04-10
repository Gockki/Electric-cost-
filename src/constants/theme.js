export const COLORS = {
    primary: '#0066CC', // Finnish blue (similar to the color in Finnish flag)
    secondary: '#FFFFFF',
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#333333',
    border: '#E1E5EA',
    notification: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF3B30',
    lowPrice: '#34C759', // Green for low electricity prices
    mediumPrice: '#FFCC00', // Yellow for medium electricity prices
    highPrice: '#FF3B30', // Red for high electricity prices
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
    shadowColor: COLORS.text,
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    },
    medium: {
    shadowColor: COLORS.text,
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