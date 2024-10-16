import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MealInfo } from "../../../server/types/types";


const MealSchedule: React.FC = () => {
    const [meals, setMeals] = useState<MealInfo[][]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가

    const fetchMeals = async () => {
        setLoading(true); // 요청 시작 전에 로딩 상태 true
        try {
            const currentMonth = new Date().getMonth() + 1; // 현재 달 (1~12)
            const currentYear = new Date().getFullYear();
            const response = await axios.get(
                `https://localhost:8080/api/searchMeal?month=${currentMonth}&year=${currentYear}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMeals(response.data.data);
        } catch (err) {
            setError('급식 정보를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false); // 요청 완료 후 로딩 상태 false
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>급식 정보</h2>
            {loading ? (
                <p style={{ textAlign: 'center' }}>로딩 중...</p> // 로딩 중일 때 표시
            ) : error ? (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            ) : meals.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {meals.map((meal, index) => (
                        <li key={index} style={{ margin: '10px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                                <h4 style={{ margin: '0 0 10px', color: '#007bff' }}>{meal[0].MMEAL_SC_NM} ({meal[0].MLSV_YMD})</h4>
                                <p style={{ margin: '5px 0' }}><strong>중식 메뉴:</strong> {meal[0].DDISH_NM.replace(/\<br\/?>/g, ' ')}</p>
                                <p style={{ margin: '5px 0' }}><strong>칼로리:</strong> {meal[0].CAL_INFO}</p>
                                <p style={{ margin: '5px 0' }}><strong>영양 정보:</strong> {meal[0].NTR_INFO.replace(/\<br\/?>/g, ' ')}</p>
                            </div>
                            
                            {/* 1번 인덱스의 석식 정보 추가 */}
                            {meal[1] && (
                                <div style={{ marginTop: '15px', borderTop: '2px solid #ff5722', paddingTop: '10px' }}>
                                    <h4 style={{ margin: '0 0 10px', color: '#ff5722' }}>석식</h4>
                                    <p style={{ margin: '5px 0' }}><strong>메뉴:</strong> {meal[1].DDISH_NM.replace(/\<br\/?>/g, ' ')}</p>
                                    <p style={{ margin: '5px 0' }}><strong>칼로리:</strong> {meal[1].CAL_INFO}</p>
                                    <p style={{ margin: '5px 0' }}><strong>영양 정보:</strong> {meal[1].NTR_INFO.replace(/\<br\/?>/g, ' ')}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ textAlign: 'center' }}>급식 정보가 없습니다.</p>
            )}
        </div>
    );
};

export default MealSchedule;
