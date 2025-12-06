import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
    user: any | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, displayName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user: any) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const user = await authService.login(email, password);
        setUser(user);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const register = async (email: string, password: string, displayName?: string) => {
        const user = await authService.register(email, password, displayName);
        setUser(user);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};