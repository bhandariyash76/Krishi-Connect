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

export default function SignupScreen() {
  const router = useRouter();
  const { language } = useLanguage(); // Trigger re-render on language change
  const [fullName, setFullName] = useState('');
  const [emailMobile, setEmailMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !emailMobile || !password || !confirmPassword) {
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
      // Simulate signup - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Save user data
      await storage.setUserData({ name: fullName, email: emailMobile });
      await storage.setLoggedIn(true);
      
      // Navigate to role selection
      router.replace('/role-selection');
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
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
            <Text style={styles.title}>{i18n.t('signup.title')}</Text>
            <Text style={styles.subtitle}>
              {i18n.t('signup.alreadyHaveAccount')}{' '}
              <Text
                style={styles.link}
                onPress={() => router.push('/login')}>
                {i18n.t('signup.login')}
              </Text>
            </Text>

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
                placeholder={i18n.t('signup.emailMobile')}
                value={emailMobile}
                onChangeText={setEmailMobile}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
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
  signupButton: {
    marginTop: 8,
  },
});

