import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import PriceDisplay from '../components/UI/PriceDisplay';
import ActivityCard from '../components/UI/ActivityCard';
import BestTimeIndicator from '../components/BestTimeIndicator';
import PriceChart from '../components/UI/PriceChart';
import { APPLIANCES } from '../constants/applianceData';
import { getCurrentPrice, getHourlyPrices, findBestTimeToRun } from '../api/electricityPrices';

const HomeScreen = () => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [hourlyPrices, setHourlyPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  useEffect(() => {
    // Fetch electricity price data on component mount
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get current price
        const price = await getCurrentPrice();
        setCurrentPrice(price);
        
        // Get hourly prices
        const hourly = await getHourlyPrices();
        setHourlyPrices(hourly);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching electricity price data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 15 minutes
    const refreshInterval = setInterval(fetchData, 15 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Find the best time to run when an appliance is selected
  useEffect(() => {
    if (selectedAppliance) {
      const getBestTime = async () => {
        try {
          const result = await findBestTimeToRun(selectedAppliance.duration);
          setBestTime(result);
        } catch (error) {
          console.error('Error finding best time:', error);
        }
      };

      getBestTime();
    }
  }, [selectedAppliance]);

  // Handle appliance selection
  const handleApplianceSelect = (appliance) => {
    setSelectedAppliance(appliance);
  };

  // Header component for the FlatList
  const ListHeaderComponent = () => (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Finnish Electricity Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your electricity costs in real-time</Text>
      </View>
      
      <PriceDisplay currentPrice={currentPrice} isLoading={isLoading} />
      
      {!isLoading && hourlyPrices.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Today's Electricity Prices</Text>
          <PriceChart hourlyPrices={hourlyPrices} />
        </View>
      )}
      
      {selectedAppliance && (
        <BestTimeIndicator 
          bestTime={bestTime} 
          appliance={selectedAppliance}
          currentPrice={currentPrice}
        />
      )}
      
      <Text style={styles.sectionTitle}>Household Activities</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {isLoading && !currentPrice ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading electricity price data...</Text>
        </View>
      ) : (
        <FlatList
          data={APPLIANCES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard 
              appliance={item} 
              currentPrice={currentPrice}
              onPress={handleApplianceSelect}
            />
          )}
          ListHeaderComponent={ListHeaderComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
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
  chartContainer: {
    marginHorizontal: SIZES.base * 2,
    marginVertical: SIZES.base,
    padding: SIZES.medium,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.base * 2,
  },
  chartTitle: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginHorizontal: SIZES.base * 2,
    marginTop: SIZES.large,
    marginBottom: SIZES.base,
  },
  listContent: {
    paddingBottom: SIZES.extraLarge * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginTop: SIZES.medium,
  },
});

export default HomeScreen;