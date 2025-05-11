import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Baza URL pentru API - folosește 10.0.2.2 pentru emulator Android (echivalent localhost)
const API_URL = 'http://10.0.2.2:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pentru a adăuga token-ul de autentificare la fiecare cerere
api.interceptors.request.use(
  async (config) => {
    const tokensString = await AsyncStorage.getItem('tokens');
    if (tokensString) {
      const tokens = JSON.parse(tokensString);
      if (tokens.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pentru a reîmprospăta token-ul când expiră
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Dacă eroarea este 401 (Unauthorized) și nu am încercat deja să reîmprospătăm token-ul
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokensString = await AsyncStorage.getItem('tokens');
        if (tokensString) {
          const tokens = JSON.parse(tokensString);
          
          // Încearcă să reîmprospătezi token-ul
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: tokens.refresh,
          });
          
          const { access } = response.data;
          
          // Salvează noul token
          await AsyncStorage.setItem('tokens', JSON.stringify({
            ...tokens,
            access,
          }));
          
          // Reîncearcă cererea originală cu noul token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Dacă reîmprospătarea token-ului eșuează, deconectează utilizatorul
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('tokens');
        // Aici ai putea adăuga o redirecționare către ecranul de login
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;