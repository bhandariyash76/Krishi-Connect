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
    Switch,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { AppColors } from '@/constants/colors';
import { storage } from '@/utils/storage';
import api, { setAuthToken } from '@/services/api';
import i18n from '@/i18n';

export default function BuyerSettings() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);

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

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('=== LOGOUT PROCESS STARTED ===');

                            // Step 1: Call backend logout API
                            try {
                                await api.post('/auth/logout');
                                console.log('✓ Backend logout successful');
                            } catch (apiError) {
                                console.log('⚠ Backend logout error (continuing):', apiError);
                            }

                            // Step 2: Clear auth token from API headers
                            setAuthToken('');
                            console.log('✓ Auth token cleared from API headers');

                            // Step 3: Clear all AsyncStorage using both methods
                            try {
                                // Method 1: Use storage utility
                                await storage.clearAll();
                                console.log('✓ Storage.clearAll() completed');

                                // Method 2: Direct AsyncStorage clear (nuclear option)
                                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                                await AsyncStorage.clear();
                                console.log('✓ AsyncStorage.clear() completed');
                            } catch (storageError) {
                                console.error('✗ Storage clear error:', storageError);
                            }

                            // Step 4: Force reload the entire app
                            console.log('🔄 Reloading app...');
                            if (typeof window !== 'undefined') {
                                window.location.href = '/';
                            } else {
                                // Fallback for native (though this is mostly web)
                                router.replace('/welcome');
                            }

                            console.log('=== LOGOUT COMPLETE ===');
                        } catch (error) {
                            console.error('✗ LOGOUT ERROR:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Info', 'Account deletion feature will be implemented soon.');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={AppColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <Card style={styles.card}>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => router.push('/buyer-profile')}
                        >
                            <View style={styles.settingLeft}>
                                <Ionicons name="person-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Profile</Text>
                                    <Text style={styles.settingSubtitle}>Manage your profile and addresses</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="mail-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Email</Text>
                                    <Text style={styles.settingSubtitle}>{user?.email}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="call-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Phone</Text>
                                    <Text style={styles.settingSubtitle}>{user?.phone}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <Card style={styles.card}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="language-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Language</Text>
                                    <Text style={styles.settingSubtitle}>Choose your preferred language</Text>
                                </View>
                            </View>
                            <LanguageToggle />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="notifications-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Push Notifications</Text>
                                    <Text style={styles.settingSubtitle}>Receive order updates</Text>
                                </View>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: AppColors.border, true: AppColors.primaryLight }}
                                thumbColor={notificationsEnabled ? AppColors.primary : AppColors.textSecondary}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="mail-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Email Notifications</Text>
                                    <Text style={styles.settingSubtitle}>Receive promotional emails</Text>
                                </View>
                            </View>
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
                                trackColor={{ false: AppColors.border, true: AppColors.primaryLight }}
                                thumbColor={emailNotifications ? AppColors.primary : AppColors.textSecondary}
                            />
                        </View>
                    </Card>
                </View>

                {/* Orders & Shopping */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Orders & Shopping</Text>
                    <Card style={styles.card}>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => router.push('/buyer-orders')}
                        >
                            <View style={styles.settingLeft}>
                                <Ionicons name="receipt-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>My Orders</Text>
                                    <Text style={styles.settingSubtitle}>View your order history</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => router.push('/buyer-wishlist')}
                        >
                            <View style={styles.settingLeft}>
                                <Ionicons name="heart-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>My Wishlist</Text>
                                    <Text style={styles.settingSubtitle}>View saved products</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => router.push('/buyer-profile')}
                        >
                            <View style={styles.settingLeft}>
                                <Ionicons name="location-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Saved Addresses</Text>
                                    <Text style={styles.settingSubtitle}>Manage delivery addresses</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <Card style={styles.card}>
                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="help-circle-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Help Center</Text>
                                    <Text style={styles.settingSubtitle}>Get help with your orders</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="chatbubble-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Contact Support</Text>
                                    <Text style={styles.settingSubtitle}>Chat with our support team</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="document-text-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Terms & Conditions</Text>
                                    <Text style={styles.settingSubtitle}>Read our terms</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="shield-checkmark-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Privacy Policy</Text>
                                    <Text style={styles.settingSubtitle}>How we protect your data</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={AppColors.textSecondary} />
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Card style={styles.card}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="information-circle-outline" size={24} color={AppColors.primary} />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>App Version</Text>
                                    <Text style={styles.settingSubtitle}>1.0.0</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Actions</Text>
                    <Button
                        title={i18n.t('home.logout')}
                        onPress={handleLogout}
                        variant="secondary"
                        size="large"
                        style={styles.logoutButton}
                    />
                    <Button
                        title="Delete Account"
                        onPress={handleDeleteAccount}
                        variant="secondary"
                        size="large"
                        style={styles.deleteButton}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Krishi Connect</Text>
                    <Text style={styles.footerSubtext}>Connecting Farmers & Buyers</Text>
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
        width: 32,
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        padding: 0,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.text,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.border,
        marginLeft: 56,
    },
    logoutButton: {
        marginBottom: 12,
    },
    deleteButton: {
        backgroundColor: '#FF6B6B20',
        borderColor: '#FF6B6B',
    },
    footer: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 16,
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.primary,
    },
    footerSubtext: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginTop: 4,
    },
});
