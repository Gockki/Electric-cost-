import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { getPriceLevel } from '../../utils/calculations';

const PriceDisplay = ({ currentPrice, isLoading }) => {
  const priceLevel = getPriceLevel(currentPrice);
  
  // Determine color based on price level
  const getPriceLevelColor = () => {
    switch (priceLevel) {
      case 'low':
        return COLORS.lowPrice;
      case 'medium':
        return COLORS.mediumPrice;
      case 'high':
        return COLORS.highPrice;
      default:
        return COLORS.text;
    }
  };

  // Get price level text
  const getPriceLevelText = () => {
    switch (priceLevel) {
      case 'low':
        return 'Low - Good time to use electricity';
      case 'medium':
        return 'Average - Normal electricity price';
      case 'high':
        return 'High - Consider delaying usage if possible';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, SHADOWS.light]}>
      <Text style={styles.label}>Current Electricity Price</Text>
      
      {isLoading ? (
        <Text style={styles.loadingText}>Loading current price...</Text>
      ) : (
        <>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>€</Text>
            <Text style={styles.price}>{currentPrice.toFixed(2)}</Text>
            <Text style={styles.unit}>/kWh</Text>
          </View>
          
          <View style={[styles.priceLevelContainer, { backgroundColor: getPriceLevelColor() }]}>
            <Text style={styles.priceLevelText}>{getPriceLevelText()}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.base * 2,
    padding: SIZES.medium,
    marginHorizontal: SIZES.base * 2,
    marginVertical: SIZES.base,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: SIZES.base,
  },
  currency: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.text,
    marginBottom: 5,
  },
  price: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge * 2,
    color: COLORS.text,
  },
  unit: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 5,
    marginLeft: 4,
  },
  priceLevelContainer: {
    borderRadius: SIZES.base,
    padding: SIZES.base,
    marginTop: SIZES.medium,
    alignItems: 'center',
  },
  priceLevelText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.secondary,
  },
  loadingText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: SIZES.large,
  },
});

export default PriceDisplay;