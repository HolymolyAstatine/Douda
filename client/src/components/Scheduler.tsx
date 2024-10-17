import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Schedule {
    id: number;
    title: string;
    description: string;
    date: string; // yyyy-mm-dd 형식
    time: string; // HH:mm 형식
}

const Scheduler: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [error, setError] = useState<string>('');
    const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('https://douda.kro.kr:443/api/getSchedules', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSchedules(response.data.data); // 스케줄 정보를 상태에 저장
            } catch (error) {
                console.error('스케줄 정보를 가져오는 중 오류 발생:', error);
                setError('스케줄 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchSchedules();
    }, [token]);

    const handleAddSchedule = async () => {
        if (!title || !date || !time) {
            setError('제목, 날짜 및 시간을 입력해야 합니다.');
            return;
        }

        try {
            const response = await axios.post('https://douda.kro.kr:443/api/addSchedule', {
                title,
                description,
                date,
                time,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSchedules([...schedules, response.data.data]); // 새 스케줄 추가
            setTitle('');
            setDescription('');
            setDate('');
            setTime('');
            setError('');
        } catch (error) {
            console.error('스케줄 추가 중 오류 발생:', error);
            setError('스케줄 추가에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>스케줄러</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ margin: '5px', padding: '10px', width: 'calc(100% - 22px)' }}
                />
                <textarea
                    placeholder="설명"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ margin: '5px', padding: '10px', width: 'calc(100% - 22px)', height: '60px' }}
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ margin: '5px', padding: '10px', width: 'calc(50% - 22px)' }}
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ margin: '5px', padding: '10px', width: 'calc(50% - 22px)' }}
                />
                <button onClick={handleAddSchedule} style={{ margin: '5px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
                    추가
                </button>
            </div>
            <h3 style={{ color: '#333' }}>내 스케줄</h3>
            <ul>
                {schedules.map((schedule) => (
                    <li key={schedule.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <h4>{schedule.title} ({schedule.date} {schedule.time})</h4>
                        <p>{schedule.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Scheduler;