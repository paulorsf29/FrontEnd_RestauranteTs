import { createContext, useContext, useState } from "react";
import { login as apiLogin, register as apiRegister } from '../services/authService';
import { useMenu } from './MenuItemContext';
import { useNavigate } from 'react-router-dom';

type UserRole = 'ADMIN' | 'KITCHEN' | 'CUSTOMER';

type User = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
}

type AuthContextType = {
  user: User | null;
  login: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    role: UserRole;
    endereco?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  isLoading: false
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { clearMenuItems } = useMenu();
  const navigate = useNavigate();

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, senha);
      
      if (response?.token) {
        const userData = {
          id: response.user?.id || '',
          nome: response.user?.nome || '',
          email: response.user?.email || email,
          telefone: response.user?.telefone || '',
          role: (response.user?.role || 'CUSTOMER').toUpperCase() as UserRole
        };
        setUser(userData);
        localStorage.setItem('accessToken', response.token);
        navigate('/menu');
        return { success: true };
      }
      throw new Error('Resposta inválida do servidor');
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Erro ao fazer login. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    role: UserRole;
    endereco?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiRegister({
        ...userData,
        role: userData.role
      });
      
      if (response?.token) {
        const registeredUser = {
          id: response.user?.id || '',
          nome: response.user?.nome || userData.nome,
          email: response.user?.email || userData.email,
          telefone: response.user?.telefone || userData.telefone,
          role: (response.user?.role || userData.role) as UserRole
        };
        setUser(registeredUser);
        localStorage.setItem('accessToken', response.token);
        navigate('/menu');
        return { success: true };
      }
      throw new Error('Resposta inválida do servidor');
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Erro ao registrar. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    clearMenuItems();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}