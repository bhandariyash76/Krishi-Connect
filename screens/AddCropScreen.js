// README: AddCropScreen lets sellers submit crop details with mock validation.
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const AddCropScreen = () => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    quality: '',
    location: '',
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.quantity) {
      Alert.alert('Error', 'Please fill required fields / सभी अनिवार्य फ़ील्ड भरें');
      return;
    }
    // TODO: integrate backend API POST /crops and upload image to storage.
    Alert.alert('Success', 'Crop submitted! / फसल सबमिट हुई');
    setForm({ name: '', category: '', quantity: '', price: '', quality: '', location: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.title}>Add Crop / फसल जोड़ें</Text>
        {[
          { label: 'Crop Name / फसल का नाम', key: 'name' },
          { label: 'Category / श्रेणी', key: 'category' },
          { label: 'Quantity (kg) / मात्रा', key: 'quantity', keyboardType: 'numeric' },
          { label: 'Expected Price / अपेक्षित कीमत', key: 'price', keyboardType: 'numeric' },
          { label: 'Quality Grade / गुणवत्ता', key: 'quality' },
          { label: 'Location / स्थान', key: 'location' },
        ].map(field => (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={form[field.key]}
              onChangeText={text => handleChange(field.key, text)}
              keyboardType={field.keyboardType || 'default'}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.imagePicker} onPress={() => Alert.alert('Image', 'TODO: open image picker')}>
          <Text style={styles.imagePickerText}>Select Image / छवि चुनें</Text>
          <Text style={styles.hint}>TODO: integrate expo-image-picker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Crop / फसल सबमिट करें</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCropScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGreen, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.green, marginBottom: 12 },
  inputGroup: { marginBottom: 12 },
  label: { fontWeight: '600', color: COLORS.dark, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePicker: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 12,
  },
  imagePickerText: { fontWeight: '700', color: COLORS.dark },
  hint: { color: '#777', marginTop: 4 },
  submitButton: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

