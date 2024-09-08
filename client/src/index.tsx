// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/calendar.css';
import './styles/planner.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
