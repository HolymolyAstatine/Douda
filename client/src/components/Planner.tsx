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
    const startTime = 0;
    const endTime = 23;


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

    const createTimeRows = () => {
        const rows = [];
        for (let hour = startTime; hour <= endTime; hour++) {
          rows.push(
            <tr key={hour}>
              <td>{hour.toString().padStart(2, '0')}:00</td>
              {[...Array(6)].map((_, i) => (
                <td key={i}></td>
              ))}
            </tr>
          );
        }
        return rows;
      };

    return (
        <div>

        </div>
    );
};

export default Planner;
