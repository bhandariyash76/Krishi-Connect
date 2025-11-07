import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { setLanguage, getCurrentLanguage } from '@/i18n';

export const LanguageToggle: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    setCurrentLang(getCurrentLanguage() as 'en' | 'hi');
  }, []);

  const handleToggle = async () => {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    await setLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleToggle}>
      <Text style={styles.text}>
        {currentLang === 'en' ? 'हिंदी' : 'English'}
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

