import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LanguageToggle } from '@/components/LanguageToggle'; // Added import
import { AppColors } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import api, { setAuthToken } from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [emailMobile, setEmailMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailMobile || !password) {
      if (Platform.OS === 'web') {
        window.alert('Please fill in all fields');
      } else {
        Alert.alert('Error', 'Please fill in all fields');
      }
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: emailMobile,
        password,
      });

      const { result, token } = response.data;

      await storage.setLoggedIn(true);
      await storage.setToken(token);
      await storage.setUserData(result);
      setAuthToken(token);

      const role = result.role;
      if (role) {
        await storage.setUserRole(role);
      }

      const storedRole = await storage.getUserRole();

      if (!storedRole) {
        router.replace('/role-selection');
      } else {
        router.replace('/home');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

      {/* Header with Language Toggle */}
      <View style={styles.header}>
        <LanguageToggle />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>

            <View style={styles.titleContainer}>
              <Text style={styles.emoji}>🌾</Text>
              <Text style={styles.title}>{i18n.t('login.title')}</Text>
            </View>

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

              <View style={styles.footer}>
                <Text style={styles.subtitle}>
                  {i18n.t('login.dontHaveAccount')}{' '}
                  <Text
                    style={styles.link}
                    onPress={() => router.push('/signup')}>
                    {i18n.t('login.signUp')}
                  </Text>
                </Text>
              </View>
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
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  link: {
    color: AppColors.primary,
    fontWeight: 'bold',
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
    marginBottom: 24,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
