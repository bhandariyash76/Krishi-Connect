import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { storage } from '@/utils/storage';
import api from '@/services/api';
import { BackButton } from '@/components/ui/BackButton';

export default function BuyerOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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
            fetchOrders(id);
        }
    };

    const fetchOrders = async (id: string) => {
        try {
            const response = await api.get(`/orders/buyer/${id}`);
            setOrders(response.data);
        } catch (error) {
            console.log('Error fetching orders', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (userId) fetchOrders(userId);
    };

    const renderOrderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.paymentStatus === 'paid' ? '#E8F5E9' : '#FFF3E0' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: item.paymentStatus === 'paid' ? '#2E7D32' : '#EF6C00' }
                        ]}>
                            {item.paymentStatus?.toUpperCase() || 'PENDING'}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {item.items.map((orderItem: any, index: number) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                            {orderItem.product?.name || 'Unknown Product'} x {orderItem.quantity}
                        </Text>
                        <Text style={styles.itemPrice}>₹{orderItem.price * orderItem.quantity}</Text>
                    </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.orderFooter}>
                    <Text style={styles.dateText}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.totalAmount}>Total: ₹{item.totalAmount}</Text>
                </View>

                <Text style={styles.farmerText}>Farmer: {item.farmer?.name}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

            <View style={styles.header}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={64} color={AppColors.textSecondary} />
                            <Text style={styles.emptyText}>No orders yet</Text>
                        </View>
                    ) : null
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: AppColors.card,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: AppColors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.border,
        marginVertical: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 14,
        color: AppColors.text,
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.text,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: AppColors.textSecondary,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.primary,
    },
    farmerText: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginTop: 8,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 18,
        color: AppColors.textSecondary,
        marginTop: 16,
    },
});
