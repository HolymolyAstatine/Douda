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
    PERIO: string; // 교시
    ITRT_CNTNT: string; // 수업내용
}

const Timetable: React.FC = () => {
    const [timetable, setTimetable] = useState<TimetableInfo[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); // Loading state added
    const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                setLoading(true); // Set loading to true before starting the fetch
                const response = await axios.get('https://localhost:443/api/searchTimeTable', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        date: new Date().toISOString().split('T')[0], // 현재 날짜를 yyyy-mm-dd 형식으로 가져옴
                    },
                });
                setTimetable(response.data.data); // 시간표 정보를 상태에 저장
                setError('');
            } catch (error) {
                console.error('시간표 정보를 가져오는 중 오류 발생:', error);
                setError('시간표 정보를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false); // Set loading to false after the fetch completes
            }
        };

        fetchTimetable();
    }, [token]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>학급 시간표</h2>
            {loading ? (
                <p style={{ textAlign: 'center' }}>로딩중...</p> // Loading message
            ) : error ? (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            ) : (
                timetable.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>교시</th>
                                <th style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>수업내용</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetable.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{item.PERIO}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>{item.ITRT_CNTNT}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: 'center' }}>시간표 정보가 없습니다.</p>
                )
            )}
        </div>
    );
};

export default Timetable;
