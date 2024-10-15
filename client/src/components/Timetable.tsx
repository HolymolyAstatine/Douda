import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TimetableInfo {
    AY: string; // 학년도
    SEM: string; // 학기
    ALL_TI_YMD: string; // 시간표일자
    DGHT_CRSE_SC_NM: string; // 주야과정명
    ORD_SC_NM: string; // 계열명
    DDDEP_NM: string; // 학과명
    GRADE: string; // 학년
    CLRM_NM: string; // 강의실명
    CLASS_NM: string; // 학급명
    PERIO: string; // 교시
    ITRT_CNTNT: string; // 수업내용
}

const Timetable: React.FC = () => {
    const [timetable, setTimetable] = useState<TimetableInfo[]>([]);
    const [error, setError] = useState<string>('');
    const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴
    const userId = localStorage.getItem('userId'); // 사용자 ID를 로컬 스토리지에서 가져옴

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axios.get('https://localhost:8080/api/searchTimeTable', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        date: new Date().toISOString().split('T')[0], // 현재 날짜를 yyyy-mm-dd 형식으로 가져옴
                    },
                });
                setTimetable(response.data.data); // 시간표 정보를 상태에 저장
            } catch (error) {
                console.error('시간표 정보를 가져오는 중 오류 발생:', error);
                setError('시간표 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchTimetable();
    }, [token]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>학급 시간표</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {timetable.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>교시</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>수업내용</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>강의실</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.PERIO}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.ITRT_CNTNT}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.CLRM_NM}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>시간표 정보가 없습니다.</p>
            )}
        </div>
    );
};

export default Timetable;