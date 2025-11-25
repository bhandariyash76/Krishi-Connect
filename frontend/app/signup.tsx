import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LanguageToggle } from '@/components/LanguageToggle';
import { AppColors } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import api, { setAuthToken } from '@/services/api';

export default function SignupScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        name: fullName,
        email,
        password,
        phone,
        role: 'buyer',
      });

      const { result, token } = response.data;

      await storage.setUserData(result);
      await storage.setLoggedIn(true);
      await storage.setToken(token);
      setAuthToken(token);

      router.replace('/role-selection');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Signup failed. Please try again.');
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
              <Text style={styles.title}>{i18n.t('signup.title')}</Text>
            </View>

            <View style={styles.form}>
              <Input
                label={i18n.t('signup.fullName')}
                placeholder={i18n.t('signup.fullName')}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoComplete="name"
              />

              <Input
                label={i18n.t('signup.emailMobile')}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              <Input
                label="Phone Number"
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoComplete="tel"
              />

              <Input
                label={i18n.t('signup.password')}
                placeholder={i18n.t('signup.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />

              <Input
                label={i18n.t('signup.confirmPassword')}
                placeholder={i18n.t('signup.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />

              <Button
                title={i18n.t('signup.signUpButton')}
                onPress={handleSignup}
                variant="primary"
                size="large"
                loading={loading}
                style={styles.signupButton}
              />

              <View style={styles.footer}>
                <Text style={styles.subtitle}>
                  {i18n.t('signup.alreadyHaveAccount')}{' '}
                  <Text
                    style={styles.link}
                    onPress={() => router.push('/login')}>
                    {i18n.t('signup.login')}
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
    marginBottom: 24,
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
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  signupButton: {
    marginTop: 32,
    marginBottom: 24,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
