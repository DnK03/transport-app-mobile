import api from './index';

export const login = async (username, password) => {
  try {
    const response = await api.post('/token/', { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare de autentificare' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/users/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la înregistrare' };
  }
};

export const refreshToken = async (refresh) => {
  try {
    const response = await api.post('/token/refresh/', { refresh });
    return {
      access: response.data.access,
      refresh,
    };
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la reîmprospătarea token-ului' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/me/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la obținerea profilului' };
  }
};

export const getDriverProfile = async () => {
  try {
    const response = await api.get('/drivers/me/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la obținerea profilului de șofer' };
  }
};