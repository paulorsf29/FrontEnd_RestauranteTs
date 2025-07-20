import axios from "axios";

const API_URL = "http://192.168.1.4:8081/api/auth/";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 5000 // 5 segundos de timeout
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Tratamento específico para erros 401 (não autorizado)
            if (error.response.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
            
            const errorMessage = error.response.data?.message || 
                              error.response.data?.error ||
                              error.response.statusText || 
                              'Erro na requisição';
            return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            return Promise.reject(new Error('Sem resposta do servidor. Verifique sua conexão.'));
        } else {
            // Algo aconteceu na configuração da requisição
            return Promise.reject(new Error('Erro ao configurar a requisição.'));
        }
    }
);

export const login = (email: string, senha: string) => {
    return api.post('login', { email, senha });
};

export const register = (userData: {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    role: 'ADMIN' | 'KITCHEN' | 'CUSTOMER';
    endereco?: string;
}) => {
    return api.post('register', {
        ...userData,
        ativo: true
    });
};

export default api;