// client/src/nice/Components/Profile.tsx
import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const UserName = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #262626;
`;

const UserBio = styled.p`
  color: #666666;
  text-align: center;
  margin: 10px 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #262626;
`;

const StatLabel = styled.p`
  margin: 0;
  color: #999999;
`;

const Profile: React.FC = () => {
  const user = {
    name: '사용자 이름',
    bio: '여기에 사용자 소개를 입력하세요.',
    posts: 10,
    followers: 100,
    following: 50,
    profileImage: 'https://via.placeholder.com/100', // 프로필 이미지 URL
  };

  return (
    <ProfileContainer>
      <ProfileImage src={user.profileImage} alt="Profile" />
      <UserName>{user.name}</UserName>
      <UserBio>{user.bio}</UserBio>
      <StatsContainer>
        <Stat>
          <StatValue>{user.posts}</StatValue>
          <StatLabel>게시글</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{user.followers}</StatValue>
          <StatLabel>팔로워</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{user.following}</StatValue>
          <StatLabel>팔로잉</StatLabel>
        </Stat>
      </StatsContainer>
    </ProfileContainer>
  );
};

export default Profile;