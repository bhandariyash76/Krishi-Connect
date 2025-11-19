// README: ProfileScreen shows user info, role, crops, and account actions.
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const mockUser = {
  name: 'Farmer Rahul Singh',
  role: 'Farmer / किसान',
  location: 'Jaipur, IN',
  crops: [
    { id: '1', name: 'Organic Wheat', price: '₹28/kg' },
    { id: '2', name: 'Fresh Bajra', price: '₹22/kg' },
  ],
};

const ProfileScreen = ({ navigation }) => {
  // TODO: replace mockUser with API call to GET /me
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{mockUser.name}</Text>
        <Text style={styles.role}>{mockUser.role}</Text>
        <Text style={styles.meta}>{mockUser.location}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit Profile / प्रोफ़ाइल संपादित करें</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Crops / मेरी फसलें</Text>
        <FlatList
          data={mockUser.crops}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.cropRow}>
              <View>
                <Text style={styles.cropName}>{item.name}</Text>
                <Text style={styles.cropPrice}>{item.price}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.link}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout / लॉगआउट</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen, padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.dark },
  role: { color: COLORS.green, marginVertical: 4 },
  meta: { color: '#555' },
  editButton: {
    marginTop: 12,
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  editText: { color: '#fff', fontWeight: '700' },
  section: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: COLORS.dark },
  cropRow: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropName: { fontWeight: '700', color: COLORS.dark },
  cropPrice: { color: COLORS.green },
  link: { color: COLORS.accent, fontWeight: '700' },
  logoutButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: { color: COLORS.dark, fontWeight: '700' },
});

