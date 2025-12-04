
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
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';
import { AppColors } from '@/constants/colors';
import api from '@/services/api';
import { storage } from '@/utils/storage';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

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
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        if (images.length >= 5) {
            if (Platform.OS === 'web') {
                window.alert('You can upload a maximum of 5 images.');
            } else {
                Alert.alert('Limit Reached', 'You can upload a maximum of 5 images.');
            }
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            selectionLimit: 5 - images.length, // Only works on some platforms, manual check needed
            allowsMultipleSelection: true, // Enable multiple selection
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            setImages(prev => [...prev, ...newImages].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddProduct = async () => {
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
            const userData = await storage.getUserData();
            if (!userData || !(userData as any)._id) {
                if (Platform.OS === 'web') {
                    window.alert('User not found');
                } else {
                    Alert.alert('Error', 'User not found');
                }
                return;
            }

            const formData = new FormData();
            formData.append('farmer', (userData as any)._id);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('unit', unit);
            formData.append('description', description);
            if (harvestDate) formData.append('harvestDate', harvestDate);
            formData.append('minOrderQuantity', minOrderQuantity);
            formData.append('origin', origin);
            formData.append('freshness', freshness);

            images.forEach((imageUri) => {
                const filename = imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : `image`;

                // @ts-ignore
                formData.append('images', { uri: imageUri, name: filename, type });
            });

            await api.post('/products', formData, {
                headers: {
                    'Accept': 'application/json',
                }
            });

            router.back();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Failed to add product';
            if (Platform.OS === 'web') {
                window.alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
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
                        <View style={styles.imageSection}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
                                {images.map((img, index) => (
                                    <View key={index} style={styles.imageContainer}>
                                        <Image source={{ uri: img }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={styles.removeButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {images.length < 5 && (
                                    <TouchableOpacity onPress={pickImage} style={styles.addImageButton}>
                                        <Ionicons name="camera-outline" size={32} color={AppColors.textSecondary} />
                                        <Text style={styles.addImageText}>Add</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                            <Text style={styles.imageCountText}>{images.length}/5 Images</Text>
                        </View>

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
    imageSection: {
        marginBottom: 16,
    },
    imageList: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    addImageButton: {
        width: 100,
        height: 100,
        backgroundColor: AppColors.backgroundLight,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: AppColors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        color: AppColors.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    imageCountText: {
        color: AppColors.textSecondary,
        fontSize: 12,
        textAlign: 'right',
    },
});
