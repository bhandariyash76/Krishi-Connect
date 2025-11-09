import React, { useState, useRef } from 'react';
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
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { AppColors, AppStyles } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SetPinScreen() {
  const router = useRouter();
  const { language } = useLanguage(); // Trigger re-render on language change
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState<'set' | 'confirm'>('set');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (value.length > 1) return; // Only allow single digit

    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    currentPin[index] = value.replace(/[^0-9]/g, ''); // Only numbers

    if (isConfirm) {
      setConfirmPin(currentPin);
    } else {
      setPin(currentPin);
    }

    // Move to next input
    if (value && index < 3) {
      inputRefs.current[isConfirm ? index + 4 : index + 1]?.focus();
    }

    // Auto submit when all 4 digits are entered
    if (!isConfirm && currentPin.every((digit) => digit !== '') && value) {
      setTimeout(() => {
        setStep('confirm');
        inputRefs.current[4]?.focus();
      }, 100);
    }
  };

  const handleBackspace = (index: number, isConfirm = false) => {
    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    if (currentPin[index] === '' && index > 0) {
      inputRefs.current[isConfirm ? index + 3 : index - 1]?.focus();
    }
    currentPin[index] = '';
    if (isConfirm) {
      setConfirmPin(currentPin);
    } else {
      setPin(currentPin);
    }
  };

  const handleSubmit = async () => {
    if (pin.some((digit) => digit === '')) {
      Alert.alert('Error', 'Please enter a 4-digit PIN');
      return;
    }

    if (confirmPin.some((digit) => digit === '')) {
      Alert.alert('Error', 'Please confirm your PIN');
      return;
    }

    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');

    if (pinString !== confirmPinString) {
      Alert.alert('Error', i18n.t('pin.pinMismatch'));
      setConfirmPin(['', '', '', '']);
      inputRefs.current[4]?.focus();
      return;
    }

    // Save PIN
    await storage.setPin(pinString);
    router.replace('/home');
  };

  const PinInputs = ({ pins, isConfirm }: { pins: string[]; isConfirm?: boolean }) => (
    <View style={styles.pinContainer}>
      {pins.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[isConfirm ? index + 4 : index] = ref;
          }}
          style={[styles.pinInput, digit !== '' && styles.pinInputFilled]}
          value={digit}
          onChangeText={(value) => handlePinChange(index, value, isConfirm)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') {
              handleBackspace(index, isConfirm);
            }
          }}
          keyboardType="number-pad"
          maxLength={1}
          secureTextEntry
          selectTextOnFocus
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <View style={styles.content}>
        {step === 'set' && (
          <BackButton 
            onPress={() => router.push('/role-selection')}
            style={styles.backButton}
          />
        )}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.title}>
            {step === 'set' ? i18n.t('pin.setPin') : i18n.t('pin.confirmPin')}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'set'
              ? 'Create a 4-digit PIN to secure your account'
              : 'Confirm your PIN'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.form}>
          {step === 'set' ? (
            <PinInputs pins={pin} />
          ) : (
            <PinInputs pins={confirmPin} isConfirm />
          )}

          {step === 'confirm' && (
            <Animated.View
              entering={FadeInDown.delay(500).duration(600)}
              style={styles.buttonContainer}>
              <Button
                title={i18n.t('common.continue')}
                onPress={handleSubmit}
                variant="primary"
                size="large"
                style={styles.continueButton}
              />
              <TouchableOpacity
                style={styles.backButtonText}
                onPress={() => {
                  setStep('set');
                  setConfirmPin(['', '', '', '']);
                  inputRefs.current[0]?.focus();
                }}>
                <Text style={styles.backButtonLabel}>
                  {i18n.t('common.back')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 16,
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
    marginBottom: 48,
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
  buttonContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  continueButton: {
    width: '100%',
    maxWidth: 300,
  },
  backButtonText: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonLabel: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
});

