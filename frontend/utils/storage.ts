import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_ROLE: 'userRole',
  USER_PIN: 'userPin',
  USER_DATA: 'userData',
  IS_PIN_SET: 'isPinSet',
  IS_LOGGED_IN: 'isLoggedIn',
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

  // Clear all data (logout)
  async clearAll() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_ROLE,
      STORAGE_KEYS.USER_PIN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.IS_PIN_SET,
      STORAGE_KEYS.IS_LOGGED_IN,
    ]);
  },
};

