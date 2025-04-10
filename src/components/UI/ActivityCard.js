import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
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
    >
      <View style={styles.iconContainer}>
        <Icon name={appliance.icon} size={28} color={COLORS.primary} />
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
    borderRadius: SIZES.base * 2,
    padding: SIZES.medium,
    marginHorizontal: SIZES.base * 2,
    marginVertical: SIZES.base,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  details: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text + '99', // Adding some transparency for lighter text
  },
  costContainer: {
    alignItems: 'flex-end',
  },
  costLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text + '99',
    marginBottom: SIZES.base / 2,
  },
  costValue: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
});

export default ActivityCard;