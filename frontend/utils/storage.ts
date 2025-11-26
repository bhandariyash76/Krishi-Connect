import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_ROLE: 'userRole',
  USER_PIN: 'userPin',
  USER_DATA: 'userData',
  IS_PIN_SET: 'isPinSet',
  IS_LOGGED_IN: 'isLoggedIn',
  AUTH_TOKEN: 'authToken',
};

export const storage = {
  // Role management
  async setUserRole(role: 'farmer' | 'buyer') {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  },
  async getUserRole(): Promise<'farmer' | 'buyer' | null> {
    const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return role as 'farmer' | 'buyer' | null;
  },

  // PIN management
  async setPin(pin: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PIN, pin);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PIN_SET, 'true');
  },
  async getPin(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_PIN);
  },
  async isPinSet(): Promise<boolean> {
    const isSet = await AsyncStorage.getItem(STORAGE_KEYS.IS_PIN_SET);
    return isSet === 'true';
  },

  // User data
  async setUserData(data: { email: string; name: string }) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  },
  async getUserData(): Promise<{ email: string; name: string } | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  // Login status
  async setLoggedIn(value: boolean) {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, value.toString());
  },
  async isLoggedIn(): Promise<boolean> {
    const loggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return loggedIn === 'true';
  },

  // Token management
  async setToken(token: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Clear all data (logout) - IMPROVED VERSION
  async clearAll() {
    try {
      console.log('🗑️ Starting storage clear...');

      // Method 1: Remove specific keys
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.USER_PIN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.IS_PIN_SET,
        STORAGE_KEYS.IS_LOGGED_IN,
        STORAGE_KEYS.AUTH_TOKEN,
      ]);
      console.log('✓ Specific keys removed');

      // Method 2: Nuclear option - clear EVERYTHING
      await AsyncStorage.clear();
      console.log('✓ AsyncStorage completely cleared');

      // Verify
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('📋 Remaining keys:', allKeys.length);

      if (allKeys.length > 0) {
        console.warn('⚠️ Warning: Some keys still exist:', allKeys);
      } else {
        console.log('✅ Storage is completely empty');
      }

      return true;
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      return false;
    }
  },
};
