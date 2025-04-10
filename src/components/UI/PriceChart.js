import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { getPriceLevel } from '../../utils/calculations';

const PriceChart = ({ hourlyPrices }) => {
  if (!hourlyPrices || hourlyPrices.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No price data available</Text>
      </View>
    );
  }

  // Format data for the chart
  const data = {
    labels: hourlyPrices.map(item => `${item.hour}`),
    datasets: [
      {
        data: hourlyPrices.map(item => item.price),
        color: (opacity = 1) => COLORS.primary,
        strokeWidth: 2,
      },
    ],
  };

  // Highlight current hour
  const currentHour = new Date().getHours();
  
  // Find min and max price for display
  const prices = hourlyPrices.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - (SIZES.base * 4 + SIZES.medium * 2)} // Account for padding and margins
        height={180}
        yAxisSuffix="€"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: COLORS.card,
          backgroundGradientFrom: COLORS.card,
          backgroundGradientTo: COLORS.card,
          decimalPlaces: 2,
          color: (opacity = 1) => COLORS.primary,
          labelColor: (opacity = 1) => COLORS.text + '99',
          style: {
            borderRadius: SIZES.base * 2,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: COLORS.primary,
          },
          propsForVerticalLabels: {
            fontSize: 10,
          },
        }}
        bezier
        style={styles.chart}
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Min Price:</Text>
          <Text style={styles.infoValue}>{minPrice.toFixed(2)} €/kWh</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Max Price:</Text>
          <Text style={styles.infoValue}>{maxPrice.toFixed(2)} €/kWh</Text>
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>
          Showing hourly spot prices for electricity in Finland
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: SIZES.base,
    borderRadius: SIZES.base * 2,
  },
  noDataContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text + '99',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SIZES.base,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text + '99',
    marginRight: SIZES.base / 2,
  },
  infoValue: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  legendContainer: {
    marginTop: SIZES.base,
    width: '100%',
  },
  legendText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text + '99',
    textAlign: 'center',
  },
});

export default PriceChart;