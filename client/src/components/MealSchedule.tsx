import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MealInfo } from '../../../server/types/types'; // MealInfo 타입을 import

const MealSchedule: React.FC = () => {
  const [mealData, setMealData] = useState<MealInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await axios.get('https://localhost:8080/meals'); // API 엔드포인트를 적절히 수정하세요
        setMealData(response.data); // 응답 데이터를 상태에 저장
      } catch (err) {
        setError('급식 정보를 불러오는 데 오류가 발생했습니다.'); // 오류 처리
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchMealData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []);

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 표시
  }

  if (error) {
    return <div>{error}</div>; // 오류가 발생했을 때 표시
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>급식표</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>학교명</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>식사명</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>급식일자</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>요리명</th>
          </tr>
        </thead>
        <tbody>
          {mealData.map((meal) => (
            <tr key={meal.MMEAL_SC_CODE}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{meal.SCHUL_NM}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{meal.MMEAL_SC_NM}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{meal.MLSV_YMD}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{meal.DDISH_NM}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealSchedule;