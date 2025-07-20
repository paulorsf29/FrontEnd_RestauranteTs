import { createContext, useContext, useState } from "react";
import { login as apiLogin, register as apiRegister } from '../services/authService';

type UserRole = 'ADMIN' | 'KITCHEN' | 'CUSTOMER';

type User = {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    role: 'ADMIN' | 'KITCHEN' | 'CUSTOMER';
}

type AuthContextType = {
    user: User | null;
    login: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>;
    registro: (userData: {
        nome: string;
        email: string;
        senha: string;
        telefone: string;
        role: UserRole;
    }) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isLoading: boolean;
}
export function useAuth() {
    return useContext(AuthContext);
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => ({ success: false }),
    registro: async () => ({ success: false }),
    logout: () => {},
    isLoading: false
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, senha: string) => {
        setIsLoading(true);
        try {
            const response = await apiLogin(email, senha);
            
            if (response.data && response.data.user && response.data.token) {
                setUser(response.data.user);
                localStorage.setItem('accessToken', response.data.token);
                return { success: true };
            } else {
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error: any) {
            console.error('Erro no login:', error);
            const message = error.response?.data?.message || 
                          error.message || 
                          'Erro ao fazer login. Tente novamente.';
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };

    const registro = async (userData: {
        nome: string;
        email: string;
        senha: string;
        telefone: string;
        role: UserRole;
    }) => {
        setIsLoading(true);
        try {
            const response = await apiRegister({
                ...userData,
            });
            
            if (response.data && response.data.user && response.data.token) {
                setUser(response.data.user);
                localStorage.setItem('accessToken', response.data.token);
                return { success: true };
            } else {
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error: any) {
            console.error('Erro no registro:', error);
            const message = error.response?.data?.message || 
                          error.message || 
                          'Erro ao registrar. Tente novamente.';
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, registro, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}