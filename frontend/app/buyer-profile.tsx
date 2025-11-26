import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/colors';
import { storage } from '@/utils/storage';
import api from '@/services/api';

interface Address {
    _id: string;
    type: 'home' | 'work' | 'other';
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
}

export default function BuyerProfile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState({
        type: 'home' as 'home' | 'work' | 'other',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false,
    });

    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [])
    );

    const loadUserData = async () => {
        const userData = await storage.getUserData();
        const userId = (userData as any)?._id;
        if (userId) {
            fetchUserProfile(userId);
            fetchAddresses(userId);
        }
    };

    const fetchUserProfile = async (userId: string) => {
        try {
            const response = await api.get(`/users/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.log('Error fetching user profile', error);
        }
    };

    const fetchAddresses = async (userId: string) => {
        try {
            const response = await api.get(`/users/${userId}/addresses`);
            setAddresses(response.data);
        } catch (error) {
            console.log('Error fetching addresses', error);
        }
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setAddressForm({
            type: 'home',
            fullName: user?.name || '',
            phone: user?.phone || '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            landmark: '',
            isDefault: addresses.length === 0,
        });
        setShowAddressModal(true);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setAddressForm({
            type: address.type,
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            landmark: address.landmark || '',
            isDefault: address.isDefault,
        });
        setShowAddressModal(true);
    };

    const handleSaveAddress = async () => {
        if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine1 ||
            !addressForm.city || !addressForm.state || !addressForm.pincode) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            if (editingAddress) {
                await api.put(`/users/${user._id}/addresses/${editingAddress._id}`, addressForm);
                Alert.alert('Success', 'Address updated successfully');
            } else {
                await api.post(`/users/${user._id}/addresses`, addressForm);
                Alert.alert('Success', 'Address added successfully');
            }
            setShowAddressModal(false);
            fetchAddresses(user._id);
        } catch (error) {
            Alert.alert('Error', 'Failed to save address');
        }
    };

    const handleDeleteAddress = (addressId: string) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/users/${user._id}/addresses/${addressId}`);
                            Alert.alert('Success', 'Address deleted successfully');
                            fetchAddresses(user._id);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete address');
                        }
                    },
                },
            ]
        );
    };

    const getAddressTypeIcon = (type: string) => {
        switch (type) {
            case 'home': return 'home';
            case 'work': return 'briefcase';
            default: return 'location';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={AppColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={() => router.push('/buyer-settings')} style={styles.backButton}>
                    <Ionicons name="settings-outline" size={24} color={AppColors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <Card style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color={AppColors.primary} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user?.name}</Text>
                            <Text style={styles.profileEmail}>{user?.email}</Text>
                            <Text style={styles.profilePhone}>{user?.phone}</Text>
                        </View>
                    </View>
                </Card>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <Card style={styles.statCard}>
                        <Ionicons name="cart-outline" size={24} color={AppColors.primary} />
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Ionicons name="heart-outline" size={24} color={AppColors.primary} />
                        <Text style={styles.statValue}>{user?.wishlist?.length || 0}</Text>
                        <Text style={styles.statLabel}>Wishlist</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Ionicons name="location-outline" size={24} color={AppColors.primary} />
                        <Text style={styles.statValue}>{addresses.length}</Text>
                        <Text style={styles.statLabel}>Addresses</Text>
                    </Card>
                </View>

                {/* Addresses Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Saved Addresses</Text>
                        <TouchableOpacity onPress={handleAddAddress}>
                            <Text style={styles.addButton}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>

                    {addresses.length === 0 ? (
                        <Card style={styles.emptyCard}>
                            <Ionicons name="location-outline" size={48} color={AppColors.textSecondary} />
                            <Text style={styles.emptyText}>No addresses saved</Text>
                            <Text style={styles.emptySubtext}>Add an address to get started</Text>
                        </Card>
                    ) : (
                        addresses.map((address) => (
                            <Card key={address._id} style={styles.addressCard}>
                                <View style={styles.addressHeader}>
                                    <View style={styles.addressTypeContainer}>
                                        <Ionicons
                                            name={getAddressTypeIcon(address.type)}
                                            size={20}
                                            color={AppColors.primary}
                                        />
                                        <Text style={styles.addressType}>{address.type.toUpperCase()}</Text>
                                        {address.isDefault && (
                                            <View style={styles.defaultBadge}>
                                                <Text style={styles.defaultText}>DEFAULT</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.addressActions}>
                                        <TouchableOpacity onPress={() => handleEditAddress(address)}>
                                            <Ionicons name="pencil" size={20} color={AppColors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteAddress(address._id)}>
                                            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={styles.addressName}>{address.fullName}</Text>
                                <Text style={styles.addressText}>{address.addressLine1}</Text>
                                {address.addressLine2 && (
                                    <Text style={styles.addressText}>{address.addressLine2}</Text>
                                )}
                                <Text style={styles.addressText}>
                                    {address.city}, {address.state} - {address.pincode}
                                </Text>
                                {address.landmark && (
                                    <Text style={styles.addressLandmark}>Landmark: {address.landmark}</Text>
                                )}
                                <Text style={styles.addressPhone}>Phone: {address.phone}</Text>
                            </Card>
                        ))
                    )}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <Card style={styles.actionCard}>
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => router.push('/buyer-orders')}
                        >
                            <Ionicons name="receipt-outline" size={24} color={AppColors.primary} />
                            <Text style={styles.actionText}>My Orders</Text>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => router.push('/buyer-wishlist')}
                        >
                            <Ionicons name="heart-outline" size={24} color={AppColors.primary} />
                            <Text style={styles.actionText}>My Wishlist</Text>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => router.push('/buyer-settings')}
                        >
                            <Ionicons name="settings-outline" size={24} color={AppColors.primary} />
                            <Text style={styles.actionText}>Settings</Text>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>
                    </Card>
                </View>
            </ScrollView>

            {/* Address Modal */}
            <Modal
                visible={showAddressModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddressModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                                <Ionicons name="close" size={24} color={AppColors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            {/* Address Type */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Address Type</Text>
                                <View style={styles.typeButtons}>
                                    {['home', 'work', 'other'].map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.typeButton,
                                                addressForm.type === type && styles.typeButtonActive
                                            ]}
                                            onPress={() => setAddressForm({ ...addressForm, type: type as any })}
                                        >
                                            <Text style={[
                                                styles.typeButtonText,
                                                addressForm.type === type && styles.typeButtonTextActive
                                            ]}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Full Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addressForm.fullName}
                                    onChangeText={(text) => setAddressForm({ ...addressForm, fullName: text })}
                                    placeholder="Enter full name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Phone Number *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addressForm.phone}
                                    onChangeText={(text) => setAddressForm({ ...addressForm, phone: text })}
                                    placeholder="Enter phone number"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Address Line 1 *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addressForm.addressLine1}
                                    onChangeText={(text) => setAddressForm({ ...addressForm, addressLine1: text })}
                                    placeholder="House no., Building name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Address Line 2</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addressForm.addressLine2}
                                    onChangeText={(text) => setAddressForm({ ...addressForm, addressLine2: text })}
                                    placeholder="Road name, Area, Colony"
                                />
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.formLabel}>City *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={addressForm.city}
                                        onChangeText={(text) => setAddressForm({ ...addressForm, city: text })}
                                        placeholder="City"
                                    />
                                </View>

                                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.formLabel}>State *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={addressForm.state}
                                        onChangeText={(text) => setAddressForm({ ...addressForm, state: text })}
                                        placeholder="State"
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Pincode *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addressForm.pincode}
                                    onChangeText={(text) => setAddressForm({ ...addressForm, pincode: text })}
                                    placeholder="Enter pincode"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Landmark (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addressForm.landmark}
                                    onChangeText={(text) => setAddressForm({ ...addressForm, landmark: text })}
                                    placeholder="Nearby landmark"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setAddressForm({ ...addressForm, isDefault: !addressForm.isDefault })}
                            >
                                <Ionicons
                                    name={addressForm.isDefault ? 'checkbox' : 'square-outline'}
                                    size={24}
                                    color={AppColors.primary}
                                />
                                <Text style={styles.checkboxLabel}>Set as default address</Text>
                            </TouchableOpacity>

                            <Button
                                title="Save Address"
                                onPress={handleSaveAddress}
                                variant="primary"
                                size="large"
                                style={styles.saveButton}
                            />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: AppColors.card,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    profileCard: {
        padding: 20,
        marginBottom: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AppColors.primaryLight + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: AppColors.text,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: AppColors.textSecondary,
        marginBottom: 2,
    },
    profilePhone: {
        fontSize: 14,
        color: AppColors.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: AppColors.primary,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    addButton: {
        fontSize: 14,
        color: AppColors.primary,
        fontWeight: '600',
    },
    emptyCard: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.text,
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: AppColors.textSecondary,
        marginTop: 4,
    },
    addressCard: {
        padding: 16,
        marginBottom: 12,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addressTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressType: {
        fontSize: 12,
        fontWeight: 'bold',
        color: AppColors.primary,
    },
    defaultBadge: {
        backgroundColor: AppColors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 10,
        color: AppColors.textLight,
        fontWeight: 'bold',
    },
    addressActions: {
        flexDirection: 'row',
        gap: 16,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.text,
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: AppColors.textSecondary,
        marginBottom: 2,
    },
    addressLandmark: {
        fontSize: 13,
        color: AppColors.textSecondary,
        fontStyle: 'italic',
        marginTop: 4,
    },
    addressPhone: {
        fontSize: 14,
        color: AppColors.text,
        marginTop: 8,
        fontWeight: '500',
    },
    actionCard: {
        padding: 0,
        overflow: 'hidden',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        color: AppColors.text,
        marginLeft: 16,
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.border,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: AppColors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    modalScroll: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.text,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: AppColors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: AppColors.text,
        backgroundColor: AppColors.backgroundLight,
    },
    formRow: {
        flexDirection: 'row',
    },
    typeButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: AppColors.border,
        alignItems: 'center',
    },
    typeButtonActive: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    typeButtonText: {
        fontSize: 14,
        color: AppColors.text,
        fontWeight: '500',
    },
    typeButtonTextActive: {
        color: AppColors.textLight,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxLabel: {
        fontSize: 14,
        color: AppColors.text,
        marginLeft: 8,
    },
    saveButton: {
        marginBottom: 20,
    },
});
