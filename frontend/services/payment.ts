import { Platform, Alert } from 'react-native';
import api from './api';
import { AppColors } from '@/constants/colors';

// Razorpay Test Key
const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag';

export const initiateRazorpayPayment = async (
    order: any,
    razorpayOrder: any,
    keyId: string,
    onSuccess: (data: any) => void,
    onFailure: (error: any) => void
) => {
    if (Platform.OS === 'web') {
        // Load Razorpay Script dynamically
        const loadScript = (src: string) => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        try {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

            if (!res) {
                Alert.alert('Error', 'Razorpay SDK failed to load. Please check your internet connection.');
                onFailure({ message: 'Razorpay SDK failed to load' });
                return;
            }

            const options = {
                key: keyId,
                amount: razorpayOrder.amount,
                currency: 'INR',
                name: 'Krishi Connect',
                description: `Order #${order._id}`,
                image: 'https://i.imgur.com/3g7nmJC.png',
                order_id: razorpayOrder.id,
                handler: function (response: any) {
                    onSuccess(response);
                },
                prefill: {
                    name: 'Buyer Name', // Ideally fetch from user profile
                    email: 'buyer@example.com',
                    contact: '9123456789'
                },
                theme: {
                    color: AppColors.primary
                },
                modal: {
                    ondismiss: function () {
                        onFailure({ description: 'Payment cancelled by user' });
                    }
                }
            };

            console.log('🚀 Razorpay Options:', JSON.stringify(options, null, 2));

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Razorpay Web Error:", error);
            onFailure(error);
        }
        return;
    }

    // Native Implementation
    try {
        let RazorpayCheckout = null;
        let isNativeAvailable = false;

        try {
            // 1. Check if NativeModules.RNRazorpay exists (Crucial for Expo Go)
            const { NativeModules } = require('react-native');
            if (!NativeModules || !NativeModules.RNRazorpay) {
                console.log("NativeModules.RNRazorpay is missing (Expo Go detected)");
                isNativeAvailable = false;
            } else {
                // 2. Try to require the JS module
                const module = require('react-native-razorpay');
                RazorpayCheckout = module.default || module;

                // 3. Check if it has the open method
                if (RazorpayCheckout && typeof RazorpayCheckout.open === 'function') {
                    isNativeAvailable = true;
                }
            }
        } catch (e) {
            console.log("Failed to load react-native-razorpay or NativeModules:", e);
            isNativeAvailable = false;
        }

        // Force simulation if native module is missing or invalid (Expo Go)
        if (!isNativeAvailable) {
            console.log("Razorpay native module not available. Using simulation.");
            Alert.alert(
                "Payment Simulation",
                "Razorpay Native SDK is not supported in Expo Go. Do you want to simulate a successful payment?",
                [
                    {
                        text: "Cancel",
                        onPress: () => onFailure({ description: "Payment cancelled by user" }),
                        style: "cancel"
                    },
                    {
                        text: "Simulate Success",
                        onPress: () => {
                            onSuccess({
                                razorpay_payment_id: "pay_simulated_" + Date.now(),
                                razorpay_order_id: razorpayOrder.id,
                                razorpay_signature: "simulated_signature"
                            });
                        }
                    }
                ]
            );
            return;
        }

        const options = {
            description: `Order #${order._id}`,
            image: 'https://i.imgur.com/3g7nmJC.png', // Placeholder logo
            currency: 'INR',
            key: keyId,
            amount: razorpayOrder.amount,
            name: 'Krishi Connect',
            order_id: razorpayOrder.id,
            prefill: {
                email: 'buyer@example.com', // Ideally fetch from user profile
                contact: '9123456789',      // Ideally fetch from user profile
                name: 'Buyer Name'          // Ideally fetch from user profile
            },
            theme: { color: AppColors.primary }
        };

        RazorpayCheckout.open(options)
            .then((data: any) => {
                onSuccess(data);
            })
            .catch((error: any) => {
                onFailure(error);
            });

    } catch (error) {
        console.error("Razorpay SDK Error:", error);
        Alert.alert("Error", "Razorpay SDK not available");
        onFailure(error);
    }
};

export const verifyPayment = async (paymentData: any) => {
    try {
        const response = await api.post('/orders/verify', {
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
