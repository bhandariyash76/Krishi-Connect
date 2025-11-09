import { I18n } from 'i18n-js';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translation dictionary
const translations = {
  en: {
    welcome: {
      title: 'Connecting Farmers and Buyers',
      login: 'Login',
      signUp: 'Sign Up',
    },
    login: {
      title: 'Login',
      emailMobile: 'Email / Mobile',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      loginButton: 'Login',
      dontHaveAccount: "Don't have an account?",
      signUp: 'Sign Up',
    },
    signup: {
      title: 'Sign Up',
      fullName: 'Full Name',
      emailMobile: 'Email / Mobile',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signUpButton: 'Sign Up',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Login',
    },
    role: {
      title: 'Select Your Role',
      farmer: 'Farmer',
      buyer: 'Buyer',
      continue: 'Continue',
    },
    pin: {
      setPin: 'Set PIN',
      enterPin: 'Enter PIN',
      confirmPin: 'Confirm PIN',
      pinMismatch: 'PINs do not match',
      invalidPin: 'Invalid PIN',
      pinPlaceholder: 'Enter 4-digit PIN',
    },
    home: {
      welcome: 'Welcome',
      farmer: 'Farmer',
      buyer: 'Buyer',
      changePin: 'Change PIN',
      logout: 'Logout',
    },
    common: {
      continue: 'Continue',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      goBack: 'Go Back',
      next: 'Next',
    },
  },
  hi: {
    welcome: {
      title: 'किसान और खरीदार को जोड़ना',
      login: 'लॉगिन',
      signUp: 'साइन अप',
    },
    login: {
      title: 'लॉगिन',
      emailMobile: 'ईमेल / मोबाइल',
      password: 'पासवर्ड',
      forgotPassword: 'पासवर्ड भूल गए?',
      loginButton: 'लॉगिन',
      dontHaveAccount: 'खाता नहीं है?',
      signUp: 'साइन अप',
    },
    signup: {
      title: 'साइन अप',
      fullName: 'पूरा नाम',
      emailMobile: 'ईमेल / मोबाइल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      signUpButton: 'साइन अप',
      alreadyHaveAccount: 'पहले से खाता है?',
      login: 'लॉगिन',
    },
    role: {
      title: 'अपनी भूमिका चुनें',
      farmer: 'किसान',
      buyer: 'खरीदार',
      continue: 'जारी रखें',
    },
    pin: {
      setPin: 'पिन सेट करें',
      enterPin: 'पिन दर्ज करें',
      confirmPin: 'पिन की पुष्टि करें',
      pinMismatch: 'पिन मेल नहीं खाते',
      invalidPin: 'अमान्य पिन',
      pinPlaceholder: '4 अंकों का पिन दर्ज करें',
    },
    home: {
      welcome: 'स्वागत है',
      farmer: 'किसान',
      buyer: 'खरीदार',
      changePin: 'पिन बदलें',
      logout: 'लॉग आउट',
    },
    common: {
      continue: 'जारी रखें',
      back: 'वापस',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      submit: 'सबमिट करें',
      goBack: 'वापस जाएं',
      next: 'अगला',
    },
  },
};

const i18n = new I18n(translations);

// Set default locale
i18n.defaultLocale = 'en';
i18n.enableFallback = true;
// Default to English (will be updated by LanguageProvider)
i18n.locale = 'en';

// Helper function to get current language (for backward compatibility)
export const getCurrentLanguage = (): 'en' | 'hi' => {
  return (i18n.locale as 'en' | 'hi') || 'en';
};

export default i18n;

