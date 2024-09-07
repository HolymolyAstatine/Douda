import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SchoolSearch from './nice/Components/SchoolSearch';
import MealInfo from './nice/Components/MealInfo';
import TimeTable from './nice/Components/TimeTable';
import Calendar from './Calendar/Components/Calendar';

const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fafafa;
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

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BottomNavigation = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  border-top: 1px solid #dbdbdb;
  padding: 10px 0;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  color: ${props => props.active ? '#0095f6' : '#262626'};
  font-size: 24px;
  transition: color 0.3s;

  &:hover {
    color: #0095f6;
  }
`;

const App: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [activeMenu, setActiveMenu] = useState('search');

  useEffect(() => {
    document.title = "도우다 - Douda";
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case 'search':
        return <SchoolSearch onSchoolSelect={setSelectedSchool} />;
      case 'meal':
        return selectedSchool ? <MealInfo schoolInfo={selectedSchool} /> : <p>학교를 먼저 선택해주세요.</p>;
      case 'timetable':
        return selectedSchool ? <TimeTable schoolInfo={selectedSchool} /> : <p>학교를 먼저 선택해주세요.</p>;
      case 'calendar':
        return <Calendar />;
      default:
        return null;
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>도우다 - Douda</Title>
      </Header>
      <ContentContainer>
        {renderContent()}
      </ContentContainer>
      <BottomNavigation>
        <NavItem 
          active={activeMenu === 'search'} 
          onClick={() => setActiveMenu('search')}
        >
          🔍
        </NavItem>
        <NavItem 
          active={activeMenu === 'meal'} 
          onClick={() => setActiveMenu('meal')}
        >
          🍽️
        </NavItem>
        <NavItem 
          active={activeMenu === 'timetable'} 
          onClick={() => setActiveMenu('timetable')}
        >
          📖
        </NavItem>
        <NavItem 
          active={activeMenu === 'calendar'} 
          onClick={() => setActiveMenu('calendar')}
        >
          📆
        </NavItem>
      </BottomNavigation>
    </AppContainer>
  );
};

export default App;