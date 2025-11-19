// README: SearchBar provides bilingual search input with filter icon.
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

const COLORS = { green: '#2E8B57', lightGreen: '#E6F4EA', dark: '#245', accent: '#FFD54F' };

const SearchBar = ({ value, onChangeText, onFilterPress }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search crops / खोजें"
        placeholderTextColor="#7c7c7c"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Text style={styles.filterText}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 16, color: COLORS.dark },
  filterButton: {
    marginLeft: 10,
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  filterText: { fontSize: 16 },
});

