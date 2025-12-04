import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { storage } from '@/utils/storage';
import api from '@/services/api';

const { width } = Dimensions.get('window');

export default function BuyerWishlist() {
    const router = useRouter();
    const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [])
    );

    const loadUserData = async () => {
        const userData = await storage.getUserData();
        const id = (userData as any)?._id;
        if (id) {
            setUserId(id);
            fetchWishlist(id);
        }
    };

    const fetchWishlist = async (id: string) => {
        try {
            setLoading(true);
            const response = await api.get(`/users/${id}/wishlist`);
            // Assuming the API returns the full product objects in the wishlist
            setWishlistProducts(response.data);
        } catch (error) {
            console.log('Error fetching wishlist', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            await api.delete(`/users/${userId}/wishlist/${productId}`);
            setWishlistProducts(prev => prev.filter(item => item._id !== productId));
        } catch (error) {
            console.log('Error removing from wishlist', error);
        }
    };

    const renderProductCard = ({ item }: { item: any }) => {
        const isOutOfStock = item.quantity <= 0;

        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => router.push({ pathname: '/product-details', params: { id: item._id } })}
                disabled={isOutOfStock}
            >
                <View style={styles.productImageContainer}>
                    <View style={[styles.productImage, isOutOfStock && styles.outOfStock]}>
                        <Text style={styles.productEmoji}>🌾</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(item._id);
                        }}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                    {isOutOfStock && (
                        <View style={styles.outOfStockBadge}>
                            <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                    )}
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productFarmer} numberOfLines={1}>
                        <Ionicons name="person-outline" size={12} /> {item.farmer?.name}
                    </Text>
                    <View style={styles.productFooter}>
                        <View>
                            <Text style={styles.productPrice}>₹{item.price}</Text>
                            <Text style={styles.productUnit}>per {item.unit}</Text>
                        </View>
                        {!isOutOfStock && (
                            <View style={styles.stockBadge}>
                                <Text style={styles.stockText}>{item.quantity} {item.unit}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={AppColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wishlist</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            ) : (
                <FlatList
                    data={wishlistProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    contentContainerStyle={styles.productsGrid}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="heart-dislike-outline" size={64} color={AppColors.textSecondary} />
                            <Text style={styles.emptyText}>Your wishlist is empty</Text>
                            <Text style={styles.emptySubtext}>Save items you want to buy later</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: AppColors.card,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productsGrid: {
        padding: 16,
        gap: 16,
    },
    productCard: {
        width: (width - 48) / 2,
        backgroundColor: AppColors.card,
        borderRadius: 12,
        marginBottom: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    productImageContainer: {
        height: 120,
        backgroundColor: '#F0F9F0',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productEmoji: {
        fontSize: 48,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: 6,
    },
    outOfStock: {
        opacity: 0.5,
    },
    outOfStockBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        alignItems: 'center',
    },
    outOfStockText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.text,
        marginBottom: 4,
        height: 40,
    },
    productFarmer: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginBottom: 8,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.primary,
    },
    productUnit: {
        fontSize: 10,
        color: AppColors.textSecondary,
    },
    stockBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    stockText: {
        fontSize: 10,
        color: AppColors.primary,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColors.text,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: AppColors.textSecondary,
        marginTop: 8,
    },
});
