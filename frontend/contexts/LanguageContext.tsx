import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'react-native-localize';
import i18n from '@/i18n';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Initialize language - always default to English
    const initLanguage = async () => {
      try {
        // First try to get saved language preference
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage === 'en' || savedLanguage === 'hi') {
          setLanguageState(savedLanguage as Language);
          i18n.locale = savedLanguage;
        } else {
          // Default to English (not device language)
          setLanguageState('en');
          i18n.locale = 'en';
          // Save English as default
          await AsyncStorage.setItem('appLanguage', 'en');
        }
      } catch (error) {
        console.error('Error loading language:', error);
        // Default to English on error
        setLanguageState('en');
        i18n.locale = 'en';
      }
    };

    initLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      console.log('Setting language to:', lang);
      i18n.locale = lang;
      setLanguageState(lang);
      await AsyncStorage.setItem('appLanguage', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

