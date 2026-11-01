import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 8080;

function getApiUrl(): string {
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

    const host = Constants.expoConfig?.hostUri?.split(':')[0];
    if (host) return `http://${host}:${API_PORT}`;

    return Platform.OS === 'android' ?
        `http://10.0.2.2:${API_PORT}` :
        `http://localhost:${API_PORT}`;
}

export const API_URL = getApiUrl();