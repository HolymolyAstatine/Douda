import React, { useState } from 'react';
import axios from 'axios';

interface SchoolSearchModalProps {
  onSelect: (school: any) => void; // 학교 선택 핸들러
  onClose: () => void; // 모달 닫기 핸들러
}

const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [schools, setSchools] = useState<any[]>([]); // 검색 결과 상태

  const handleSearch = async () => {
    const response = await axios.get(`https://api.example.com/search-school?query=${searchTerm}`);
    setSchools(response.data); // 검색 결과 설정
  };

  return (
    <div className="modal" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
      <h2>학교 검색</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
        placeholder="학교 이름을 입력하세요"
      />
      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>검색</button>
      <ul style={{ marginTop: '10px' }}>
        {schools.map((school) => (
          <li key={school.id} onClick={() => onSelect(school)} style={{ cursor: 'pointer' }}>
            {school.SCHUL_NM} - {school.ADDR}
          </li>
        ))}
      </ul>
      <button onClick={onClose} style={{ marginTop: '10px' }}>닫기</button>
    </div>
  );
};

export default SchoolSearchModal;
