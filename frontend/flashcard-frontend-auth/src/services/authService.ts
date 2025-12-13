import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const register = async (email: string, password: string, displayName?: string) => {
    const response = await axios.post(`${API_URL}/signup`, { email, password, displayName: displayName || email });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
};

const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const onAuthStateChanged = (callback: (user: any) => void): (() => void) => {
    const user = getCurrentUser();
    callback(user);
    
    // Return unsubscribe function
    return () => {
        // Cleanup if needed
    };
};

export const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    onAuthStateChanged,
};