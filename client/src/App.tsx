//App.tsx
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'; // Navigate 추가
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import SignupSet from './components/Signup_set';
import Profile from './components/Profile';
import PostForm from "./components/Write_from";
import Testpost from "./components/testpost";
import Notfound from "./components/NotFound";
import Testpost2 from "./components/testpost2";
import Board from './components/Board';
import PostDetail from './components/PostDetail';
import MealSchedule from './components/MealSchedule'; // 급식 스케줄러 컴포넌트 추가
import { Link } from 'react-router-dom'; // Link 추가

interface GoogleAuthRedirectProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

// QueryClient 생성
const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 로컬스토리지에서 토큰 확인하여 로그인 상태 업데이트
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
      enabled: false, // 쿼리 자동 실행 비활성화
      retry: 1,
      onSuccess: () => {
        setIsLoggedIn(true); // 토큰이 유효하면 로그인 상태 true로 설정
      },
      onError: () => {
        localStorage.removeItem('token'); // 유효하지 않은 토큰은 제거
        setIsLoggedIn(false); // 로그인 상태 false로 설정
        navigate('/');
      },
    }
  );

  return (
    <div style={{ display: 'flex' }}>
      {/* 네비게이션 바 */}
      <nav style={{ width: '200px', padding: '20px', backgroundColor: '#f9f9f9', borderRight: '1px solid #ddd' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>DOUDA</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>홈</Link>
          </li>
          {isLoggedIn && (
            <>
              <li style={{ margin: '10px 0' }}>
                <Link to="/profile" style={{ textDecoration: 'none', color: '#007bff' }}>프로필</Link>
              </li>
              <li style={{ margin: '10px 0' }}>
                <Link to="/board" style={{ textDecoration: 'none', color: '#007bff' }}>게시판</Link>
              </li>
              <li style={{ margin: '10px 0' }}>
                <Link to="/meals" style={{ textDecoration: 'none', color: '#007bff' }}>급식표</Link> {/* 급식표 링크 추가 */}
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* 메인 콘텐츠 */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} /> {/*홈 로그인되어 있으면 로그인 페이지 아니면 따로 처리 */}
          <Route path="/login" element={<Login />} /> {/* 로그인 라우터*/}
          <Route path="/signup" element={<Signup />} /> {/* 회원가입 라우터 */}
          <Route path="/signsettig" element={<SignupSet />} /> {/* 회원가입 추가정보 라우터 */}
          <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} /> {/*프로파일 라우터 */}
          <Route path='/ww' element={<PostForm />} /> {/*게시글 작성 폼 */}
          <Route path='/wk' element={<Testpost />} />
          <Route path='/wi' element={<Testpost2 />} />
          <Route path='/board' element={<Board />} /> {/* 게시판 */}
          <Route path="/post/:id" element={<PostDetail />} /> {/* 게시글 상세 */}
          <Route path='/post/*' element={<Navigate to="/board" />} />
          <Route path="/meals" element={<MealSchedule />} /> {/* 급식표 라우터 추가 */}
          <Route path="/auth/google/signup/redirect" element={<GoogleAuthRedirect setIsLoggedIn={setIsLoggedIn} />} /> {/*구글 로그인 리다이엑션 처리 라우터 */}
          <Route path="/auth/google/login/redirect" element={<GoogleAuthRedirect setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/*' element={<Notfound />} /> {/** 404 not found처리 라우터 */}
        </Routes>
      </div>
    </div>
  );
};

// 구글 로그인/회원가입 리다이엑션 처리 컴포넌트 <그냥 쓸것>
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
        ? `https://localhost:8080/auth/google/signup/redirect?code=${code}`
        : `https://localhost:8080/auth/google/login/redirect?code=${code}`;
      return axios.get(url);
    },
    {
      enabled: !!code, // code가 있을 때만 쿼리 실행
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
      retry: 0,
      onSuccess: (response) => {
        if (isSignup) {
          const { id, email } = response.data; // 서버로부터 받은 id와 email
          console.log(id, email);
          navigate('/signsettig', { state: { id, email } }); // id와 email을 SignupSet으로 전달
        } else {
          const token = response.data.token;
          if (token) {
            localStorage.setItem('token', token);
            setIsLoggedIn(true); // 로그인 상태 업데이트
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
          alert(message); // 30일 동안 가입 불가 메시지
          navigate('/'); // 에러가 발생하면 /로 네비게이트
        } else if (status === 409) {
          alert(message); // 이미 존재하는 유저 메시지
          navigate('/'); // 에러가 발생하면 /로 네비게이트
        } else if (status === 404) {
          alert(message); // 유저를 찾을 수 없음 메시지
          navigate('/'); // 에러가 발생하면 /로 네비게이트
        } else {
          alert('An unexpected error occurred.');
          navigate('/'); // 에러가 발생하면 /로 네비게이트
        }

        console.error('Error during authentication:', error);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return null; // 이 컴포넌트는 실제 UI를 렌더링하지 않음
};

// QueryClientProvider로 애플리케이션 감싸기
const Root = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default Root;