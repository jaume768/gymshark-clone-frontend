import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'clone-gymhark-api-production.up.railway.app',
  });

// Interceptar solicitudes para añadir el token si existe
api.interceptors.request.use(config => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
