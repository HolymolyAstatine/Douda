'use client';

import { useEffect } from 'react';
import { loginWithGoogle } from '@/api/authService';

export default function Login() {
  useEffect(() => {
    document.title = "Douda - 로그인";
  }, []);
  
  const handleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 rounded-lg shadow-sm p-8 m-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">로그인</h1>
      <button 
        onClick={handleLogin} 
        className="px-6 py-3 bg-[#4285F4] text-white rounded-md hover:bg-[#357ae8] transition-colors shadow-sm"
      >
        Google로 로그인
      </button>
    </div>
  );
}
