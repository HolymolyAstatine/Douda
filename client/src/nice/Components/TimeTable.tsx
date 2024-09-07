import React, { useState } from 'react';
import styled from 'styled-components';
import { searchTimetable } from './schoolApi';

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

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const TimetableBox = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
`;

const TimetableItem = styled.div`
  margin-bottom: 10px;
  padding: 5px;
  background-color: #ffffff;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

interface TimeTableProps {
  schoolInfo: any;
}

const TimeTable: React.FC<TimeTableProps> = ({ schoolInfo }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [grade, setGrade] = useState('');
  const [classNum, setClassNum] = useState('');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const result = await searchTimetable(schoolInfo, date, grade, classNum);
      if (result.length > 0) {
        setTimetable(result);
        setError('');
      } else {
        setTimetable([]);
        setError('해당 날짜의 시간표 정보가 없습니다.');
      }
    } catch (error) {
      setTimetable([]);
      setError('시간표 검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <h2>시간표 검색</h2>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input
        type="text"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        placeholder="학년"
      />
      <Input
        type="text"
        value={classNum}
        onChange={(e) => setClassNum(e.target.value)}
        placeholder="반"
      />
      <Button onClick={handleSearch}>검색</Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {timetable.length > 0 && (
        <TimetableBox>
          <h3>시간표 ({date}):</h3>
          {timetable.map((item, index) => (
            <TimetableItem key={index}>
              <p>{item.PERIO}교시: {item.ITRT_CNTNT}</p>
            </TimetableItem>
          ))}
        </TimetableBox>
      )}
    </Container>
  );
};

export default TimeTable;