import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constants/colors';
import api from '@/services/api';
import { storage } from '@/utils/storage';
import { BackButton } from '@/components/ui/BackButton';
import { useChat } from '@/contexts/ChatContext';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams(); // Receiver ID and Name
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const { socket } = useChat();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const init = async () => {
            const userData = await storage.getUserData();
            if (userData && (userData as any)._id) {
                setUserId((userData as any)._id);
                fetchMessages((userData as any)._id);
            }
        };
        init();
    }, [id]);

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (data) => {
                if (data.sender === id || data.receiver === id) {
                    setMessages((prev) => [...prev, data]);
                    scrollToBottom();
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('receive_message');
            }
        };
    }, [socket, id]);

    const fetchMessages = async (currentUserId: string) => {
        try {
            const response = await api.get(`/chat/history/${currentUserId}/${id}`);
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.log('Error fetching messages', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !userId) return;

        const messageData = {
            sender: userId,
            receiver: id,
            message: newMessage,
            timestamp: new Date().toISOString(),
        };

        try {
            // Optimistic update
            setMessages((prev) => [...prev, messageData]);
            setNewMessage('');
            scrollToBottom();

            // Send to backend (which saves to DB)
            await api.post('/chat', messageData);

            // Emit via socket
            if (socket) {
                socket.emit('send_message', messageData);
            }
        } catch (error) {
            console.log('Error sending message', error);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderItem = ({ item }: { item: any }) => {
        const isMyMessage = item.sender === userId;
        return (
            <View style={[
                styles.messageBubble,
                isMyMessage ? styles.myMessage : styles.theirMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    isMyMessage ? styles.myMessageText : styles.theirMessageText
                ]}>{item.message}</Text>
                <Text style={[
                    styles.timeText,
                    isMyMessage ? styles.myTimeText : styles.theirTimeText
                ]}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
            <View style={styles.header}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.title}>{name || 'Chat'}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={scrollToBottom}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColors.text,
        marginLeft: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: AppColors.primary,
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    messageText: {
        fontSize: 16,
    },
    myMessageText: {
        color: 'white',
    },
    theirMessageText: {
        color: AppColors.text,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    theirTimeText: {
        color: AppColors.textSecondary,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: AppColors.border,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: AppColors.background,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        marginRight: 12,
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: AppColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
