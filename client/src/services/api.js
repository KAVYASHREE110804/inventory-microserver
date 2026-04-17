import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.errors?.[0]?.msg ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const addOrUpdateProduct = (data) => api.post('/product', data);
export const getProducts = () => api.get('/products');
export const updateStock = (data) => api.put('/stock', data);
export const getAlerts = () => api.get('/alerts');
