import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create API instance with auth token
const createAuthenticatedAPI = () => {
  const user = authService.getCurrentUser();
  const token = user ? user.token : null;
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
};

// Authentication API
export const authService = {
  // Sign up
  signup: (userData) => authAPI.post('/auth/signup', userData),
  
  // Sign in
  signin: (credentials) => authAPI.post('/auth/signin', {
    username_or_email: credentials.username,
    password: credentials.password
  }),
  
  // Forgot password
  forgotPassword: (email) => authAPI.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (resetData) => authAPI.post('/auth/reset-password', resetData),

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Set current user in localStorage
  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Remove current user from localStorage
  logout: () => {
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('user') !== null;
  }
};

export default authService; 