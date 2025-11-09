import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { AppColors, AppStyles } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PinUnlockScreen() {
  const router = useRouter();
  const { language } = useLanguage(); // Trigger re-render on language change
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useSharedValue(0);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (error) {
      shakeAnimation.value = withRepeat(
        withTiming(10, { duration: 50 }),
        5,
        true,
        () => {
          shakeAnimation.value = 0;
        }
      );
    }
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    };
  });

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newPin = [...pin];
    newPin[index] = value.replace(/[^0-9]/g, ''); // Only numbers
    setPin(newPin);
    setError(false);

    // Move to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 4 digits are entered
    if (newPin.every((digit) => digit !== '') && value) {
      verifyPin(newPin.join(''));
    }
  };

  const handleBackspace = (index: number) => {
    const newPin = [...pin];
    if (newPin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    newPin[index] = '';
    setPin(newPin);
    setError(false);
  };

  const verifyPin = async (pinString: string) => {
    const savedPin = await storage.getPin();
    if (pinString === savedPin) {
      router.replace('/home');
    } else {
      setError(true);
      setPin(['', '', '', '']);
      inputRefs.current[0]?.focus();
      Alert.alert('Error', i18n.t('pin.invalidPin'));
    }
  };

  const handleForgotPin = () => {
    Alert.alert(
      'Forgot PIN?',
      'To reset your PIN, you need to logout and sign up again.',
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <View style={styles.content}>
        <Animated.View
          entering={FadeIn.duration(600)}
          style={styles.header}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.title}>{i18n.t('pin.enterPin')}</Text>
          <Text style={styles.subtitle}>Enter your PIN to continue</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.form}>
          <Animated.View style={[styles.pinContainer, animatedStyle]}>
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.pinInput,
                  digit !== '' && styles.pinInputFilled,
                  error && styles.pinInputError,
                ]}
                value={digit}
                onChangeText={(value) => handlePinChange(index, value)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
                keyboardType="number-pad"
                maxLength={1}
                secureTextEntry
                selectTextOnFocus
              />
            ))}
          </Animated.View>
          <TouchableOpacity
            style={styles.forgotPinButton}
            onPress={handleForgotPin}>
            <Text style={styles.forgotPinText}>
              Forgot PIN?
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
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
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: AppColors.border,
    borderRadius: AppStyles.borderRadius.medium,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: AppColors.text,
    backgroundColor: AppColors.background,
  },
  pinInputFilled: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryLight + '20',
  },
  pinInputError: {
    borderColor: AppColors.error,
  },
  forgotPinButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  forgotPinText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

