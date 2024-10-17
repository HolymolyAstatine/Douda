// components/src/ProfileEdit.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ProfileEditProps {
  profileData: any; // 실제 데이터 타입으로 대체 가능
  onClose: () => void; // 수정 완료 후 닫기 위한 함수
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profileData, onClose }) => {
  // 프로파일 수정에 필요한 상태 변수 초기화
  const [nickname, setNickname] = useState(profileData.nickname); // 닉네임 상태
  const [school, setSchool] = useState(profileData.school); // 학교 상태
  const [grade, setGrade] = useState(profileData.grade); // 학년 상태
  const [classroom, setClassroom] = useState(profileData.classroom); // 반 상태
  const navigate = useNavigate(); // 프로그래밍적으로 네비게이션하기 위한 훅

  // 프로파일 저장 핸들러
  const handleSave = async () => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    try {
      const response = await axios.put('https://localhost:443/user_data/profile_update', {
        nickname,
        school,
        grade,
        classroom,
      }, {
        headers: { Authorization: `Bearer ${token}` }, // Authorization 헤더 설정
      });
      alert('프로파일이 성공적으로 업데이트되었습니다.'); // 성공 시 알림
      onClose(); // 수정 완료 후 닫기
    } catch (error) {
      // 오류 처리
      if (axios.isAxiosError(error) && error.response) {
        const { code, message } = error.response.data; // 응답 데이터에서 코드와 메시지 추출
        if (code === 400 && message === "Nickname already taken.") {
          alert("이미 사용 중인 닉네임입니다."); // 닉네임 중복 오류 처리
        } else {
          alert('프로파일 업데이트에 실패했습니다.'); // 기타 오류 처리
        }
      } else {
        console.error('프로파일 업데이트 중 오류:', error); // 콘솔에 오류 기록
        alert('프로파일 업데이트에 실패했습니다.'); // 오류 발생 시 알림
      }
    }
  };

  return (
    <div>
      <h2>프로파일 수정</h2>
      <label>
        닉네임:
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)} // 닉네임 상태 업데이트
        />
      </label>
      <br />
      <label>
        학교:
        <input
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)} // 학교 상태 업데이트
        />
      </label>
      <br />
      <label>
        학년:
        <input
          type="number"
          value={grade}
          onChange={(e) => setGrade(parseInt(e.target.value))} // 학년 상태 업데이트
        />
      </label>
      <br />
      <label>
        반:
        <input
          type="text"
          value={classroom}
          onChange={(e) => setClassroom(e.target.value)} // 반 상태 업데이트
        />
      </label>
      <br />
      <button onClick={handleSave}>저장</button> {/* 저장 버튼 */}
      <button onClick={onClose}>취소</button> {/* 취소 버튼 */}
    </div>
  );
};

export default ProfileEdit;
