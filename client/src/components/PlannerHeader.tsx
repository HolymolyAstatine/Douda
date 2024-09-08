// src/components/PlannerHeader.tsx

import React from 'react';

interface PlannerHeaderProps {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
}

const PlannerHeader: React.FC<PlannerHeaderProps> = ({ currentDate, setCurrentDate }) => {
    const handlePrevDay = () => {
        const prevDay = new Date(currentDate);
        prevDay.setDate(currentDate.getDate() - 1);
        setCurrentDate(prevDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDay);
    };

    return (
        <div className="planner-header">
            <button className="arrow" onClick={handlePrevDay}>&lt;</button>
            <div>{currentDate.toDateString()}</div>
            <button className="arrow" onClick={handleNextDay}>&gt;</button>
        </div>
    );
};

export default PlannerHeader;
