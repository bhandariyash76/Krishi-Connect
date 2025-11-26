import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { storage } from '@/utils/storage';
import { AppColors } from '@/constants/colors';

import { setAuthToken } from '@/services/api';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndNavigate();
  }, []);

  const checkAuthAndNavigate = async () => {
    try {
      console.log('=== AUTH CHECK STARTED ===');

      const isLoggedIn = await storage.isLoggedIn();
      const isPinSet = await storage.isPinSet();
      const hasRole = await storage.getUserRole();
      const token = await storage.getToken();

      console.log('Auth Status:');
      console.log('- isLoggedIn:', isLoggedIn);
      console.log('- token:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('- hasRole:', hasRole);
      console.log('- isPinSet:', isPinSet);

      if (isLoggedIn && token) {
        console.log('→ User is logged in, setting auth token');
        setAuthToken(token);
        if (hasRole) {
          console.log(`→ Navigating to /home (role: ${hasRole})`);
          router.replace('/home');
        } else {
          console.log('→ Navigating to /role-selection (no role)');
          router.replace('/role-selection');
        }
      } else {
        console.log('→ User not logged in, navigating to /welcome');
        console.log(`  Reason: isLoggedIn=${isLoggedIn}, token=${!!token}`);
        router.replace('/welcome');
      }

      console.log('=== AUTH CHECK COMPLETE ===');
    } catch (error) {
      console.error('✗ Error checking auth status:', error);
      console.log('→ Navigating to /welcome due to error');
      router.replace('/welcome');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppColors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
  },
});

