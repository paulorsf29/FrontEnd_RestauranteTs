import axios from "axios";

const API_URL = "http://localhost:8081/api/auth/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, senha: string) => {
  try {
    const response = await api.post('login', { email, senha });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 
                    error.response.data?.error || 
                    'Erro ao fazer login');
    }
    throw new Error('Erro de conexão com o servidor');
  }
};

export const register = async (userData: {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  role: string;
  endereco?: string;
}) => {
  try {
    const response = await api.post('register', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 
                    error.response.data?.error || 
                    'Erro ao registrar');
    }
    throw new Error('Erro de conexão com o servidor');
  }
};

export default api;