// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SchoolSearch from './nice/Components/api';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SchoolSearch />} />
      </Routes>
    </Router>
  );
}

export default App;

