// client/src/components/Signup.tsx
import React from 'react';
import { signupWithGoogle } from '../api/authService';

const Signup: React.FC = () => {
  const handleSignup = () => {
    signupWithGoogle();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ color: '#333' }}>회원가입</h1>
      <button 
        onClick={handleSignup} 
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
        Google로 회원가입
      </button>
    </div>
  );
};

export default Signup;