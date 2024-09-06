import React, { useState } from 'react';
import styled from 'styled-components';
import { searchSchool } from './schoolApi';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const SchoolInfo = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 15px;
`;

interface SchoolSearchProps {
  onSchoolSelect: (school: any) => void;
}

const SchoolSearch: React.FC<SchoolSearchProps> = ({ onSchoolSelect }) => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [schoolInfo, setSchoolInfo] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const result = await searchSchool(schoolName, schoolType);
      if (result) {
        setSchoolInfo(result);
        onSchoolSelect(result);
        setError('');
      } else {
        setSchoolInfo(null);
        setError('검색 결과가 없습니다.');
      }
    } catch (error) {
      setSchoolInfo(null);
      setError('학교 검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <h2>학교 검색</h2>
      <Input
        type="text"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        placeholder="학교 이름 입력"
      />
      <Select
        value={schoolType}
        onChange={(e) => setSchoolType(e.target.value)}
      >
        <option value="">학교 유형 선택</option>
        <option value="초등학교">초등학교</option>
        <option value="중학교">중학교</option>
        <option value="고등학교">고등학교</option>
      </Select>
      <Button onClick={handleSearch}>검색</Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {schoolInfo && (
        <SchoolInfo>
          <h3>학교 정보:</h3>
          <p>학교명: {schoolInfo.SCHUL_NM}</p>
          <p>학교 유형: {schoolInfo.SCHUL_KND_SC_NM}</p>
          <p>학교코드: {schoolInfo.SD_SCHUL_CODE}</p>
          <p>교육청코드: {schoolInfo.ATPT_OFCDC_SC_CODE}</p>
          <p>주소: {schoolInfo.ORG_RDNMA}</p>
          <p>전화번호: {schoolInfo.ORG_TELNO}</p>
        </SchoolInfo>
      )}
    </Container>
  );
};

export default SchoolSearch;