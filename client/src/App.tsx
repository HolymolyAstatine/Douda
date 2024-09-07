import React, { useState } from 'react';
import SchoolSearch from './nice/Components/SchoolSearch';
import MealInfo from './nice/Components/MealInfo';
import TimeTable from './nice/Components/TimeTable';

const App: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);

  return (
    <div className="App">
      <h1>도우다 - Douda</h1>
      <SchoolSearch onSchoolSelect={setSelectedSchool} />
      {selectedSchool && (
        <>
          <MealInfo schoolInfo={selectedSchool} />
          <TimeTable schoolInfo={selectedSchool} />
        </>
      )}
    </div>
  );
};

export default App;