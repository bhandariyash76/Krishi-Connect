import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { storage } from '@/utils/storage';
import api from '@/services/api';

interface ChatContextType {
    socket: Socket | null;
    connectSocket: () => Promise<void>;
    disconnectSocket: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const connectSocket = async () => {
        const userData = await storage.getUserData();
        if (userData && (userData as any)._id) {
            // Get base URL from API config or hardcode for now if needed
            // Assuming api.defaults.baseURL is set correctly
            const baseURL = api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5000';

            const newSocket = io(baseURL);

            newSocket.on('connect', () => {
                console.log('Socket connected');
                newSocket.emit('join_room', (userData as any)._id);
            });

            setSocket(newSocket);
        }
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    useEffect(() => {
        connectSocket();
        return () => {
            disconnectSocket();
        };
    }, []);

    return (
        <ChatContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
