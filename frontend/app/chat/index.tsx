import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/colors';
import api from '@/services/api';
import { storage } from '@/utils/storage';
import { BackButton } from '@/components/ui/BackButton';

export default function ChatListScreen() {
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const userData = await storage.getUserData();
            if (userData && (userData as any)._id) {
                setUserId((userData as any)._id);
                const response = await api.get(`/chat/conversations/${(userData as any)._id}`);
                setConversations(response.data);
            }
        } catch (error) {
            console.log('Error fetching conversations', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.user._id, name: item.user.name } })}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{item.user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.userName}>{item.user.name}</Text>
                    <Text style={styles.timestamp}>
                        {new Date(item.timestamp).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
            <View style={styles.header}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.title}>Messages</Text>
            </View>

            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.user._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No conversations yet</Text>
                    </View>
                }
            />
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
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.text,
        marginLeft: 16,
    },
    listContent: {
        padding: 16,
    },
    conversationItem: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: AppColors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppColors.primary,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.text,
    },
    timestamp: {
        fontSize: 12,
        color: AppColors.textSecondary,
    },
    lastMessage: {
        fontSize: 14,
        color: AppColors.textSecondary,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: AppColors.textSecondary,
    },
});
