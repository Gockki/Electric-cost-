import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [priceUnit, setPriceUnit] = useState('euro_per_kwh');

  // Toggle settings
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  const toggleDarkMode = () => {
    // Alert user that this feature is not yet implemented
    Alert.alert(
      "Feature in Development",
      "Dark mode is coming in a future update!",
      [{ text: "OK" }]
    );
    // setDarkMode(prev => !prev);
  };
  const toggleAutoRefresh = () => setAutoRefresh(prev => !prev);

  // Handle price unit selection
  const handlePriceUnitChange = (unit) => {
    setPriceUnit(unit);
  };

  // Settings sections
  const settingsSections = [
    {
      title: 'App Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Price Alerts',
          description: 'Get notified about significant price changes',
          type: 'switch',
          value: notificationsEnabled,
          onToggle: toggleNotifications,
          icon: 'bell-outline',
        },
        {
          id: 'dark_mode',
          title: 'Dark Mode',
          description: 'Switch between light and dark theme',
          type: 'switch',
          value: darkMode,
          onToggle: toggleDarkMode,
          icon: 'theme-light-dark',
        },
        {
          id: 'auto_refresh',
          title: 'Auto Refresh',
          description: 'Automatically refresh price data',
          type: 'switch',
          value: autoRefresh,
          onToggle: toggleAutoRefresh,
          icon: 'refresh',
        },
      ],
    },
    {
      title: 'Price Display Settings',
      items: [
        {
          id: 'price_unit',
          title: 'Price Unit',
          description: 'Change how electricity prices are displayed',
          type: 'radio',
          value: priceUnit,
          options: [
            { id: 'euro_per_kwh', label: 'Euro per kWh (€/kWh)' },
            { id: 'cents_per_kwh', label: 'Cents per kWh (¢/kWh)' },
          ],
          onChange: handlePriceUnitChange,
          icon: 'currency-eur',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'about_app',
          title: 'About This App',
          description: 'Learn more about Finnish Electricity Tracker',
          type: 'action',
          icon: 'information-outline',
          onPress: () => Alert.alert(
            "Finnish Electricity Tracker",
            "Version 1.0.0\n\nAn app to track electricity costs in Finland based on real-time market prices.\n\nDeveloped by Jere",
            [{ text: "OK" }]
          ),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Help us improve the app',
          type: 'action',
          icon: 'message-text-outline',
          onPress: () => Alert.alert(
            "Feature in Development",
            "This feature will be available in a future update.",
            [{ text: "OK" }]
          ),
        },
      ],
    },
  ];

  // Render settings item
  const renderSettingItem = (item) => {
    switch (item.type) {
      case 'switch':
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Icon name={item.icon} size={22} color={COLORS.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingDescription}>{item.description}</Text>
            </View>
            
            <Switch
              trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
              thumbColor={item.value ? COLORS.primary : COLORS.text + '40'}
              ios_backgroundColor={COLORS.border}
              onValueChange={item.onToggle}
              value={item.value}
            />
          </View>
        );
      
      case 'radio':
        return (
          <View key={item.id} style={styles.settingItemWithOptions}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIconContainer}>
                <Icon name={item.icon} size={22} color={COLORS.primary} />
              </View>
              
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
            </View>
            
            <View style={styles.radioOptions}>
              {item.options.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.radioOption}
                  onPress={() => item.onChange(option.id)}
                >
                  <View style={styles.radioButton}>
                    {item.value === option.id && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 'action':
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={item.onPress}
          >
            <View style={styles.settingIconContainer}>
              <Icon name={item.icon} size={22} color={COLORS.primary} />
            </View>
            
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingDescription}>{item.description}</Text>
            </View>
            
            <Icon name="chevron-right" size={22} color={COLORS.text + '60'} />
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your app experience</Text>
        </View>
        
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
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
  settingsSection: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginHorizontal: SIZES.base * 2,
    marginBottom: SIZES.base,
  },
  sectionContent: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.base * 2,
    marginHorizontal: SIZES.base * 2,
    ...SHADOWS.light,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItemWithOptions: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDescription: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text + '99',
  },
  radioOptions: {
    marginLeft: SIZES.base * 2 + 36,
    marginTop: SIZES.base,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
});

export default SettingsScreen;