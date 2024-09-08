import React from 'react';
import './App.css';

const TimeTable: React.FC = () => {
  const startTime = 0; // 00:00
  const endTime = 23;  // 23:00

  // 시간대 행을 생성하는 함수
  const createTimeRows = () => {
    const rows = [];
    for (let hour = startTime; hour <= endTime; hour++) {
      rows.push(
        <tr key={hour}>
          <td>{hour.toString().padStart(2, '0')}:00</td>
          {[...Array(6)].map((_, i) => (
            <td key={i}></td>
          ))}
        </tr>
      );
    }
    return rows;
  };

  return (
    <table className='time-table'>
      <thead>
        <tr>
          <th>Time</th>
          {[...Array(6)].map((_, i) => (
            <th key={i}>Column {i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {createTimeRows()}
      </tbody>
    </table>
  );
};

export default TimeTable;
