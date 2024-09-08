// src/components/Planner.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plan } from '../types';
import PlannerHeader from './PlannerHeader';
import '../styles/planner.css';  // 스타일 파일 추가

interface PlannerProps {
    plansByDate: Record<string, Plan[]>;
}

const Planner: React.FC<PlannerProps> = ({ plansByDate }) => {
    const { date } = useParams<{ date: string }>();
    const [currentDate, setCurrentDate] = useState(new Date(date || new Date()));

    useEffect(() => {
        if (date) {
            setCurrentDate(new Date(date));
        }
    }, [date]);

    const renderPlans = () => {
        const plans = plansByDate[currentDate.toISOString().split('T')[0]] || [];
        return plans.map((plan, index) => {
            const startTime = new Date(`1970-01-01T${plan.start}:00`);
            const endTime = new Date(`1970-01-01T${plan.end}:00`);
            const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 30); // 30분 단위로 계산
            const topPosition = (startTime.getHours() * 60 + startTime.getMinutes()) / 30;

            const taskStyle = {
                height: `${duration * 40}px`,
                top: `${topPosition * 40}px`,
                backgroundColor: plan.color
            };

            return (
                <div key={index} className="task" style={taskStyle}>
                    {plan.title}
                </div>
            );
        });
    };

    return (
        <div className="planner-container">
            <PlannerHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <div className="time-blocks">
                {[...Array(24)].map((_, i) => (
                    <div key={i} className="time-block">
                        <div className="time-label">{`${String(i).padStart(2, '0')}:00`}</div>
                        <div className="task-block">
                            {renderPlans()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Planner;
