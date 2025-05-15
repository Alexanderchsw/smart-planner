import axios from 'axios';

// Создаем экземпляр axios
const api = axios.create({
  baseURL: 'http://localhost:8000', // можно поменять на нужный адрес, когда будет бэк
});

// Добавляем Interceptor для автоматической подстановки токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
