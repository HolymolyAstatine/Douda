// src/api/authService.ts
import axios from 'axios';

// Base URL of the backend server
const API_BASE_URL = 'https://douda.kro.kr';

export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/login-server`;
};

export const signupWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/signup-server`;
};

export const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_BASE_URL}/profile-server`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
