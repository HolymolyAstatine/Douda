import React, { useState } from 'react';
import axios from 'axios';

interface School {
  SCHUL_NM: string;
  SD_SCHUL_CODE: string;
  ATPT_OFCDC_SC_CODE: string;
}

const SchoolSearch: React.FC = () => {
  const [schoolName, setSchoolName] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const API_KEY = 'key';
  const API_URL = 'https://open.neis.go.kr/hub/schoolInfo';

  const searchSchools = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          KEY: API_KEY,
          Type: 'json',
          SCHUL_NM: schoolName,
        },
      });

      if (response.data.schoolInfo) {
        setSchools(response.data.schoolInfo[1].row);
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error('학교 검색 중 오류 발생:', error);
      setSchools([]);
    }
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    // 여기에서 선택된 학교 정보를 다른 함수나 상태로 전달할 수 있습니다.
    console.log('선택된 학교:', school);
  };

  return (
    <div>
      <input
        type="text"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        placeholder="학교 이름 입력"
      />
      <button onClick={searchSchools}>학교 검색</button>

      <ul>
        {schools.map((school) => (
          <li key={school.SD_SCHUL_CODE} onClick={() => handleSchoolSelect(school)}>
            {school.SCHUL_NM}
          </li>
        ))}
      </ul>

      {selectedSchool && (
        <div>
          <h3>선택된 학교 정보:</h3>
          <p>학교명: {selectedSchool.SCHUL_NM}</p>
          <p>학교코드: {selectedSchool.SD_SCHUL_CODE}</p>
          <p>교육청코드: {selectedSchool.ATPT_OFCDC_SC_CODE}</p>
        </div>
      )}
    </div>
  );
};

export default SchoolSearch;