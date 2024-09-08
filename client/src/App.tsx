// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './components/Calendar';
import Planner from './components/Planner';
import { Plan } from './types';

const plansByDate: Record<string, Plan[]> = {
    '2024-08-31': [
        { start: '10:30', end: '14:00', title: '개발', color: '#FFB6C1' },
        { start: '15:00', end: '16:30', title: '회의', color: '#87CEFA' }
    ],
    '2024-09-01': [
        { start: '09:00', end: '11:00', title: '디자인', color: '#98FB98' },
        { start: '13:00', end: '14:30', title: '테스트', color: '#FFD700' }
    ]
};

const events = [
    {
        startDate: new Date('2024-08-31T00:00:00'),
        endDate: new Date('2024-08-31T23:59:59'),
        title: '개발'
    },
    {
        startDate: new Date('2024-09-01T00:00:00'),
        endDate: new Date('2024-09-01T23:59:59'),
        title: '디자인'
    }
];

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Calendar events={events} />} />
                <Route path="/planner/:date" element={<Planner plansByDate={plansByDate} />} />
            </Routes>
        </Router>
    );
};

export default App;
