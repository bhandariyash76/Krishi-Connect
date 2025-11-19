// README: HomeFeedScreen shows buyer/seller feeds with mock crop cards and bilingual UI.
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import CropCard from '../components/CropCard';
import SearchBar from '../components/SearchBar';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const buyerMockData = [
  {
    id: '1',
    name: 'Organic Wheat / गेहूं',
    price: '₹28/kg',
    location: 'Punjab, IN',
    quality: 'Grade 1',
    rating: 4.5,
    image: require('../assets/crops/wheat.png'),
  },
  {
    id: '2',
    name: 'Fresh Tomatoes / टमाटर',
    price: '₹18/kg',
    location: 'Nashik, IN',
    quality: 'A+',
    rating: 4.2,
    image: require('../assets/crops/tomato.png'),
  },
];

const sellerMockData = [
  {
    id: 'A1',
    name: 'Premium Rice / चावल',
    price: '₹35/kg',
    status: 'Live',
    image: require('../assets/crops/rice.png'),
  },
  {
    id: 'A2',
    name: 'Mustard Seeds / सरसों',
    price: '₹58/kg',
    status: 'Pending',
    image: require('../assets/crops/mustard.png'),
  },
];

const HomeFeedScreen = ({ navigation }) => {
  const [viewMode, setViewMode] = useState('buyer');
  const [query, setQuery] = useState('');

  const filteredBuyerData = useMemo(() => {
    // TODO: replace mockData with API call to GET /products
    return buyerMockData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const filteredSellerData = useMemo(() => {
    // TODO: replace mockData with API call to GET /my-crops
    return sellerMockData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const renderSellerCard = item => (
    <View style={styles.sellerCard}>
      <Image source={item.image} style={styles.sellerImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.sellerName}>{item.name}</Text>
        <Text style={styles.sellerPrice}>{item.price}</Text>
        <Text style={styles.sellerStatus}>Status: {item.status}</Text>
      </View>
      <View style={styles.sellerActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Mark Sold</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>View Stats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Krishi Connect Feed</Text>
        <Text style={styles.subtitle}>Buyer & Seller Views / खरीदार और विक्रेता दृश्य</Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} onFilterPress={() => {}} />

      <View style={styles.toggleContainer}>
        {['buyer', 'seller'].map(mode => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.toggleButton,
              viewMode === mode && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode(mode)}>
            <Text
              style={[
                styles.toggleText,
                viewMode === mode && styles.toggleTextActive,
              ]}>
              {mode === 'buyer' ? 'Buyer View / खरीदार' : 'Seller View / विक्रेता'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'buyer' ? (
        <FlatList
          data={filteredBuyerData}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <CropCard
              item={item}
              onPress={() => navigation.navigate('CropDetail', { cropId: item.id })}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No crops found / कोई फसल नहीं</Text>}
        />
      ) : (
        <FlatList
          data={filteredSellerData}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => renderSellerCard(item)}
          ListEmptyComponent={<Text style={styles.emptyText}>No uploads yet / अभी तक अपलोड नहीं</Text>}
        />
      )}

      {viewMode === 'seller' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddCrop')}>
          <Text style={styles.fabText}>+ Add New Crop / नई फसल जोड़ें</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default HomeFeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen, padding: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.green },
  subtitle: { fontSize: 14, color: COLORS.dark },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginVertical: 12,
  },
  toggleButton: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: COLORS.green },
  toggleText: { color: COLORS.green, fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 32, color: COLORS.dark },
  sellerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerImage: { width: 65, height: 65, borderRadius: 12, marginRight: 10 },
  sellerName: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  sellerPrice: { color: COLORS.green, marginTop: 4 },
  sellerStatus: { fontSize: 12, color: COLORS.dark },
  sellerActions: { marginLeft: 10 },
  actionButton: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  actionText: { color: COLORS.dark, fontSize: 12 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 16,
    backgroundColor: COLORS.green,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: { color: '#fff', fontWeight: '700' },
});

