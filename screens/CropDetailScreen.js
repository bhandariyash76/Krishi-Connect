// README: CropDetailScreen renders crop details, seller info, and action buttons.
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import RatingStars from '../components/RatingStars';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const mockCrop = {
  name: 'Organic Wheat / जैविक गेहूं',
  price: '₹28/kg',
  description: 'High quality wheat harvested sustainably. Moisture < 12%.',
  quality: 'Grade 1',
  rating: 4.5,
  seller: 'Farmer Om Prakash',
  location: 'Punjab, IN',
  reviews: [
    { id: '1', author: 'Buyer A', comment: 'Excellent quality / उच्च गुणवत्ता' },
    { id: '2', author: 'Buyer B', comment: 'Fresh and clean grains' },
  ],
};

const CropDetailScreen = ({ navigation, route }) => {
  // TODO: replace mock data with API call to GET /products/:id using route.params.cropId
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image source={require('../assets/crops/wheat.png')} style={styles.heroImage} />
        <View style={styles.section}>
          <Text style={styles.name}>{mockCrop.name}</Text>
          <Text style={styles.price}>{mockCrop.price}</Text>
          <RatingStars rating={mockCrop.rating} />
          <Text style={styles.description}>{mockCrop.description}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Quality: {mockCrop.quality}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Info / विक्रेता जानकारी</Text>
          <Text style={styles.meta}>{mockCrop.seller}</Text>
          <Text style={styles.meta}>{mockCrop.location}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Reviews / समीक्षाएं</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reviews')}>
              <Text style={styles.link}>See All / सभी देखें</Text>
            </TouchableOpacity>
          </View>
          {mockCrop.reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewAuthor}>{review.author}</Text>
              <Text style={styles.reviewText}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: COLORS.lightGreen }]}>
          <Text style={[styles.bottomText, { color: COLORS.dark }]}>Contact Seller / विक्रेता से संपर्क</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: COLORS.green }]}>
          <Text style={styles.bottomText}>Buy Now / अभी खरीदें</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: COLORS.accent }]}>
          <Text style={[styles.bottomText, { color: COLORS.dark }]}>Make Offer / ऑफर करें</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CropDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroImage: { width: '100%', height: 220 },
  section: { padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#eee' },
  name: { fontSize: 24, fontWeight: '700', color: COLORS.dark },
  price: { fontSize: 20, color: COLORS.green, marginVertical: 6 },
  description: { fontSize: 14, color: '#555', marginVertical: 8 },
  badge: { backgroundColor: COLORS.lightGreen, padding: 8, borderRadius: 10, marginTop: 6, alignSelf: 'flex-start' },
  badgeText: { color: COLORS.dark, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginBottom: 8 },
  meta: { color: '#555', marginBottom: 4 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: COLORS.green, fontWeight: '600' },
  reviewCard: { backgroundColor: COLORS.lightGreen, padding: 10, borderRadius: 10, marginBottom: 8 },
  reviewAuthor: { fontWeight: '700', color: COLORS.dark },
  reviewText: { color: '#333' },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bottomText: { fontWeight: '700', color: '#fff' },
});

