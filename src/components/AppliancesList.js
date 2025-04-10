import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ActivityCard from './UI/ActivityCard';

const AppliancesList = ({ appliances, currentPrice, onApplianceSelect }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={appliances}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard 
            appliance={item} 
            currentPrice={currentPrice}
            onPress={() => onApplianceSelect(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default AppliancesList;