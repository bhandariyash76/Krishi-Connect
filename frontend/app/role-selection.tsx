import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { AppColors, AppStyles } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { language } = useLanguage(); // Trigger re-render on language change
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | null>(null);

  const handleContinue = async () => {
    if (!selectedRole) {
      return;
    }

    await storage.setUserRole(selectedRole);
    router.replace('/set-pin');
  };

  const RoleCard = ({
    role,
    emoji,
    title,
    onPress,
    isSelected,
  }: {
    role: 'farmer' | 'buyer';
    emoji: string;
    title: string;
    onPress: () => void;
    isSelected: boolean;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(role === 'farmer' ? 200 : 400).duration(600)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.roleCard,
          isSelected && styles.roleCardSelected,
        ]}>
        <Text style={styles.roleEmoji}>{emoji}</Text>
        <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>
          {title}
        </Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <View style={styles.content}>
        <BackButton 
          onPress={() => router.push('/welcome')}
          style={styles.backButton}
        />
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Text style={styles.title}>{i18n.t('role.title')}</Text>
          <Text style={styles.subtitle}>
            Choose your role to continue
          </Text>
        </Animated.View>

        <View style={styles.roleContainer}>
          <RoleCard
            role="farmer"
            emoji="👨‍🌾"
            title={i18n.t('role.farmer')}
            onPress={() => setSelectedRole('farmer')}
            isSelected={selectedRole === 'farmer'}
          />
          <RoleCard
            role="buyer"
            emoji="🛒"
            title={i18n.t('role.buyer')}
            onPress={() => setSelectedRole('buyer')}
            isSelected={selectedRole === 'buyer'}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.buttonContainer}>
          <Button
            title={i18n.t('role.continue')}
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={!selectedRole}
            style={styles.continueButton}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  roleContainer: {
    flex: 1,
    gap: 24,
    justifyContent: 'center',
  },
  roleCard: {
    backgroundColor: AppColors.card,
    borderRadius: AppStyles.borderRadius.xlarge,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
    ...AppStyles.cardShadow,
  },
  roleCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryLight + '10',
  },
  roleEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  roleTitleSelected: {
    color: AppColors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: AppColors.textLight,
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 32,
  },
  continueButton: {
    width: '100%',
  },
});

