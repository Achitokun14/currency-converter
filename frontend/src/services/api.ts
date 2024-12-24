import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
};

export const conversionApi = {
  getSupportedCurrencies: () => api.get('/conversions/currencies'),
  convert: (amount: number, fromCurrency: string, toCurrency: string) =>
    api.post('/conversions/convert', { amount, fromCurrency, toCurrency }),
  getHistory: () => api.get('/conversions/history'),
  getPopular: () => api.get('/conversions/popular'),
};