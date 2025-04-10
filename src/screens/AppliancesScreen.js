import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { APPLIANCES, CATEGORIES } from '../constants/applianceData';

const AppliancesScreen = () => {
  const [appliances, setAppliances] = useState(APPLIANCES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [editPower, setEditPower] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // Filter appliances by category
  const filteredAppliances = selectedCategory === 'All'
    ? appliances
    : appliances.filter(item => item.category === selectedCategory);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Open edit modal
  const handleAppliancePress = (appliance) => {
    setSelectedAppliance(appliance);
    setEditPower(appliance.powerConsumption.toString());
    setEditDuration(appliance.duration.toString());
    setModalVisible(true);
  };

  // Save appliance changes
  const handleSaveChanges = () => {
    if (selectedAppliance) {
      const power = parseFloat(editPower);
      const duration = parseFloat(editDuration);
      
      if (!isNaN(power) && !isNaN(duration) && power > 0 && duration > 0) {
        const updatedAppliances = appliances.map(item => {
          if (item.id === selectedAppliance.id) {
            return {
              ...item,
              powerConsumption: power,
              duration: duration,
            };
          }
          return item;
        });
        
        setAppliances(updatedAppliances);
      }
    }
    
    setModalVisible(false);
  };

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Render appliance item
  const renderApplianceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.applianceItem}
      onPress={() => handleAppliancePress(item)}
    >
      <View style={styles.applianceIconContainer}>
        <Icon name={item.icon} size={24} color={COLORS.primary} />
      </View>
      
      <View style={styles.applianceDetails}>
        <Text style={styles.applianceName}>{item.name}</Text>
        <Text style={styles.applianceInfo}>
          Power: {item.powerConsumption} kW · Duration: {item.duration} {item.duration === 1 ? 'hour' : 'hours'}
        </Text>
      </View>
      
      <Icon name="pencil" size={20} color={COLORS.text + '99'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appliances</Text>
        <Text style={styles.headerSubtitle}>Customize appliance power ratings</Text>
      </View>
      
      {/* Categories list */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Appliances list */}
      <FlatList
        data={filteredAppliances}
        renderItem={renderApplianceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.appliancesList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Edit Appliance Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Appliance</Text>
            
            {selectedAppliance && (
              <>
                <Text style={styles.modalSubtitle}>{selectedAppliance.name}</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Power Consumption (kW)</Text>
                  <TextInput
                    style={styles.input}
                    value={editPower}
                    onChangeText={setEditPower}
                    keyboardType="decimal-pad"
                    placeholder="Enter power in kW"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Duration (hours)</Text>
                  <TextInput
                    style={styles.input}
                    value={editDuration}
                    onChangeText={setEditDuration}
                    keyboardType="decimal-pad"
                    placeholder="Enter duration in hours"
                  />
                </View>
              </>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: SIZES.small,
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
  categoriesContainer: {
    marginTop: SIZES.base,
  },
  categoriesList: {
    paddingHorizontal: SIZES.base * 2,
  },
  categoryItem: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.base * 2,
    marginRight: SIZES.base,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  selectedCategoryText: {
    color: COLORS.secondary,
  },
  appliancesList: {
    paddingHorizontal: SIZES.base * 2,
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.extraLarge * 2,
  },
  applianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.base * 2,
    padding: SIZES.medium,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  applianceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  applianceDetails: {
    flex: 1,
  },
  applianceName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  applianceInfo: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text + '99',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base * 2,
    padding: SIZES.large,
    alignItems: 'center',
  },
  modalTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  modalSubtitle: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  inputContainer: {
    width: '100%',
    marginBottom: SIZES.medium,
  },
  inputLabel: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.small,
    ...FONTS.regular,
    fontSize: SIZES.font,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.base,
    alignItems: 'center',
    marginHorizontal: SIZES.base,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  saveButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.secondary,
  },
});

export default AppliancesScreen;