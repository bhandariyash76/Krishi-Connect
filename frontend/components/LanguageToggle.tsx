import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    console.log('Toggling language to:', newLang);
    setLanguage(newLang);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.text}>
        {language === 'en' ? 'हिंदी' : 'English'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: AppColors.primary,
    borderRadius: 20,
  },
  text: {
    color: AppColors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
});

