// components/src/ProfileEdit.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import errorIcon from "../img/error_exclamation_mark.svg"; // 오류 아이콘 추가
import "./css/Signup_set.css"; // 스타일 시트 추가
import { SchoolInfo } from '../../../server/types/types'; // 학교 정보 타입 추가

interface ProfileEditProps {
  profileData: any; // 실제 데이터 타입으로 대체 가능
  onClose: () => void; // 수정 완료 후 닫기 위한 함수
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profileData, onClose }) => {
  // 프로파일 수정에 필요한 상태 변수 초기화
  const [nickname, setNickname] = useState(profileData.nickname); // 닉네임 상태
  const [school, setSchool] = useState(''); // 학교 상태 초기화
  const [grade, setGrade] = useState(profileData.grade); // 학년 상태
  const [classroom, setClassroom] = useState(profileData.classroom); // 반 상태
  const [schoolList, setSchoolList] = useState<SchoolInfo[]>([]); // 학교 목록 상태
  const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null); // 선택한 학교 상태
  const [error, setError] = useState(''); // 오류 메시지 상태
  const navigate = useNavigate(); // 프로그래밍적으로 네비게이션하기 위한 훅

  // 학교 검색 핸들러
  const handleSchoolSearch = async (query: string) => {
    if (query) {
      try {
        const response = await axios.get(`https://douda.kro.kr:443/api/searchSchool?SchoolName=${query}`);
        setSchoolList(response.data.data); // 학교 목록 업데이트
      } catch (error) {
        console.error('학교 검색 중 오류 발생:', error);
      }
    } else {
      setSchoolList([]); // 쿼리가 비어있으면 목록 초기화
    }
  };

  const handleSchoolSelect = (school: SchoolInfo) => {
    setSelectedSchool(school);
    setSchool(school.SCHUL_NM);
    setSchoolList([]); // 선택 후 목록 초기화
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSchool(value);
    handleSchoolSearch(value); // 학교 검색 처리
  };

  // 프로파일 저장 핸들러
  const handleSave = async () => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    try {
      const response = await axios.put('https://douda.kro.kr:443/user_data/profile_update', {
        nickname,
        school: selectedSchool?.SCHUL_NM, // 선택한 학교 이름
        grade,
        classroom,
        SHcode: selectedSchool?.SD_SCHUL_CODE, // 선택한 학교 코드
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
          onChange={handleSchoolChange} // 학교 상태 업데이트
        />
        {schoolList.length > 0 && (
          <ul style={{ border: '1px solid #ccc', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto', padding: '0', margin: '5px 0', listStyleType: 'none' }}>
            {schoolList.map((school) => (
              <li key={school.SD_SCHUL_CODE} onClick={() => handleSchoolSelect(school)} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
                {school.SCHUL_NM}
              </li>
            ))}
          </ul>
        )}
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
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 오류 메시지 표시 */}
    </div>
  );
};

export default ProfileEdit;