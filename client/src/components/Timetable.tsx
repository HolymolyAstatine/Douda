import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // react-datepicker 패키지 설치 필요
import 'react-datepicker/dist/react-datepicker.css'; // 날짜 선택 스타일
import './css/Timetable.css'; // CSS 파일 가져오기

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
    const [loading, setLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const token = localStorage.getItem('token');

    const fetchTimetable = async (date: Date) => {
        try {
            setLoading(true);
            const formattedDate = date.toISOString().split('T')[0];
            const response = await axios.get('https://douda.kro.kr/api/searchTimeTable', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: { date: formattedDate },
            });
            setTimetable(response.data.data);
            setError('');
        } catch (error) {
            console.error('시간표 정보를 가져오는 중 오류 발생:', error);
            setError('시간표 정보를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimetable(currentDate);
    }, [currentDate, token]);

    const handleDateChange = (date: Date | null) => {
        if (date) setCurrentDate(date);
    };

    const handlePrevDay = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    };

    const handleNextDay = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    };

    const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 (${currentDate.toLocaleDateString('ko-KR', { weekday: 'long' })})`;

    return (
        <div className="container">
            <h2 className="title">학급 시간표</h2>
            <div className="button-container">
                <button className="button" onClick={handlePrevDay}>&larr;</button>
                <button className="button" onClick={() => setCurrentDate(new Date())}>오늘</button>
                <button className="button" onClick={handleNextDay}>&rarr;</button>
                <button className="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                    {isCalendarOpen ? '달력 닫기' : '달력 열기'}
                </button>
                <br/>
            </div>
            <div className="date-display">
                <span >{formattedDate}</span>
            </div>
            {isCalendarOpen && (
                <div className="calendar-container">
                    <DatePicker
                        selected={currentDate}
                        onChange={handleDateChange}
                        inline
                    />
                </div>
            )}
            {loading ? (
                <p className="loading-message">로딩중...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                timetable.length > 0 ? (
                    <table className="timetable-table">
                        <thead>
                            <tr>
                                <th className="table-header">교시</th>
                                <th className="table-header">수업내용</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetable.map((item, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-cell">{item.PERIO}</td>
                                    <td className="table-cell">{item.ITRT_CNTNT}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data-message">시간표 정보가 없습니다.</p>
                )
            )}
        </div>
    );
};

export default Timetable;
