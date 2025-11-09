import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';
import { AppColors } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginScreen() {
  const router = useRouter();
  const { language } = useLanguage(); // Trigger re-render on language change
  const [emailMobile, setEmailMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailMobile || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate login - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Save login status
      await storage.setLoggedIn(true);
      
      // Check if user has selected a role
      const role = await storage.getUserRole();
      if (!role) {
        router.replace('/role-selection');
      } else {
        // Check if PIN is set
        const isPinSet = await storage.isPinSet();
        if (isPinSet) {
          router.replace('/pin-unlock');
        } else {
          router.replace('/set-pin');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
            <BackButton onPress={() => router.push('/welcome')} />
            <Text style={styles.title}>{i18n.t('login.title')}</Text>
            <Text style={styles.subtitle}>
              {i18n.t('login.dontHaveAccount')}{' '}
              <Text
                style={styles.link}
                onPress={() => router.push('/signup')}>
                {i18n.t('login.signUp')}
              </Text>
            </Text>

            <View style={styles.form}>
              <Input
                label={i18n.t('login.emailMobile')}
                placeholder={i18n.t('login.emailMobile')}
                value={emailMobile}
                onChangeText={setEmailMobile}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              <Input
                label={i18n.t('login.password')}
                placeholder={i18n.t('login.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => Alert.alert('Info', 'Forgot password feature coming soon')}>
                <Text style={styles.forgotPasswordText}>
                  {i18n.t('login.forgotPassword')}
                </Text>
              </TouchableOpacity>

              <Button
                title={i18n.t('login.loginButton')}
                onPress={handleLogin}
                variant="primary"
                size="large"
                loading={loading}
                style={styles.loginButton}
              />
            </View>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginBottom: 32,
  },
  link: {
    color: AppColors.primary,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 8,
  },
});

