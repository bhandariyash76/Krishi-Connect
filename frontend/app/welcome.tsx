import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { AppColors } from '@/constants/colors';
import i18n from '@/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { setAuthToken } from '@/services/api';

export default function WelcomeScreen() {
  const router = useRouter();
  const { language } = useLanguage(); // This will trigger re-render when language changes

  // Clear any residual auth state when welcome screen mounts
  useEffect(() => {
    console.log('Welcome screen mounted - clearing auth state');
    setAuthToken(''); // Clear any auth token from API headers
  }, []);

  return (
    <SafeAreaView style={styles.container} key={language}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <View style={styles.header}>
        <LanguageToggle />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          {/* Logo and Tagline */}
          <Animated.View entering={FadeIn.duration(800)} style={styles.logoContainer}>
            <Text style={styles.emoji}>🌾</Text>
            <Text style={styles.appName}>Krishi Connect</Text>
            <Text style={styles.tagline}>{i18n.t('welcome.title', { locale: language })}</Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.buttonContainer}>
            <Button
              title={i18n.t('welcome.getStarted', { locale: language })}
              onPress={() => router.push('/signup')}
              variant="primary"
              size="large"
              style={styles.button}
            />
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});

