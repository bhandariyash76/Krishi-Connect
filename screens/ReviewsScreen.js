// README: ReviewsScreen lists buyer reviews with option to add new ones.
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const mockReviews = [
  { id: '1', author: 'Buyer A', comment: 'Very fresh crops / बहुत ताज़ा', rating: 5 },
  { id: '2', author: 'Buyer B', comment: 'Good packaging', rating: 4 },
];

const ReviewsScreen = () => {
  // TODO: replace mockReviews with API call to GET /reviews?cropId=
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reviews / समीक्षाएं</Text>
      <FlatList
        data={mockReviews}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.rating}>Rating: {item.rating}★</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Write a Review / समीक्षा लिखें</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.dark, marginBottom: 12 },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  author: { fontWeight: '700', color: COLORS.dark },
  comment: { color: '#444', marginVertical: 4 },
  rating: { color: COLORS.accent, fontWeight: '700' },
  button: {
    backgroundColor: COLORS.green,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});

