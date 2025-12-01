import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';
import { AppColors } from '@/constants/colors';
import api from '@/services/api';

export default function EditProductScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [description, setDescription] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [minOrderQuantity, setMinOrderQuantity] = useState('');
    const [origin, setOrigin] = useState('');
    const [freshness, setFreshness] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const product = response.data;
            setName(product.name);
            setPrice(product.price.toString());
            setQuantity(product.quantity.toString());
            setUnit(product.unit);
            setDescription(product.description || '');
            setHarvestDate(product.harvestDate ? product.harvestDate.split('T')[0] : '');
            setMinOrderQuantity(product.minOrderQuantity ? product.minOrderQuantity.toString() : '1');
            setOrigin(product.origin || '');
            setFreshness(product.freshness || 'Fresh');
        } catch (error) {
            console.log('Error fetching product details', error);
            if (Platform.OS === 'web') {
                window.alert('Failed to load product details');
            } else {
                Alert.alert('Error', 'Failed to load product details');
            }
            router.back();
        } finally {
            setFetching(false);
        }
    };

    const handleUpdateProduct = async () => {
        if (!name || !price || !quantity || !unit) {
            if (Platform.OS === 'web') {
                window.alert('Please fill in all required fields');
            } else {
                Alert.alert('Error', 'Please fill in all required fields');
            }
            return;
        }

        setLoading(true);
        try {
            await api.put(`/products/${id}`, {
                name,
                price: Number(price),
                quantity: Number(quantity),
                unit,
                description,
                harvestDate: harvestDate ? new Date(harvestDate) : undefined,
                minOrderQuantity: Number(minOrderQuantity),
                origin,
                freshness
            });

            if (Platform.OS === 'web') {
                window.alert('Product updated successfully');
                router.back();
            } else {
                Alert.alert('Success', 'Product updated successfully', [
                    { text: 'OK', onPress: () => router.back() },
                ]);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update product';
            if (Platform.OS === 'web') {
                window.alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.title}>Edit Product</Text>

                    <View style={styles.form}>
                        <Input
                            label="Product Name *"
                            placeholder="e.g. Tomato"
                            value={name}
                            onChangeText={setName}
                        />
                        <Input
                            label="Description"
                            placeholder="Detailed product info..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Input
                                    label="Price (₹) *"
                                    placeholder="e.g. 40"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Input
                                    label="Unit *"
                                    placeholder="e.g. kg"
                                    value={unit}
                                    onChangeText={setUnit}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Input
                                    label="Total Stock *"
                                    placeholder="e.g. 1000"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Input
                                    label="Min Order Qty"
                                    placeholder="e.g. 50"
                                    value={minOrderQuantity}
                                    onChangeText={setMinOrderQuantity}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Input
                            label="Harvest Date (YYYY-MM-DD)"
                            placeholder="e.g. 2023-10-25"
                            value={harvestDate}
                            onChangeText={setHarvestDate}
                        />
                        <Input
                            label="Origin / Location"
                            placeholder="e.g. Nashik, Maharashtra"
                            value={origin}
                            onChangeText={setOrigin}
                        />
                        <Input
                            label="Freshness Status"
                            placeholder="e.g. Fresh, Stored"
                            value={freshness}
                            onChangeText={setFreshness}
                        />

                        <Button
                            title="Update Product"
                            onPress={handleUpdateProduct}
                            variant="primary"
                            size="large"
                            loading={loading}
                            style={styles.submitButton}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: AppColors.primary,
        marginBottom: 24,
        marginTop: 16,
    },
    form: {
        gap: 16,
    },
    submitButton: {
        marginTop: 24,
    },
});
