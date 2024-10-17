import axios from 'axios';

// Base URL of the backend server
const API_BASE_URL = 'https://douda.kro.kr:443';

export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/login-server`;
}; //로그인

export const signupWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/signup-server`;
}; //회원가입

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
}; //프로파일 로딩
