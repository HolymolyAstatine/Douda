import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // DatePicker 추가
import { MealInfo } from "../../../server/types/types";
import './css/MealSchedule.css'; // CSS 파일 임포트
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker CSS 임포트

const MealSchedule: React.FC = () => {
    const [meals, setMeals] = useState<Record<string, MealInfo[][]>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState<boolean>(false); // 달력 표시 상태

    const fetchMeals = async (month: number, year: number) => {
        const key = `${year}-${month}`;
        if (meals[key]) {
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(
                `https://douda.kro.kr/api/searchMeal?month=${month}&year=${year}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMeals(prevMeals => ({
                ...prevMeals,
                [key]: response.data.data
            }));
        } catch (err) {
            setError('급식 정보를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const filterTodayMeals = (meals: MealInfo[][], targetDate: Date) => {
        const todayString = targetDate.toISOString().slice(0, 10).replace(/-/g, '');
        return meals.filter(meal => meal[0].MLSV_YMD.replace(/-/g, '') === todayString);
    };

    useEffect(() => {
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        fetchMeals(currentMonth, currentYear);
    }, [currentDate]);

    const handlePrevDay = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(prevDate);

        const prevMonth = prevDate.getMonth() + 1;
        const prevYear = prevDate.getFullYear();
        if (!meals[`${prevYear}-${prevMonth}`]) {
            fetchMeals(prevMonth, prevYear);
        }
    };

    const handleNextDay = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);

        const nextMonth = nextDate.getMonth() + 1;
        const nextYear = nextDate.getFullYear();
        if (!meals[`${nextYear}-${nextMonth}`]) {
            fetchMeals(nextMonth, nextYear);
        }
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);

        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        if (!meals[`${currentYear}-${currentMonth}`]) {
            fetchMeals(currentMonth, currentYear);
        }
    };

    // 달력에서 선택한 날짜로 이동
    const handleDateChange = (date: Date | null) => {
        if (date) {
            setCurrentDate(date);
            const selectedMonth = date.getMonth() + 1;
            const selectedYear = date.getFullYear();
            if (!meals[`${selectedYear}-${selectedMonth}`]) {
                fetchMeals(selectedMonth, selectedYear);
            }
            setShowCalendar(false); // 달력 닫기
        }
    };
    

    const currentMeals = meals[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`] || [];
    const filteredMeals = filterTodayMeals(currentMeals, currentDate);

    // 현재 날짜를 '년/월/일' 및 '요일' 형식으로 변환
    const getFormattedDate = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

        return {
            year,
            month,
            day,
            weekday
        };
    };

    const { year, month, day, weekday } = getFormattedDate(currentDate);

    return (
        <div className="container">
            <h2 className="title">급식 정보</h2>
            <div className="button-container">
                <button className="button" onClick={handlePrevDay}>&larr;</button>
                <button className="button" onClick={handleToday}>오늘</button>
                <button className="button" onClick={handleNextDay}>&rarr;</button>
                <button className="button" onClick={() => setShowCalendar(!showCalendar)}>
                    {showCalendar ? '달력 닫기' : '달력 열기'}
                </button> {/* 달력 보기 버튼 */}
            </div>

            {/* 날짜 정보 표시 */}
            <div className="date-display">
                <span>{year}년 {month}월 {day}일 ({weekday}요일)</span>
            </div>

            {/* 달력 표시 */}
            {showCalendar && (
                <div className="calendar-container">
                    <DatePicker
                        selected={currentDate}
                        onChange={handleDateChange} // 달력에서 날짜 선택
                        inline
                    />
                </div>
            )}

            {loading ? (
                <p style={{ textAlign: 'center' }}>로딩 중...</p>
            ) : error ? (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            ) : filteredMeals.length > 0 ? (
                <ul className="meal-list">
                    {filteredMeals.map((meal, index) => (
                        <li key={index} className="meal-item">
                            <div className="meal-header">
                                <h4>{meal[0].MMEAL_SC_NM} ({meal[0].MLSV_YMD})</h4>
                                <p className="meal-details"><strong>중식 메뉴:</strong> {meal[0].DDISH_NM.replace(/\<br\/?>/g, ' ')}</p>
                                <p className="meal-details"><strong>칼로리:</strong> {meal[0].CAL_INFO}</p>
                                <p className="meal-details"><strong>영양 정보:</strong> {meal[0].NTR_INFO.replace(/\<br\/?>/g, ' ')}</p>
                            </div>

                            {meal[1] && (
                                <div className="meal-dinner">
                                    <h4>석식</h4>
                                    <p className="meal-details"><strong>메뉴:</strong> {meal[1].DDISH_NM.replace(/\<br\/?>/g, ' ')}</p>
                                    <p className="meal-details"><strong>칼로리:</strong> {meal[1].CAL_INFO}</p>
                                    <p className="meal-details"><strong>영양 정보:</strong> {meal[1].NTR_INFO.replace(/\<br\/?>/g, ' ')}</p>
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
