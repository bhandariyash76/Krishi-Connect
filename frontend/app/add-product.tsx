import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';
import { AppColors } from '@/constants/colors';
import api from '@/services/api';
import { storage } from '@/utils/storage';

export default function AddProductScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [description, setDescription] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [minOrderQuantity, setMinOrderQuantity] = useState('1');
    const [origin, setOrigin] = useState('');
    const [freshness, setFreshness] = useState('Fresh');
    const [loading, setLoading] = useState(false);

    const handleAddProduct = async () => {
        if (!name || !price || !quantity || !unit) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const userData = await storage.getUserData();
            if (!userData || !(userData as any)._id) {
                Alert.alert('Error', 'User not found');
                return;
            }

            await api.post('/products', {
                farmer: (userData as any)._id,
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

            Alert.alert('Success', 'Product added successfully', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.title}>Add New Product</Text>

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
                            title="Add Product"
                            onPress={handleAddProduct}
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
