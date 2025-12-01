import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { AppColors } from '@/constants/colors';
import api from '@/services/api';
import { storage } from '@/utils/storage';

export default function ProductDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [buyModalVisible, setBuyModalVisible] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        fetchProductDetails();
        loadUserData();
    }, [id]);

    const loadUserData = async () => {
        const userData = await storage.getUserData();
        setUserId((userData as any)?._id || '');
    };

    const fetchProductDetails = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
            setBuyQuantity(response.data.minOrderQuantity || 1);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch product details');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const confirmBuy = async () => {
        if (!product) return;

        try {
            const totalAmount = product.price * buyQuantity;

            // 1. Create Order
            const orderResponse = await api.post('/orders', {
                buyer: userId,
                farmer: product.farmer._id,
                items: [
                    {
                        product: product._id,
                        quantity: buyQuantity,
                        price: product.price
                    }
                ],
                totalAmount
            });

            const { order, razorpayOrder, keyId } = orderResponse.data;

            // 2. Initiate Payment
            const { initiateRazorpayPayment, verifyPayment } = require('@/services/payment');

            initiateRazorpayPayment(
                order,
                razorpayOrder,
                keyId,
                async (data: any) => {
                    // Success Callback
                    try {
                        await verifyPayment(data);
                        setBuyModalVisible(false);
                        Alert.alert('Success', 'Payment successful! Order placed.', [
                            { text: 'OK', onPress: () => router.push('/buyer-orders') }
                        ]);
                    } catch (verifyError) {
                        Alert.alert('Error', 'Payment verification failed. Please contact support.');
                    }
                },
                (error: any) => {
                    // Failure Callback
                    Alert.alert('Error', `Payment failed: ${error.description || error.message}`);
                }
            );

        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to initiate order');
        }
    };

    if (loading || !product) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

            {/* Buy Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={buyModalVisible}
                onRequestClose={() => setBuyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Buy {product.name}</Text>
                        <Text style={styles.modalPrice}>Price: ₹{product.price} / {product.unit}</Text>

                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                onPress={() => setBuyQuantity(Math.max(product.minOrderQuantity || 1, buyQuantity - 1))}
                                style={styles.quantityButton}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{buyQuantity}</Text>
                            <TouchableOpacity
                                onPress={() => setBuyQuantity(Math.min(product.quantity, buyQuantity + 1))}
                                style={styles.quantityButton}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.totalText}>Total: ₹{product.price * buyQuantity}</Text>

                        <View style={styles.modalActions}>
                            <Button
                                title="Cancel"
                                onPress={() => setBuyModalVisible(false)}
                                variant="secondary"
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title="Confirm Buy"
                                onPress={confirmBuy}
                                variant="primary"
                                style={{ flex: 1, marginLeft: 8 }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <BackButton onPress={() => router.back()} />

                <View style={styles.header}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>₹{product.price} / {product.unit}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <Text style={styles.description}>{product.description || 'No description available.'}</Text>
                </View>

                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Harvest Date</Text>
                        <Text style={styles.gridValue}>
                            {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Freshness</Text>
                        <Text style={styles.gridValue}>{product.freshness || 'N/A'}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Origin</Text>
                        <Text style={styles.gridValue}>{product.origin || 'N/A'}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Min Order Qty</Text>
                        <Text style={styles.gridValue}>{product.minOrderQuantity || 1} {product.unit}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Farmer Information</Text>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/profile', params: { userId: product.farmer?._id } })}>
                        <Text style={[styles.farmerName, { color: AppColors.primary, textDecorationLine: 'underline' }]}>
                            {product.farmer?.name}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.farmerContact}>{product.farmer?.email}</Text>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Buy Now"
                        onPress={() => setBuyModalVisible(true)}
                        variant="primary"
                        size="large"
                        disabled={product.quantity <= 0}
                    />
                    <Button
                        title="Contact Farmer"
                        onPress={() => router.push({
                            pathname: '/chat/[id]',
                            params: { id: product.farmer?._id, name: product.farmer?.name }
                        })}
                        variant="outline"
                        size="large"
                        style={{ marginTop: 12 }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 16,
    },
    header: {
        marginBottom: 24,
        marginTop: 16,
    },
    productName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    productPrice: {
        fontSize: 24,
        color: AppColors.primary,
        marginTop: 8,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: AppColors.textSecondary,
        lineHeight: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
    },
    gridItem: {
        width: '47%',
        backgroundColor: AppColors.card,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    gridLabel: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginBottom: 4,
    },
    gridValue: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.text,
    },
    farmerName: {
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.text,
    },
    farmerContact: {
        fontSize: 14,
        color: AppColors.textSecondary,
        marginTop: 4,
    },
    footer: {
        marginTop: 24,
        marginBottom: 40,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: AppColors.text,
    },
    modalPrice: {
        fontSize: 18,
        color: AppColors.primary,
        marginBottom: 24,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 20,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    quantityText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        color: AppColors.text,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
    },
});
