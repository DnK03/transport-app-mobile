import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Aici ar trebui să faci un apel API pentru autentificare
      // Pentru test, vom simula un răspuns de succes
      const userData = {
        id: 1,
        email: email,
        name: 'Utilizator Test',
        userType: 'client' // sau 'driver'
      };
      
      setUserInfo(userData);
      setUserToken('sample-token');
      
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      await AsyncStorage.setItem('userToken', 'sample-token');
      
    } catch (error) {
      console.log('Login error: ', error);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.log('Logout error: ', error);
    }
    setIsLoading(false);
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Aici ar trebui să faci un apel API pentru înregistrare
      // Pentru test, vom simula un răspuns de succes
      return true;
    } catch (error) {
      console.log('Register error: ', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userToken = await AsyncStorage.getItem('userToken');
      
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
        setUserToken(userToken);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.log('isLoggedIn error: ', error);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoading, 
        userToken, 
        userInfo, 
        login, 
        logout, 
        register 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};