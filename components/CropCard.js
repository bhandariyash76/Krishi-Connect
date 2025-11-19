// README: CropCard is a reusable component showing crop summary info for buyer feed.
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import RatingStars from './RatingStars';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const CropCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={item.image} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.meta}>{item.location}</Text>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.quality}</Text>
          </View>
          <RatingStars rating={item.rating} />
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewText}>View / देखें</Text>
        </TouchableOpacity>
        <Text style={styles.favorite}>♡</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CropCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: { width: 70, height: 70, borderRadius: 12, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  price: { color: COLORS.green, marginTop: 4, fontWeight: '600' },
  meta: { fontSize: 12, color: '#555' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  badge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: COLORS.dark },
  viewButton: {
    backgroundColor: COLORS.green,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  favorite: { textAlign: 'center', fontSize: 20, marginTop: 6, color: COLORS.accent },
});

