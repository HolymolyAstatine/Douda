// client/src/nice/Components/Home.tsx
import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f0f0f0; /* 배경색 추가 */
`;

const HomeTitle = styled.h2`
  font-size: 32px;
  color: #262626;
  margin-bottom: 20px;
`;

const MenuButton = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  color: #ffffff;
  background-color: #0095f6;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #007bb5;
  }
`;

interface HomeProps {
  onNavigate: (menu: string) => void; // 메뉴 변경을 위한 props
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <HomeContainer>
      <HomeTitle>홈 화면</HomeTitle>
      <MenuButton onClick={() => onNavigate('search')}>학교 검색</MenuButton>
      <MenuButton onClick={() => onNavigate('meal')}>급식 정보</MenuButton>
      <MenuButton onClick={() => onNavigate('timetable')}>시간표</MenuButton>
      <MenuButton onClick={() => onNavigate('calendar')}>캘린더</MenuButton>
    </HomeContainer>
  );
};

export default Home;