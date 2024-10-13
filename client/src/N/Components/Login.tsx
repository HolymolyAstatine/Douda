// client/src/nice/Components/Login.tsx
import React from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #0095f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin: 10px 0;

  &:hover {
    background-color: #007bb5;
  }
`;

const GoogleButton = styled(Button)`
  background-color: #db4437;

  &:hover {
    background-color: #c13527;
  }
`;

const NaverButton = styled(Button)`
  background-color: #1ec800;

  &:hover {
    background-color: #17b300;
  }
`;

const KakaoButton = styled(Button)`
  background-color: #f7e03d;

  &:hover {
    background-color: #f5d600;
  }
`;

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // 구글 클라이언트 ID
    const redirectUri = 'YOUR_REDIRECT_URI'; // 리다이렉트 URI
    const scope = 'profile email';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.location.href = authUrl; // 구글 로그인 페이지로 리다이렉트
  };

  const handleNaverLogin = () => {
    const clientId = 'YOUR_NAVER_CLIENT_ID'; // 네이버 클라이언트 ID
    const redirectUri = 'YOUR_REDIRECT_URI'; // 리다이렉트 URI
    const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&state=STATE_STRING`;
    
    window.location.href = authUrl; // 네이버 로그인 페이지로 리다이렉트
  };

  const handleKakaoLogin = () => {
    const clientId = 'YOUR_KAKAO_CLIENT_ID'; // 카카오톡 클라이언트 ID
    const redirectUri = 'YOUR_REDIRECT_URI'; // 리다이렉트 URI
    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    
    window.location.href = authUrl; // 카카오톡 로그인 페이지로 리다이렉트
  };

  return (
    <LoginContainer>
      <h2>로그인</h2>
      <GoogleButton onClick={handleGoogleLogin}>구글로 로그인</GoogleButton>
      <NaverButton onClick={handleNaverLogin}>네이버로 로그인</NaverButton>
      <KakaoButton onClick={handleKakaoLogin}>카카오톡으로 로그인</KakaoButton>
    </LoginContainer>
  );
};

export default Login;