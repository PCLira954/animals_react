// api.ts

import axios from 'axios'

// 1. O erro de login ocorre aqui se VITE_API_URL estiver ausente/incorreta
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333'
console.log('API Base URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE, // DEVE ser 'http://localhost:3333'
  headers: {
    'Content-Type': 'application/json',
  },
})

// Adiciona um interceptor de requisição para logar as requisições
api.interceptors.request.use(
  (config) => {
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Adiciona um interceptor de resposta para lidar com erros globais
api.interceptors.response.use(
  (response) => {
    console.log(`[${response.status}] ${response.config.url}`, response.data || '');
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error.response?.data || error.message);
    
    // Se o erro for 401 (Não autorizado), redireciona para a página de login
    if (error.response?.status === 401) {
      console.log('Não autorizado, redirecionando para login...');
      // Limpa o token de autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redireciona para a página de login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    console.log('Definindo token de autenticação');
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('Removendo token de autenticação');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;