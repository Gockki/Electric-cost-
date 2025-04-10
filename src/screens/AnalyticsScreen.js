import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { getDailyPrices } from '../api/electricityPrices';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const AnalyticsScreen = () => {
  const [dailyPrices, setDailyPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averagePrice, setAveragePrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    // Fetch daily price data
    const fetchDailyPrices = async () => {
      try {
        setIsLoading(true);
        const data = await getDailyPrices();
        setDailyPrices(data);
        
        // Calculate average price
        if (data.length > 0) {
          const sum = data.reduce((acc, item) => acc + item.average, 0);
          const avg = sum / data.length;
          setAveragePrice(avg);
          
          // Calculate price change (from yesterday to today)
          if (data.length >= 2) {
            const today = data[data.length - 1].average;
            const yesterday = data[data.length - 2].average;
            const change = ((today - yesterday) / yesterday) * 100;
            setPriceChange(change);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching daily prices:', error);
        setIsLoading(false);
      }
    };

    fetchDailyPrices();
  }, []);

  // Prepare data for the weekly chart
  const weeklyChartData = {
    labels: dailyPrices.map(item => item.day),
    datasets: [
      {
        data: dailyPrices.map(item => item.average),
        color: (opacity = 1) => COLORS.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Price Analytics</Text>
          <Text style={styles.headerSubtitle}>Track electricity price trends</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading price analytics...</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Average Price</Text>
                <Text style={styles.statValue}>{averagePrice.toFixed(2)} €/kWh</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Price Change</Text>
                <Text style={[
                  styles.statValue,
                  priceChange > 0 ? styles.priceIncrease : styles.priceDecrease,
                ]}>
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                </Text>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Weekly Price Trend</Text>
              {dailyPrices.length > 0 ? (
                <LineChart
                  data={weeklyChartData}
                  width={Dimensions.get('window').width - (SIZES.base * 4)}
                  height={220}
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
                      r: "5",
                      strokeWidth: "2",
                      stroke: COLORS.primary,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <Text style={styles.noDataText}>No weekly data available</Text>
              )}
            </View>
            
            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>Price Insights</Text>
              
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>Best Day of the Week</Text>
                <Text style={styles.insightValue}>
                  {dailyPrices.length > 0 ? 
                    dailyPrices.reduce((prev, current) => 
                      prev.average < current.average ? prev : current
                    ).day : '-'}
                </Text>
              </View>
              
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>Highest Price Day</Text>
                <Text style={styles.insightValue}>
                  {dailyPrices.length > 0 ? 
                    dailyPrices.reduce((prev, current) => 
                      prev.average > current.average ? prev : current
                    ).day : '-'}
                </Text>
              </View>
              
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>Price Volatility</Text>
                <Text style={styles.insightValue}>
                  {dailyPrices.length > 0 ? 
                    calculateVolatility(dailyPrices).toFixed(2) + '%' : '-'}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Calculate price volatility
const calculateVolatility = (prices) => {
  if (prices.length < 2) return 0;
  
  const values = prices.map(item => item.average);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  
  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDifferences.reduce((a, b) => a + b, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Coefficient of variation as a percentage
  return (standardDeviation / mean) * 100;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.base * 2,
    paddingTop: SIZES.extraLarge,
    paddingBottom: SIZES.medium,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.text,
  },
  headerSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text + '99',
    marginTop: SIZES.base / 2,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.extraLarge * 2,
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginTop: SIZES.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.base * 2,
    marginBottom: SIZES.medium,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.base * 2,
    padding: SIZES.medium,
    width: '48%',
    ...SHADOWS.light,
  },
  statLabel: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text + '99',
    marginBottom: SIZES.base,
  },
  statValue: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
  },
  priceIncrease: {
    color: COLORS.danger,
  },
  priceDecrease: {
    color: COLORS.success,
  },
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.base * 2,
    padding: SIZES.medium,
    marginHorizontal: SIZES.base * 2,
    marginVertical: SIZES.medium,
    ...SHADOWS.light,
  },
  chartTitle: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  chart: {
    borderRadius: SIZES.base * 2,
    marginVertical: SIZES.base,
  },
  noDataText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text + '99',
    textAlign: 'center',
    paddingVertical: SIZES.large * 2,
  },
  insightsContainer: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: SIZES.extraLarge,
  },
  insightsTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginVertical: SIZES.medium,
  },
  insightCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.base * 2,
    padding: SIZES.medium,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  insightLabel: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text + '99',
    marginBottom: SIZES.base,
  },
  insightValue: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
});

export default AnalyticsScreen;