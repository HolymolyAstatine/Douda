// client/src/components/Login.tsx
// 로그인 컴포넌트
import React from 'react';
import { loginWithGoogle } from '../api/authService';

const Login: React.FC = () => {

  const handleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ color: '#333' }}>로그인</h1>
      <button 
        onClick={handleLogin} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4285F4', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer', 
          fontSize: '16px',
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ae8')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4285F4')}
      >
        Google로 로그인
      </button>
    </div>
  );
};

export default Login;
