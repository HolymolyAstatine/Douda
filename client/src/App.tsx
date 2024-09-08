import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Planner from './components/planner';  // Planner 컴포넌트를 불러옵니다.

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/planner">Planner</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<h2>Home Page</h2>} />
                    <Route path="/planner" element={<Planner />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
