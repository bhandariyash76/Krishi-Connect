import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { AppColors } from '@/constants/colors';
import i18n from '@/i18n';
import { storage } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import api, { setAuthToken } from '@/services/api';

export default function HomeScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [role, setRole] = useState<'farmer' | 'buyer' | 'admin' | null>(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'settings' | 'marketplace' | 'overview' | 'users' | 'transactions'>('inventory');

  // Admin State
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);

  // Buy Modal State
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  // Fetch data whenever role or userId is set
  useFocusEffect(
    useCallback(() => {
      if (role && userId) {
        // Redirect buyers to the new marketplace
        if (role === 'buyer') {
          router.replace('/buyer-marketplace');
          return;
        }

        if (role === 'farmer') {
          fetchFarmerProducts();
          fetchFarmerOrders();
          setActiveTab('inventory');
        } else if (role === 'admin') {
          fetchAdminStats();
          fetchAdminUsers();
          fetchAdminOrders();
          setActiveTab('overview');
        }
      }
    }, [role, userId])
  );

  const loadUserData = async () => {
    const userRole = await storage.getUserRole();
    const userData = await storage.getUserData();
    setRole(userRole as any);
    setUserName(userData?.name || '');
    setUserId((userData as any)?._id || '');
  };

  const fetchFarmerProducts = async () => {
    try {
      const response = await api.get(`/products/farmer/${userId}`);
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching farmer products', error);
    }
  };

  const fetchMarketplaceProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching marketplace products', error);
    }
  };

  const fetchFarmerOrders = async () => {
    try {
      const response = await api.get(`/orders/farmer/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.log('Error fetching farmer orders', error);
    }
  };

  const fetchBuyerOrders = async () => {
    try {
      const response = await api.get(`/orders/buyer/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.log('Error fetching buyer orders', error);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setAdminStats(response.data);
    } catch (error) {
      console.log('Error fetching admin stats', error);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setAdminUsers(response.data);
    } catch (error) {
      console.log('Error fetching admin users', error);
    }
  };

  const fetchAdminOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setAdminOrders(response.data);
    } catch (error) {
      console.log('Error fetching admin orders', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'pending' | 'completed') => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      fetchFarmerOrders(); // Refresh orders
      Alert.alert('Success', 'Order status updated!');
    } catch (error) {
      console.log('Error updating order status', error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const initiateBuy = (product: any) => {
    setSelectedProduct(product);
    setBuyQuantity(1);
    setBuyModalVisible(true);
  };

  const confirmBuy = async () => {
    if (!selectedProduct) return;

    try {
      const totalAmount = selectedProduct.price * buyQuantity;

      // 1. Create Order
      const orderResponse = await api.post('/orders', {
        buyer: userId,
        farmer: selectedProduct.farmer._id,
        items: [
          {
            product: selectedProduct._id,
            quantity: buyQuantity,
            price: selectedProduct.price
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
            Alert.alert('Success', 'Payment successful! Order placed.');
            fetchMarketplaceProducts(); // Refresh to show updated stock
            fetchBuyerOrders(); // Refresh orders list
          } catch (verifyError) {
            console.log('Verification Error', verifyError);
            Alert.alert('Error', 'Payment verification failed. Please contact support.');
          }
        },
        (error: any) => {
          // Failure Callback
          console.log('Payment Failed', error);
          Alert.alert('Error', `Payment failed: ${error.description || error.message}`);
        }
      );

    } catch (error: any) {
      console.log('Error placing order', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to place order');
    }
  };

  const performLogout = async () => {
    // Show loading indicator if possible, or just proceed
    try {
      console.log('🔴 === LOGOUT STARTED (HOME.TSX) ===');

      // Call backend logout API with short timeout
      try {
        const logoutPromise = api.post('/auth/logout');
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Logout timeout')), 2000)
        );
        await Promise.race([logoutPromise, timeoutPromise]);
        console.log('✓ Backend logout successful');
      } catch (apiError) {
        console.log('⚠ Backend logout error/timeout (continuing):', apiError);
      }

      // Reset local state
      setRole(null);
      setUserName('');
      setUserId('');
      setProducts([]);
      setOrders([]);
      setAdminStats(null);
      setAdminUsers([]);
      setAdminOrders([]);
      console.log('✓ Local state cleared');

      // Clear auth token from API
      setAuthToken('');
      console.log('✓ Auth token cleared');

      // Clear all storage - NUCLEAR OPTION
      try {
        await storage.clearAll();
        console.log('✓ Storage.clearAll() done');

        // Double clear with AsyncStorage directly
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.clear();
        console.log('✓ AsyncStorage.clear() done');
      } catch (storageError) {
        console.error('❌ Storage error:', storageError);
      }

      // Force reload the entire app by going to index which checks auth
      console.log('🔄 Reloading app via index...');
      router.replace('/');

      console.log('🔴 === LOGOUT COMPLETE ===');
    } catch (error) {
      console.error('❌ LOGOUT ERROR:', error);
      // Fallback navigation even on error
      router.replace('/');
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        await performLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }
  };

  const getRoleEmoji = () => {
    if (role === 'admin') return '🛡️';
    return role === 'farmer' ? '👨‍🌾' : '🛒';
  };

  const getRoleName = () => {
    if (role === 'admin') return 'Admin';
    return role === 'farmer' ? i18n.t('home.farmer') : i18n.t('home.buyer');
  };

  const performDelete = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      fetchFarmerProducts(); // Refresh list
      if (Platform.OS === 'web') {
        window.alert("Product deleted successfully");
      } else {
        Alert.alert("Success", "Product deleted successfully");
      }
    } catch (error) {
      console.log("Error deleting product", error);
      if (Platform.OS === 'web') {
        window.alert("Failed to delete product");
      } else {
        Alert.alert("Error", "Failed to delete product");
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await performDelete(productId);
      }
    } else {
      Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => performDelete(productId),
          },
        ]
      );
    }
  };

  const renderProductCard = (product: any, isBuyer: boolean) => (
    <Card key={product._id} style={styles.productCard}>
      {product.images && product.images.length > 0 && (
        <Image
          source={{ uri: `${api.defaults.baseURL?.replace('/api', '')}${product.images[0]}` }}
          style={styles.productImage}
        />
      )}
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>₹{product.price} / {product.unit}</Text>
      </View>
      <Text style={styles.productFarmer}>By: {product.farmer?.name}</Text>
      <Text style={styles.productQuantity}>Stock: {product.quantity} {product.unit}</Text>

      {isBuyer ? (
        <Button
          title="View Details"
          onPress={() => router.push({ pathname: '/product-details', params: { id: product._id } })}
          variant="primary"
          size="small"
          style={styles.actionButton}
          disabled={product.quantity <= 0}
        />
      ) : (
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Edit"
            onPress={() => router.push({ pathname: '/edit-product', params: { id: product._id } })}
            variant="outline"
            size="small"
            style={{ flex: 1, marginRight: 4 }}
          />
          <Button
            title="Delete"
            onPress={() => handleDeleteProduct(product._id)}
            variant="outline"
            size="small"
            style={{ flex: 1, marginLeft: 4, borderColor: '#FF6B6B' }}
            textStyle={{ color: '#FF6B6B' }}
          />
        </View>
      )}
    </Card>
  );

  const renderOrderCard = (order: any, isBuyer: boolean) => (
    <Card key={order._id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
        <Text style={[
          styles.orderStatus,
          order.status === 'completed' ? styles.statusCompleted : styles.statusPending
        ]}>
          {order.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.orderDetailText}>
        {isBuyer || role === 'admin' ? `From: ${order.farmer?.name}` : `Buyer: ${order.buyer?.name}`}
      </Text>
      <Text style={styles.orderTotal}>Total: ₹{order.totalAmount}</Text>
      <View style={styles.orderItems}>
        {order.items.map((item: any, index: number) => (
          <Text key={index} style={styles.orderItemText}>
            • {item.product?.name} x {item.quantity}
          </Text>
        ))}
      </View>
      {role === 'farmer' && order.status === 'pending' && (
        <Button
          title="Mark as Delivered"
          onPress={() => handleUpdateOrderStatus(order._id, 'completed')}
          variant="outline"
          size="small"
          style={styles.orderActionButton}
        />
      )}
    </Card>
  );

  const renderAdminStats = () => (
    <View style={styles.statsGrid}>
      <Card style={styles.statsCard}>
        <Text style={styles.statsValue}>{adminStats?.totalFarmers || 0}</Text>
        <Text style={styles.statsLabel}>Farmers</Text>
      </Card>
      <Card style={styles.statsCard}>
        <Text style={styles.statsValue}>{adminStats?.totalBuyers || 0}</Text>
        <Text style={styles.statsLabel}>Buyers</Text>
      </Card>
      <Card style={styles.statsCard}>
        <Text style={styles.statsValue}>{adminStats?.totalOrders || 0}</Text>
        <Text style={styles.statsLabel}>Orders</Text>
      </Card>
      <Card style={styles.statsCard}>
        <Text style={styles.statsValue}>₹{adminStats?.totalVolume || 0}</Text>
        <Text style={styles.statsLabel}>Volume</Text>
      </Card>
    </View>
  );

  const renderUserCard = (user: any) => (
    <Card key={user._id} style={styles.userCard}>
      <View style={styles.userHeader}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={[styles.userRole, user.role === 'farmer' ? styles.roleFarmer : styles.roleBuyer]}>
          {user.role.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.userDetail}>{user.email}</Text>
      <Text style={styles.userDetail}>{user.phone}</Text>
    </Card>
  );

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
            <Text style={styles.modalTitle}>Buy {selectedProduct?.name}</Text>
            <Text style={styles.modalPrice}>Price: ₹{selectedProduct?.price} / {selectedProduct?.unit}</Text>

            <View style={styles.quantityContainer}>
            </View>

            <Text style={styles.totalText}>Total: ₹{selectedProduct?.price * buyQuantity}</Text>

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <LanguageToggle />
            <TouchableOpacity onPress={() => router.push('/chat')}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color={AppColors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Ionicons name="person-circle-outline" size={32} color={AppColors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Card */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.welcomeSection}>
          <Card style={styles.welcomeCard}>
            <Text style={styles.emoji}>{getRoleEmoji()}</Text>
            <Text style={styles.welcomeText}>
              {i18n.t('home.welcome')}, {userName || getRoleName()}!
            </Text>
            <Text style={styles.roleText}>{getRoleName()}</Text>
          </Card>
        </Animated.View>

        <View style={styles.dashboardContainer}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            {role === 'farmer' && (
              <>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
                  onPress={() => setActiveTab('inventory')}
                >
                  <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>Inventory</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
                  onPress={() => setActiveTab('orders')}
                >
                  <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>Orders</Text>
                </TouchableOpacity>
              </>
            )}
            {role === 'buyer' && (
              <>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'marketplace' && styles.activeTab]}
                  onPress={() => setActiveTab('marketplace')}
                >
                  <Text style={[styles.tabText, activeTab === 'marketplace' && styles.activeTabText]}>Marketplace</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
                  onPress={() => setActiveTab('orders')}
                >
                  <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>My Orders</Text>
                </TouchableOpacity>
              </>
            )}
            {role === 'admin' && (
              <>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                  onPress={() => setActiveTab('overview')}
                >
                  <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'users' && styles.activeTab]}
                  onPress={() => setActiveTab('users')}
                >
                  <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
                  onPress={() => setActiveTab('transactions')}
                >
                  <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Txns</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
              onPress={() => setActiveTab('settings')}
            >
              <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Content Area */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.tabContent}>

            {/* Farmer Inventory */}
            {activeTab === 'inventory' && role === 'farmer' && (
              <>
                <Button
                  title={i18n.t('home.addProduct')}
                  onPress={() => router.push('/add-product')}
                  variant="primary"
                  size="large"
                  style={{ marginBottom: 24 }}
                />
                <Text style={styles.sectionTitle}>My Products</Text>
                {products.length === 0 ? (
                  <Text style={styles.noDataText}>No products added yet.</Text>
                ) : (
                  products.map(p => renderProductCard(p, false))
                )}
              </>
            )}

            {/* Buyer Marketplace */}
            {activeTab === 'marketplace' && role === 'buyer' && (
              <>
                <Text style={styles.sectionTitle}>Available Products</Text>
                {products.length === 0 ? (
                  <Text style={styles.noDataText}>No products available.</Text>
                ) : (
                  products.map(p => renderProductCard(p, true))
                )}
              </>
            )}

            {/* Orders Tab (Shared) */}
            {activeTab === 'orders' && (
              <>
                <Text style={styles.sectionTitle}>{role === 'farmer' ? 'Incoming Orders' : 'My Purchase History'}</Text>
                {orders.length === 0 ? (
                  <Text style={styles.noDataText}>No orders found.</Text>
                ) : (
                  orders.map(o => renderOrderCard(o, role === 'buyer'))
                )}
              </>
            )}

            {/* Admin Overview */}
            {activeTab === 'overview' && role === 'admin' && (
              <>
                <Text style={styles.sectionTitle}>System Overview</Text>
                {renderAdminStats()}
              </>
            )}

            {/* Admin Users */}
            {activeTab === 'users' && role === 'admin' && (
              <>
                <Text style={styles.sectionTitle}>User Management</Text>
                {adminUsers.map(renderUserCard)}
              </>
            )}

            {/* Admin Transactions */}
            {activeTab === 'transactions' && role === 'admin' && (
              <>
                <Text style={styles.sectionTitle}>All Transactions</Text>
                {adminOrders.map(o => renderOrderCard(o, true))}
              </>
            )}

            {/* Settings Tab (Shared) */}
            {activeTab === 'settings' && (
              <>
                <Text style={styles.sectionTitle}>Settings</Text>
                <Card style={styles.settingsCard}>
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Language</Text>
                    <LanguageToggle />
                  </View>
                  <View style={styles.settingDivider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Account</Text>
                    <Text style={styles.settingValue}>{userName}</Text>
                  </View>
                  <View style={styles.settingDivider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Role</Text>
                    <Text style={styles.settingValue}>{role === 'farmer' ? 'Farmer' : role === 'buyer' ? 'Buyer' : 'Admin'}</Text>
                  </View>
                </Card>
                <View style={{ marginBottom: 20 }}>
                  <Button
                    title={i18n.t('home.logout')}
                    onPress={handleLogout}
                    variant="secondary"
                    size="large"
                    style={styles.logoutButton}
                  />
                </View>
              </>
            )}

          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundLight,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: AppColors.primaryLight + '10',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 18,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  dashboardContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: AppColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  activeTabText: {
    color: AppColors.textLight,
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: AppColors.text,
  },
  noDataText: {
    textAlign: 'center',
    color: AppColors.textSecondary,
    fontSize: 16,
    marginTop: 20,
  },
  productCard: {
    padding: 16,
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  productPrice: {
    fontSize: 16,
    color: AppColors.primary,
    marginTop: 4,
  },
  productFarmer: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  actionButton: {
    marginTop: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  orderCard: {
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  statusCompleted: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  orderDetailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 8,
  },
  orderItems: {
    backgroundColor: AppColors.backgroundLight,
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  orderItemText: {
    fontSize: 13,
    color: AppColors.text,
  },
  orderActionButton: {
    marginTop: 8,
  },
  settingsCard: {
    padding: 16,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: AppColors.text,
  },
  settingValue: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  settingDivider: {
    height: 1,
    backgroundColor: AppColors.border,
    marginVertical: 4,
  },
  logoutButton: {
    marginTop: 24,
  },
  // Admin Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  statsLabel: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  userCard: {
    padding: 16,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  userRole: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  roleFarmer: {
    backgroundColor: '#E3F2FD',
    color: '#0D47A1',
  },
  roleBuyer: {
    backgroundColor: '#F3E5F5',
    color: '#7B1FA2',
  },
  userDetail: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 2,
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
