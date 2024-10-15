import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MealInfo {
    MMEAL_SC_CODE: string;
    MMEAL_SC_NM: string;
    MLSV_YMD: string;
    DDISH_NM: string;
    ORPLC_INFO: string;
    CAL_INFO: string;
    NTR_INFO: string;
}

const MealInfo: React.FC = () => {
    const [meals, setMeals] = useState<MealInfo[]>([]);
    const [error, setError] = useState<string>('');
    const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await axios.get('https://localhost:8080/api/searchMeal', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        month: new Date().getMonth() + 1, // 현재 월을 가져옴
                    },
                });
                setMeals(response.data.data); // 급식 정보를 상태에 저장
            } catch (error) {
                console.error('급식 정보를 가져오는 중 오류 발생:', error);
                setError('급식 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchMeals();
    }, [token]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>급식 정보</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {meals.length > 0 ? (
                <ul>
                    {meals.map((meal, index) => (
                        <li key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <h4>{meal.MMEAL_SC_NM} ({meal.MLSV_YMD})</h4>
                            <p>메뉴: {meal.DDISH_NM}</p>
                            <p>원산지: {meal.ORPLC_INFO}</p>
                            <p>칼로리: {meal.CAL_INFO}</p>
                            <p>영양 정보: {meal.NTR_INFO}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>급식 정보가 없습니다.</p>
            )}
        </div>
    );
};

export default MealInfo;