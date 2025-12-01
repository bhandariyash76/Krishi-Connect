import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Dimensions,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { storage } from '@/utils/storage';
import api from '@/services/api';

const { width } = Dimensions.get('window');

export default function BuyerMarketplace() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [userId, setUserId] = useState('');
    const [wishlist, setWishlist] = useState<string[]>([]);

    const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];

    useFocusEffect(
        useCallback(() => {
            loadUserData();
            fetchProducts();
        }, [])
    );

    const loadUserData = async () => {
        const userData = await storage.getUserData();
        setUserId((userData as any)?._id || '');
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.log('Error fetching products', error);
        }
    };

    const fetchWishlist = async () => {
        if (!userId) return;
        try {
            const response = await api.get(`/users/${userId}/wishlist`);
            setWishlist(response.data.map((item: any) => item._id));
        } catch (error) {
            console.log('Error fetching wishlist', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchWishlist();
        }
    }, [userId]);

    useEffect(() => {
        filterAndSortProducts();
    }, [searchQuery, selectedCategory, sortBy, products]);

    const filterAndSortProducts = () => {
        let filtered = [...products];
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.farmer?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
        setFilteredProducts(filtered);
    };

    const toggleWishlist = async (productId: string) => {
        try {
            if (wishlist.includes(productId)) {
                await api.delete(`/users/${userId}/wishlist/${productId}`);
                setWishlist(wishlist.filter(id => id !== productId));
            } else {
                await api.post(`/users/${userId}/wishlist/${productId}`);
                setWishlist([...wishlist, productId]);
            }
        } catch (error) {
            console.log('Error toggling wishlist', error);
        }
    };

    const renderProductCard = ({ item }: { item: any }) => {
        const isInWishlist = wishlist.includes(item._id);
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
                        style={styles.wishlistButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            toggleWishlist(item._id);
                        }}
                    >
                        <Ionicons
                            name={isInWishlist ? 'heart' : 'heart-outline'}
                            size={20}
                            color={isInWishlist ? '#FF6B6B' : AppColors.textSecondary}
                        />
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
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Krishi Marketplace</Text>
                    <View style={styles.headerIcons}>
                        {/* EMERGENCY LOGOUT BUTTON */}
                        <TouchableOpacity
                            onPress={async () => {
                                console.log('🧪 === EMERGENCY LOGOUT TEST ===');
                                try {
                                    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                                    await AsyncStorage.clear();
                                    const { setAuthToken } = require('@/services/api');
                                    setAuthToken('');
                                    console.log('✅ Storage & Token Cleared');

                                    // Force reload
                                    router.replace('/');
                                } catch (error) {
                                    console.error('Logout error:', error);
                                }
                            }}
                            style={{
                                padding: 6,
                                backgroundColor: '#FF6B6B',
                                borderRadius: 6,
                                marginRight: 8
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>LOGOUT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/buyer-wishlist')} style={styles.iconButton}>
                            <Ionicons name="heart-outline" size={24} color={AppColors.primary} />
                            {wishlist.length > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{wishlist.length}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/buyer-profile')} style={styles.iconButton}>
                            <Ionicons name="person-circle-outline" size={28} color={AppColors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={AppColors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products or farmers..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={AppColors.textSecondary}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryChip,
                            selectedCategory === category && styles.categoryChipActive
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category && styles.categoryTextActive
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.filtersContainer}>
                <Text style={styles.resultsText}>
                    {filteredProducts.length} Products
                </Text>
                <View style={styles.sortContainer}>
                    <Text style={styles.sortLabel}>Sort:</Text>
                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={() => {
                            const options = ['name', 'price-low', 'price-high'];
                            const currentIndex = options.indexOf(sortBy);
                            const nextIndex = (currentIndex + 1) % options.length;
                            setSortBy(options[nextIndex]);
                        }}
                    >
                        <Text style={styles.sortText}>
                            {sortBy === 'name' ? 'Name' : sortBy === 'price-low' ? 'Price ↑' : 'Price ↓'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={AppColors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredProducts}
                renderItem={renderProductCard}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.productsGrid}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="basket-outline" size={64} color={AppColors.textSecondary} />
                        <Text style={styles.emptyText}>No products found</Text>
                        <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    header: {
        backgroundColor: AppColors.card,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: AppColors.primary,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundLight,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: AppColors.text,
    },
    categoriesContainer: {
        maxHeight: 50,
        backgroundColor: AppColors.card,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: AppColors.backgroundLight,
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    categoryChipActive: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    categoryText: {
        fontSize: 14,
        color: AppColors.text,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: AppColors.textLight,
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: AppColors.card,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    resultsText: {
        fontSize: 14,
        color: AppColors.textSecondary,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sortLabel: {
        fontSize: 14,
        color: AppColors.textSecondary,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sortText: {
        fontSize: 14,
        color: AppColors.primary,
        fontWeight: '500',
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
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        padding: 4,
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
