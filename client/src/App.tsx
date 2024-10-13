// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SchoolSearch from './nice/Components/SchoolSearch';
import MealInfo from './nice/Components/MealInfo';
import TimeTable from './nice/Components/TimeTable';
import Calendar from './Calendar/Components/Calendar';
import Home from './N/Components/Home'; // 홈 컴포넌트 추가
import Board from './N/Components/Board'; // 게시판 컴포넌트 추가
import Profile from './N/Components/Profile'; // 프로필 컴포넌트 추가
import Login from './N/Components/Login'; // 로그인 컴포넌트 추가

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #dbdbdb;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SidebarItem = styled.div`
  margin: 10px 0;
  cursor: pointer;
  font-weight: bold;
  color: #262626;

  &:hover {
    color: #0095f6;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #dbdbdb;
  padding: 15px 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #262626;
  font-weight: bold;
`;

const App: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [activeMenu, setActiveMenu] = useState('home'); // 기본 메뉴를 'home'으로 설정
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  useEffect(() => {
    document.title = "도우다 - Douda";
  }, []);

  const renderContent = () => {
    if (!isLoggedIn) {
      return <Login onLogin={() => setIsLoggedIn(true)} />;
    }

    switch (activeMenu) {
      case 'home':
        return <Home onNavigate={setActiveMenu} />; // 홈 컴포넌트 렌더링
      case 'search':
        return <SchoolSearch onSchoolSelect={setSelectedSchool} />;
      case 'meal':
        return selectedSchool ? <MealInfo schoolInfo={selectedSchool} /> : <p>학교를 먼저 선택해주세요.</p>;
      case 'timetable':
        return selectedSchool ? <TimeTable schoolInfo={selectedSchool} /> : <p>학교를 먼저 선택해주세요.</p>;
      case 'calendar':
        return <Calendar />;
      case 'board':
        return <Board />; // 게시판 컴포넌트 렌더링
      case 'profile':
        return <Profile />; // 프로필 컴포넌트 렌더링
      default:
        return null;
    }
  };

  return (
    <Container>
      <Sidebar>
        <SidebarItem onClick={() => setActiveMenu('home')}>홈</SidebarItem>
        <SidebarItem onClick={() => setActiveMenu('search')}>학교 검색</SidebarItem>
        <SidebarItem onClick={() => setActiveMenu('meal')}>급식 정보</SidebarItem>
        <SidebarItem onClick={() => setActiveMenu('timetable')}>시간표</SidebarItem>
        <SidebarItem onClick={() => setActiveMenu('calendar')}>캘린더</SidebarItem>
        <SidebarItem onClick={() => setActiveMenu('board')}>게시판</SidebarItem>
        <SidebarItem onClick={() => setActiveMenu('profile')}>프로필</SidebarItem> {/* 프로필 메뉴 추가 */}
      </Sidebar>
      <MainContent>
        <Header>
          <Title>도우다 - Douda</Title>
        </Header>
        {renderContent()}
      </MainContent>
    </Container>
  );
};

export default App;