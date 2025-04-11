import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  ScrollView,
  RefreshControl
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  // Fetch data function
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

  useEffect(() => {
    // Fetch electricity price data on component mount
    fetchData();
    
    // Refresh data every 15 minutes
    const refreshInterval = setInterval(fetchData, 15 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

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
      
      <PriceChart hourlyPrices={hourlyPrices} />
      
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
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
    fontSize: SIZES.extraLarge,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: SIZES.font,
    color: COLORS.text + '99',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    color: COLORS.text,
    fontWeight: 'bold',
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
    fontSize: SIZES.font,
    color: COLORS.text,
    marginTop: SIZES.medium,
  },
});

export default HomeScreen;