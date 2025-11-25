import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';
import { AppColors } from '@/constants/colors';
import api from '@/services/api';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        checkOwnershipAndFetch();
    }, [userId]);

    const checkOwnershipAndFetch = async () => {
        try {
            const currentUser = await storage.getUserData();
            const currentUserId = (currentUser as any)?._id;

            // If no userId param, or it matches current user, it's own profile
            const targetId = userId || currentUserId;
            const isOwn = !userId || userId === currentUserId;

            setIsOwnProfile(isOwn);
            fetchProfile(targetId);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProfile = async (id: string) => {
        try {
            const response = await api.get(`/users/${id}`);
            const data = response.data;
            setProfile(data);

            // Initialize edit state
            setName(data.name);
            setPhone(data.phone);
            setAddress(data.address || '');
            setBio(data.bio || '');
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch profile');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!profile) return;
        setLoading(true);
        try {
            const response = await api.put(`/users/${profile._id}`, {
                name,
                phone,
                address,
                bio
            });
            setProfile(response.data);
            setIsEditing(false);

            // Update local storage if it's own profile
            if (isOwnProfile) {
                await storage.setUserData(response.data);
            }

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <BackButton onPress={() => router.back()} />

                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {profile?.name?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    {!isEditing && (
                        <>
                            <Text style={styles.name}>{profile?.name}</Text>
                            <Text style={styles.role}>{profile?.role?.toUpperCase()}</Text>
                        </>
                    )}
                </View>

                {isEditing ? (
                    <View style={styles.form}>
                        <Input label="Name" value={name} onChangeText={setName} />
                        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                        <Input label="Address" value={address} onChangeText={setAddress} placeholder="City, State" />
                        <Input
                            label="Bio"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={3}
                            placeholder="Tell us about yourself..."
                        />
                        <View style={styles.editActions}>
                            <Button
                                title="Cancel"
                                onPress={() => setIsEditing(false)}
                                variant="outline"
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Save"
                                onPress={handleUpdate}
                                variant="primary"
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.infoContainer}>
                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={20} color={AppColors.textSecondary} />
                            <Text style={styles.infoText}>{profile?.email}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="call-outline" size={20} color={AppColors.textSecondary} />
                            <Text style={styles.infoText}>{profile?.phone}</Text>
                        </View>
                        {profile?.address && (
                            <View style={styles.infoItem}>
                                <Ionicons name="location-outline" size={20} color={AppColors.textSecondary} />
                                <Text style={styles.infoText}>{profile.address}</Text>
                            </View>
                        )}
                        {profile?.bio && (
                            <View style={styles.bioContainer}>
                                <Text style={styles.bioLabel}>About</Text>
                                <Text style={styles.bioText}>{profile.bio}</Text>
                            </View>
                        )}

                        {isOwnProfile && (
                            <Button
                                title="Edit Profile"
                                onPress={() => setIsEditing(true)}
                                variant="outline"
                                style={styles.editButton}
                            />
                        )}
                    </View>
                )}
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
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: AppColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    role: {
        fontSize: 14,
        color: AppColors.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    infoContainer: {
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    infoText: {
        fontSize: 16,
        color: AppColors.text,
    },
    bioContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    bioLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textSecondary,
        marginBottom: 8,
    },
    bioText: {
        fontSize: 16,
        color: AppColors.text,
        lineHeight: 24,
    },
    form: {
        gap: 16,
    },
    editActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 16,
    },
    editButton: {
        marginTop: 24,
    },
});
