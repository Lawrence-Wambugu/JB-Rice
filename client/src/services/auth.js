import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};

export default authService; 