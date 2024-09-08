// src/components/Calendar.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarEvent } from '../types';
import '../styles/calendar.css';  // 스타일 파일 추가

interface CalendarProps {
    events: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
    const navigate = useNavigate();
    const [currentYear, setCurrentYear] = useState(2024);
    const [currentMonth, setCurrentMonth] = useState(7); // 8월

    const handleDayClick = (date: Date) => {
        navigate(`/planner/${date.toISOString().split('T')[0]}`);
    };

    const renderCalendar = () => {
        const date = new Date(currentYear, currentMonth);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const dates = [];

        // 첫 주 공백 채우기
        for (let i = 0; i < firstDayOfMonth; i++) {
            dates.push(<div key={`empty-${i}`} className="date empty"></div>);
        }

        // 날짜 채우기
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const currentDate = new Date(currentYear, currentMonth, i);
            const eventElements = events.map((event, index) => {
                if (currentDate >= event.startDate && currentDate <= event.endDate) {
                    const eventBarStyle = {
                        bottom: `${10 + index * 8}px`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                    };

                    return (
                        <div key={index} className="event-bar" style={eventBarStyle}>
                            {currentDate.getTime() === event.startDate.getTime() && (
                                <div className="event-title">{event.title}</div>
                            )}
                        </div>
                    );
                }
                return null;
            });

            dates.push(
                <div
                    key={i}
                    className="date"
                    onClick={() => handleDayClick(currentDate)}
                >
                    {i}
                    {eventElements}
                </div>
            );
        }

        return dates;
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="calendar">
            <div className="header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>{`${new Date(currentYear, currentMonth).toLocaleString('ko-KR', { month: 'long' })} ${currentYear}`}</h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="days">
                <div className="sunday">일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div className="saturday">토</div>
            </div>
            <div className="dates">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default Calendar;
