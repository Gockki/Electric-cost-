import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { calculateCost, formatCost } from '../../utils/calculations';

const ActivityCard = ({ appliance, currentPrice, onPress }) => {
  // Calculate the cost for this appliance
  const cost = calculateCost(
    appliance.powerConsumption,
    appliance.duration,
    currentPrice
  );
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(appliance)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon name={appliance.icon} size={26} color={COLORS.primary} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{appliance.name}</Text>
        <Text style={styles.details}>
          {appliance.powerConsumption} kW · {appliance.duration} {appliance.duration === 1 ? 'hour' : 'hours'}
        </Text>
      </View>
      
      <View style={styles.costContainer}>
        <Text style={styles.costLabel}>Cost</Text>
        <Text style={styles.costValue}>{formatCost(cost)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SIZES.medium,
    marginHorizontal: SIZES.base * 2,
    marginVertical: SIZES.base * 0.8,
    alignItems: 'center',
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border + '20', // Very light border
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary + '15', // Light primary color with opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 4,
    fontWeight: '600',
  },
  details: {
    fontSize: SIZES.small,
    color: COLORS.text + '99', // Adding some transparency for lighter text
  },
  costContainer: {
    alignItems: 'flex-end',
    paddingLeft: SIZES.base,
  },
  costLabel: {
    fontSize: SIZES.small,
    color: COLORS.text + '99',
    marginBottom: 4,
  },
  costValue: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default ActivityCard;