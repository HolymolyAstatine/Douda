import React, { useState } from 'react';
import styled from 'styled-components';
import { searchTimetable } from './schoolApi';

const Container = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #007bff;
  margin-bottom: 20px;
`;

const Form = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const TimetableBox = styled.div`
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 15px;
  margin-top: 20px;
`;

const TimetableItem = styled.div`
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f8f9fa;
  border-radius: 3px;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 10px;
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
      <Title>시간표 검색</Title>
      <Form>
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
      </Form>

      {error && <ErrorMessage>{error}</ErrorMessage>}

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