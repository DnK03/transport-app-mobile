import api from './index';

export const requestRide = async (rideData) => {
  try {
    const response = await api.post('/rides/', rideData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la solicitarea cursei' };
  }
};

export const getUserRides = async () => {
  try {
    const response = await api.get('/rides/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la obținerea curselor' };
  }
};

export const acceptRide = async (rideId) => {
  try {
    const response = await api.post(`/rides/${rideId}/accept_ride/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la acceptarea cursei' };
  }
};

export const startRide = async (rideId) => {
  try {
    const response = await api.post(`/rides/${rideId}/start_ride/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la începerea cursei' };
  }
};

export const completeRide = async (rideId) => {
  try {
    const response = await api.post(`/rides/${rideId}/complete_ride/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la finalizarea cursei' };
  }
};

export const cancelRide = async (rideId) => {
  try {
    const response = await api.post(`/rides/${rideId}/cancel_ride/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la anularea cursei' };
  }
};

export const getAvailableDrivers = async () => {
  try {
    const response = await api.get('/drivers/available/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Eroare la obținerea șoferilor disponibili' };
  }
};