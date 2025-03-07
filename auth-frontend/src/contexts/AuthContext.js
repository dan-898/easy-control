import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';
import { axiosInstance } from '../utils/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;


          const userData = await authApi.getMe();
          setUser(userData);


          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Auth initialization error:', error);
          // If token is invalid, logout
          handleLogout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [token]);

  /**
    @param {Object} credentials
   */
  const login = async (credentials) => {
    const { access_token } = await authApi.login(credentials);


    setToken(access_token);
    localStorage.setItem('token', access_token);


    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;


    const userData = await authApi.getMe();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));


    navigate('/');
  };


  const handleLogout = () => {

    setUser(null);
    setToken(null);


    authApi.logout();


    delete axiosInstance.defaults.headers.common['Authorization'];


    navigate('/login');
  };

  /**
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  /**
   * @returns {Object}
   */
  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout: handleLogout,
    isAuthenticated,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};