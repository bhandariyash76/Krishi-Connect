// README: RatingStars renders simple star icons for ratings.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const RatingStars = ({ rating = 0 }) => {
  const stars = [1, 2, 3, 4, 5].map(idx => (
    <Text key={idx} style={[styles.star, { color: idx <= rating ? COLORS.accent : '#ccc' }]}>
      ★
    </Text>
  ));
  return <View style={styles.container}>{stars}</View>;
};

export default RatingStars;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  star: { fontSize: 14, marginRight: 2 },
});

