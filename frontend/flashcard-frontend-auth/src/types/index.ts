export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface RegisterForm {
    username: string;
    email: string;
    password: string;
}