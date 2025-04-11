import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { formatCost } from '../utils/calculations';
import Card from './UI/Card';

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
    <Card>
      <View style={styles.headerRow}>
        <Icon name="clock-time-five-outline" size={24} color={COLORS.primary} />
        <Text style={styles.title}>Best Time to Run {appliance.name}</Text>
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
          <Icon name="cash-plus" size={18} color={COLORS.success} style={styles.savingsIcon} />
          <Text style={styles.savingsText}>
            Potential savings: {formatCost(potentialSavings)}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: SIZES.base,
  },
  timeContainer: {
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  timeText: {
    fontSize: SIZES.extraLarge,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  priceText: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  savingsContainer: {
    backgroundColor: COLORS.success + '15', // Light green with opacity
    borderRadius: 12,
    padding: SIZES.base,
    marginTop: SIZES.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsIcon: {
    marginRight: 8,
  },
  savingsText: {
    fontSize: SIZES.font,
    color: COLORS.success,
    fontWeight: '500',
  },
});

export default BestTimeIndicator;