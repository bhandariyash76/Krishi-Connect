import axios from 'axios';
import { Platform } from 'react-native';

// Replace with your machine's IP address if testing on a physical device
// Example: '192.168.1.5'
const LAN_IP = '192.168.1.5'; // <--- CHANGE THIS TO YOUR COMPUTER'S IP

const API_URL = Platform.OS === 'android'
    ? `http://${LAN_IP}:5000/api` // Use LAN IP for physical device/emulator
    : 'http://localhost:5000/api'; // Use localhost for web/simulator

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
