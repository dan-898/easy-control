import { axiosInstance } from '../utils/axios';

/**
 * @param {Object} credentials
 * @param {string} credentials.username
 * @param {string} credentials.password
 * @returns {Promise<Object>}
 */
export const login = async (credentials) => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await axiosInstance.post('/api/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });


  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

/**
 * @returns {Promise<Object>}
 */
export const getMe = async () => {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data;
};


export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * @returns {Object}
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};