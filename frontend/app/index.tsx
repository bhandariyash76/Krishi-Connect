import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { storage } from '@/utils/storage';
import { AppColors } from '@/constants/colors';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndNavigate();
  }, []);

  const checkAuthAndNavigate = async () => {
    try {
      const isLoggedIn = await storage.isLoggedIn();
      const isPinSet = await storage.isPinSet();
      const hasRole = await storage.getUserRole();

      if (isLoggedIn) {
        if (hasRole) {
          if (isPinSet) {
            router.replace('/pin-unlock');
          } else {
            router.replace('/set-pin');
          }
        } else {
          router.replace('/role-selection');
        }
      } else {
        router.replace('/welcome');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
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

