import React, { useState } from 'react';
import styled from 'styled-components';
import SchoolSearch from './nice/Components/SchoolSearch';
import MealInfo from './nice/Components/MealInfo';
import TimeTable from './nice/Components/TimeTable';

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
  padding: 10px 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #262626;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const BottomNavigation = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  border-top: 1px solid #dbdbdb;
  padding: 10px 0;
  position: sticky;
  bottom: 0;
`;

const NavItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  color: ${props => props.active ? '#0095f6' : '#262626'};
  font-size: 24px;
`;

const App: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [activeMenu, setActiveMenu] = useState('search');

  const renderContent = () => {
    switch (activeMenu) {
      case 'search':
        return <SchoolSearch onSchoolSelect={setSelectedSchool} />;
      case 'meal':
        return selectedSchool ? <MealInfo schoolInfo={selectedSchool} /> : <p>학교를 먼저 선택해주세요.</p>;
      case 'timetable':
        return selectedSchool ? <TimeTable schoolInfo={selectedSchool} /> : <p>학교를 먼저 선택해주세요.</p>;
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
          📅
        </NavItem>
      </BottomNavigation>
    </AppContainer>
  );
};

export default App;