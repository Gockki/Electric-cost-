import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { formatCost } from '../utils/calculations';

const BestTimeIndicator = ({ bestTime, appliance, currentPrice }) => {
  if (!bestTime || !appliance) return null;
  
  // Format the hours for display
  const formatHour = (hour) => {
    return hour.toString().padStart(2, '0') + ':00';
  };
  
  // Calculate potential savings
  const potentialSavings = 
    (currentPrice - bestTime.averagePrice) * 
    appliance.powerConsumption * 
    appliance.duration;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Icon name="clock-time-five-outline" size={24} color={COLORS.primary} />
        <Text style={styles.title}>Best Time to Run</Text>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatHour(bestTime.startHour)} - {formatHour(bestTime.endHour)}
        </Text>
        <Text style={styles.priceText}>
          {formatCost(bestTime.averagePrice)} per kWh
        </Text>
      </View>
      
      {potentialSavings > 0 && (
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsText}>
            Potential savings: {formatCost(potentialSavings)}
          </Text>
        </View>
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
    ...SHADOWS.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  timeContainer: {
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  timeText: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  priceText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  savingsContainer: {
    backgroundColor: COLORS.success + '20', // Light green with opacity
    borderRadius: SIZES.base,
    padding: SIZES.base,
    marginTop: SIZES.base,
    alignItems: 'center',
  },
  savingsText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.success,
  },
});

export default BestTimeIndicator;