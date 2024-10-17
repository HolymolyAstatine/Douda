// client/src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#333' }}>도우다 - Douda</h1>
      {isLoggedIn ? ( // 로그인 상태일 때 게시판 링크 표시
        <div>
          <h2 style={{ color: '#007bff' }}>도우다를 사용해주셔서 감사합니다!</h2>
          <Link to="/board">
            <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
              게시판으로 이동
            </button>
          </Link>
        </div>
      ) : (
        <nav>
          <Link to="/login">
            <button style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>
              Log in
            </button>
          </Link>
          <Link to="/signup">
            <button style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
              Sign up
            </button>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Home;