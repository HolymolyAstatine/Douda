import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SchoolSearchModal from './SchoolSearchModal';
import errorIcon from "../img/error_exclamation_mark.svg"; 
import "./css/Signup_set.css"; 
import { SchoolInfo } from '../../../server/types/types';

interface ProfileEditProps {
  profileData: {
    nickname: string;
    grade: number;
    classroom: string;
    school?: string;
    shcode?: string;
  };
  onClose: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profileData, onClose }) => {
  const [nickname, setNickname] = useState(profileData.nickname);
  const [school, setSchool] = useState(profileData.school || '');
  const [grade, setGrade] = useState(profileData.grade);
  const [classroom, setClassroom] = useState(profileData.classroom);
  const [schoolList, setSchoolList] = useState<SchoolInfo[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const k = async (school:string,schoolcode:string)=>{
    try{const response = await axios.get<SchoolInfo[]>(`https://localhost:8080/api/searchSchool?SchoolName=${school}`);
    const schools: SchoolInfo[] = response.data;
    for (const row of schools){
      if (row.SD_SCHUL_CODE===schoolcode){
        setSelectedSchool(row);
        break;
      }
    }}catch(error){
      
    }
  }

  useEffect(() => {
    if (profileData.school && profileData.shcode) {
      k(profileData.school,profileData.shcode);
    }
  }, [profileData]);

  const handleSchoolSelect = (school: SchoolInfo) => {
    setSelectedSchool(school);
    setSchool(school.SCHUL_NM);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('https://localhost:8080/user_data/profile_update', {
        nickname,
        school: selectedSchool?.SCHUL_NM,
        grade,
        classroom,
        SHcode: selectedSchool?.SD_SCHUL_CODE,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('프로파일이 성공적으로 업데이트되었습니다.');
      onClose();
    } catch (error) {
      console.error('프로파일 업데이트 중 오류:', error);
      alert('프로파일 업데이트에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>프로필 수정</h2>
      <label>
        닉네임:
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </label>
      <br />
      <label>
        학교:
        <input
          type="text"
          value={school}
          readOnly // Set input as read-only
        />
        <button onClick={() => setIsModalOpen(true)}>학교 검색</button>
      </label>
      <br />
      <label>
        학년:
        <input
          type="number"
          value={grade}
          onChange={(e) => setGrade(parseInt(e.target.value))}
        />
      </label>
      <br />
      <label>
        반:
        <input
          type="text"
          value={classroom}
          onChange={(e) => setClassroom(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>취소</button>
      {isModalOpen && (
        <SchoolSearchModal
        onSelectSchool={handleSchoolSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileEdit;
