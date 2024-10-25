import React, { useState, Dispatch, SetStateAction } from 'react';
import { Route, Routes, useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import SignupSet from './components/Signup_set';
import Profile from './components/Profile';
import Notfound from "./components/NotFound";
import Board from './components/Board';
import PostDetail from './components/PostDetail';
import PostCreate from './components/PostCreate';
import MealSchedule from './components/MealSchedule';
import EditPost from './components/EditPost';
import Timetable from './components/Timetable';
import UnderConstruction from './components/UnderConstruction';
import Banner from './components/Banner'; // 배너 컴포넌트 추가

interface GoogleAuthRedirectProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false); // 네비게이션 바 상태 추가
  const navigate = useNavigate();

  const { refetch } = useQuery(
    'checkToken',
    () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return Promise.reject('n');
      }
      return axios.get('https://localhost:8080/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      enabled: false,
      retry: 1,
      onSuccess: () => {
        setIsLoggedIn(true);
      },
      onError: () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
      },
    }
  );

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // 네비게이션 바 열기/닫기
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 네비게이션 바 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img src={process.env.PUBLIC_URL + '/logo512.png'} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
          </Link>
          <h2 style={{ color: '#333' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>DOUDA</Link>
          </h2>
        </div>
        {/* 모바일에서 보이는 햄버거 메뉴 버튼 */}
        <button onClick={toggleNav} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block' }}>
          <div style={{ width: '30px', height: '3px', backgroundColor: '#007bff', margin: '5px 0' }}></div>
          <div style={{ width: '30px', height: '3px', backgroundColor: '#007bff', margin: '5px 0' }}></div>
          <div style={{ width: '30px', height: '3px', backgroundColor: '#007bff', margin: '5px 0' }}></div>
        </button>
      </nav>

      {/* 네비게이션 링크 */}
      <ul style={{
        listStyleType: 'none',
        display: isNavOpen ? 'block' : 'none', // 네비게이션 바 열기/닫기
        padding: 0,
        margin: 0,
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #ddd',
      }}>
        <li style={{ margin: '10px 0' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>홈</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/board" style={{ textDecoration: 'none', color: '#007bff' }}>게시판</Link>
        </li>
        {isLoggedIn && (
          <>
            <li style={{ margin: '10px 0' }}>
              <Link to="/profile" style={{ textDecoration: 'none', color: '#007bff' }}>프로필</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/meals" style={{ textDecoration: 'none', color: '#007bff' }}>급식표</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/timetable" style={{ textDecoration: 'none', color: '#007bff' }}>학급 시간표</Link>
            </li>
          </>
        )}
      </ul>

      {/* 메인 콘텐츠 */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-set" element={<SignupSet />} />
          <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/edit/:postId' element={<EditPost postId={0} />} />
          <Route path='/board' element={<Board isLoggedIn={isLoggedIn} />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<PostCreate />} />
          <Route path='/post/*' element={<Navigate to="/board" />} />
          <Route path="/meals" element={<MealSchedule />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/auth/google/signup/redirect" element={<GoogleAuthRedirect setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/auth/google/login/redirect" element={<GoogleAuthRedirect setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/*' element={<Notfound />} />
        </Routes>
      </div>

      {/* 배너 추가 - 푸터 위에 위치 */}
      <Banner />

      {/* 푸터 추가 */}
      <footer style={{ padding: '10px', backgroundColor: '#f1f1f1', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>© 2023 DOUDA team. All rights reserved.</p>
        <p style={{ margin: 0 }}>
          Created by 
          <a href="https://github.com/hafskjfha" target="_blank" rel="noopener noreferrer" style={{ margin: '0 5px', textDecoration: 'none', color: '#007bff' }}>Teawon Jung</a> 
          & 
          <a href="https://github.com/HolymolyAstatine" target="_blank" rel="noopener noreferrer" style={{ margin: '0 5px', textDecoration: 'none', color: '#007bff' }}>Jangho Yoon</a>
        </p>
        <p style={{ margin: 0 }}>
          <a href='https://github.com/HolymolyAstatine/Douda' target="_blank" rel="noopener noreferrer" style={{ margin: '0 5px', textDecoration: 'none', color: '#007bff' }}>GitHub</a>
        </p>
      </footer>
    </div>
  );
};

// 구글 로그인/회원가입 리다이엑션 처리 컴포넌트
const GoogleAuthRedirect: React.FC<GoogleAuthRedirectProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const code = new URLSearchParams(window.location.search).get('code');
  const path = window.location.pathname;

  const isSignup = path.includes('signup');
  const queryKey = isSignup ? 'signup' : 'login';

  const { data, error, isLoading } = useQuery(
    [queryKey, code],
    () => {
      const url = isSignup
        ? `https://localhost:8080/auth/google/signup/redirect-server?code=${code}`
        : `https://localhost:8080/auth/google/login/redirect-server?code=${code}`;
      return axios.get(url);
    },
    {
      enabled: !!code,
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (response) => {
        if (isSignup) {
          const { id, email } = response.data;
          navigate('/signsettig', { state: { id, email } });
        } else {
          const token = response.data.token;
          if (token) {
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            navigate('/profile');
          } else {
            alert('Authentication failed');
          }
        }
      },
      onError: (error: any) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Authentication failed';

        if (status === 400) {
          alert(message);
          navigate('/');
        } else if (status === 409) {
          alert(message);
          navigate('/');
        } else if (status === 404) {
          alert(message);
          navigate('/');
        } else {
          alert('An unexpected error occurred.');
          navigate('/');
        }

        console.error('Error during authentication:', error);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return null;
};

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default Root;