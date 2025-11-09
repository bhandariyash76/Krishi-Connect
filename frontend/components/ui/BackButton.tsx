import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import i18n from '@/i18n';

interface BackButtonProps {
  onPress?: () => void;
  label?: string;
  style?: any;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  label,
  style,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <Ionicons name="arrow-back" size={24} color={AppColors.primary} />
      {label && <Text style={styles.backText}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '600',
  },
});

