import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { AppColors } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeScreen() {
  const router = useRouter();
  const { language } = useLanguage(); // This will trigger re-render when language changes
  const [role, setRole] = useState<'farmer' | 'buyer' | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userRole = await storage.getUserRole();
    const userData = await storage.getUserData();
    setRole(userRole);
    setUserName(userData?.name || '');
  };

  const handleChangePin = () => {
    Alert.alert(
      'Change PIN',
      'To change your PIN, you need to logout and login again.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  const getRoleEmoji = () => {
    return role === 'farmer' ? '👨‍🌾' : '🛒';
  };

  const getRoleName = () => {
    return role === 'farmer' ? i18n.t('home.farmer') : i18n.t('home.buyer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header with Language Toggle */}
        <View style={styles.header}>
          <LanguageToggle />
        </View>

        {/* Welcome Card */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.welcomeSection}>
          <Card style={styles.welcomeCard}>
            <Text style={styles.emoji}>{getRoleEmoji()}</Text>
            <Text style={styles.welcomeText}>
              {i18n.t('home.welcome')}, {userName || getRoleName()}!
            </Text>
            <Text style={styles.roleText}>{getRoleName()}</Text>
          </Card>
        </Animated.View>

        {/* Actions */}
        <Animated.View
          entering={FadeIn.delay(300).duration(600)}
          style={styles.actionsContainer}>
          <Button
            title={i18n.t('home.changePin')}
            onPress={handleChangePin}
            variant="outline"
            size="large"
            style={styles.actionButton}
          />
          <Button
            title={i18n.t('home.logout')}
            onPress={handleLogout}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          entering={FadeIn.delay(600).duration(600)}
          style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>🌾 Welcome to Krishi Connect!</Text>
            <Text style={styles.infoText}>
              {role === 'farmer'
                ? 'Start listing your produce and connect with buyers.'
                : 'Browse fresh produce from local farmers.'}
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundLight,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: AppColors.primaryLight + '10',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 18,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    width: '100%',
  },
  infoSection: {
    marginTop: 8,
  },
  infoCard: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    lineHeight: 24,
  },
});

