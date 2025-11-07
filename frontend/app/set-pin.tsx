import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AppColors, AppStyles } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';

export default function SetPinScreen() {
  const router = useRouter();
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
              <Text
                style={styles.submitButton}
                onPress={handleSubmit}>
                {i18n.t('common.continue')}
              </Text>
              <Text
                style={styles.backButton}
                onPress={() => {
                  setStep('set');
                  setConfirmPin(['', '', '', '']);
                  inputRefs.current[0]?.focus();
                }}>
                {i18n.t('common.back')}
              </Text>
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
  },
  submitButton: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backButton: {
    fontSize: 16,
    color: AppColors.textSecondary,
    paddingVertical: 8,
  },
});

