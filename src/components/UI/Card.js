import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const Card = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SIZES.medium,
    marginHorizontal: SIZES.base * 2,
    marginVertical: SIZES.base,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border + '20', // Very light border
  },
});

export default Card;