import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from "react-native";

const TOKEN_KEY = 'auth_token';

const storage = {
    get: async () =>
        Platform.OS === "web" ? localStorage.getItem(TOKEN_KEY) : SecureStore.getItemAsync(TOKEN_KEY),
    set: async (v: string) =>
        Platform.OS === "web" ? localStorage.setItem(TOKEN_KEY, v) : SecureStore.setItemAsync(TOKEN_KEY, v),
    remove: async () =>
        Platform.OS === "web" ? localStorage.removeItem(TOKEN_KEY) : SecureStore.deleteItemAsync(TOKEN_KEY),
};

type AuthContextType = {
    token: string | null;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        storage.get()
            .then(setToken)
            .finally(() => setIsLoading(false));
    }, []);

    const signIn = async (t: string) => {
        await storage.set(t);
        setToken(t);
    }

    const signOut = async () => {
        await storage.remove();
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}