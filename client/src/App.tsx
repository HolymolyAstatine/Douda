// App.tsx
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Route, Routes, useNavigate, Navigate, Link } from 'react-router-dom'; // Link 추가
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import SignupSet from './components/Signup_set';
import Profile from './components/Profile';
import PostForm from "./components/Write_from";
import Notfound from "./components/NotFound";
import Board from './components/Board';
import PostDetail from './components/PostDetail';
import MealSchedule from './components/MealSchedule'; // 급식 스케줄러 컴포넌트 추가
import PostEdit from './components/PostEdit';
import Timetable from './components/Timetable'; // 학급 시간표 컴포넌트 추가
import UnderConstruction from './components/UnderConstruction';

// GoogleAuthRedirectProps 인터페이스 정의
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 네비게이션 바 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/"> {/* 홈으로 가는 링크 추가 */}
            <img src={process.env.PUBLIC_URL + '/logo512.png'} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} /> {/* 로고 추가 */}
          </Link>
          <h2 style={{ color: '#333' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>DOUDA</Link> {/* DOUDA 텍스트를 홈으로 가는 링크로 변경 */}
          </h2>
        </div>
        <ul style={{ listStyleType: 'none', display: 'flex', padding: 0, margin: 0 }}>
          <li style={{ margin: '0 10px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>홈</Link>
          </li>
          <li style={{ margin: '0 10px' }}>
                <Link to="/board" style={{ textDecoration: 'none', color: '#007bff' }}>게시판</Link>
          </li>
          {isLoggedIn && (
            <>
              <li style={{ margin: '0 10px' }}>
                <Link to="/profile" style={{ textDecoration: 'none', color: '#007bff' }}>프로필</Link>
              </li>
              <li style={{ margin: '0 10px' }}>
                <Link to="/meals" style={{ textDecoration: 'none', color: '#007bff' }}>급식표</Link> {/* 급식표 링크 추가 */}
              </li>
              <li style={{ margin: '0 10px' }}>
                <Link to="/timetable" style={{ textDecoration: 'none', color: '#007bff' }}>학급 시간표</Link> {/* 학급 시간표 링크 추가 */}
              </li>
            </>
          )}
        </ul>
      </nav>
      {/* ... existing code ... */}

      {/* 메인 콘텐츠 */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} /> {/*홈 로그인되어 있으면 로그인 페이지 아니면 따로 처리 */}
          <Route path="/login" element={<Login />} /> {/* 로그인 라우터*/}
          <Route path="/signup" element={<Signup />} /> {/* 회원가입 라우터 */}
          <Route path="/signsettig" element={<SignupSet />} /> {/* 회원가입 추가정보 라우터 */}
          <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} /> {/*프로파일 라우터 */}
          {/*<Route path='/ww' element={<PostForm />} /> {/*게시글 작성 폼 */}
          {/*<Route path='/edit/:postId' element={<PostEdit />} /> {/* 게시글 수정 폼 */}
          <Route path='/board' element={<UnderConstruction />} /> {/* 게시판 */}
          {/*<Route path="/post/:id" element={<PostDetail isLoggedIn={isLoggedIn}/>} /> {/* 게시글 상세 */}
          {/*<Route path='/post/*' element={<Navigate to="/board" />} />*/}
          <Route path="/meals" element={<MealSchedule/>} /> {/* 급식표 라우터 추가 */}
          <Route path="/timetable" element={<Timetable />} /> {/* 학급 시간표 라우터 추가 */}
          <Route path="/auth/google/signup/redirect" element={<GoogleAuthRedirect setIsLoggedIn={setIsLoggedIn} />} /> {/*구글 로그인 리다이엑션 처리 라우터 */}
          <Route path="/auth/google/login/redirect" element={<GoogleAuthRedirect setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/*' element={<Notfound />} /> {/** 404 not found처리 라우터 */}
        </Routes>
      </div>
      {/* ... existing code ... */}

      {/* 푸터 추가 */}
      <footer style={{ padding: '10px', backgroundColor: '#f1f1f1', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>© 2024 DOUDA team. All rights reserved.</p>
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
        ? `https://localhost:8080/auth/google/signup/redirect-server?code=${code}`
        : `https://localhost:8080/auth/google/login/redirect-server?code=${code}`;
      return axios.get(url);
    },
    {
      enabled: !!code, // code가 있을 때만 쿼리 실행
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
      retry: 0,
      onSuccess: (response) => {
        if (isSignup) {
          const { id, email } = response.data; // 서버로부터 받은 id와 email
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