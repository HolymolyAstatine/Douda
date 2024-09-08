import React, { useState, useEffect } from 'react';
import './planner_styles.css';

interface Plan {
    date: Date;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
}

const Planner : React.FC = () => {
    const [currentDate,setCurrentDate] = useState(new Date());
    const [plans,setPlans] = useState<Plan[]>([]);
    const [modalOpen,setModalOpen] = useState(false);


    const updateDate = () => {
        const dateString = currentDate.toISOString().split('T')[0];
        return dateString;
    };

    const handlePrevDayClick = () => {
        setCurrentDate(prevDate=>{
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate()-1);
            return newDate;
        });
    };

    const handleNextDayClick = () => {
        setCurrentDate(nextDate => {
            const newDate = new Date(nextDate);
            newDate.setDate(newDate.getDate()+1);
            return newDate;
        });
    };
    return (
        <div>

        </div>
    );
};

export default Planner;
