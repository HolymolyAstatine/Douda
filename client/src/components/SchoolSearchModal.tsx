// SchoolSearchModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { SchoolInfo } from '../../../server/types/types';
import './css/SchoolSearchModal.css';

interface SchoolSearchModalProps {
    onSelectSchool: (school: SchoolInfo) => void;
    onClose: () => void;
}

const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({ onSelectSchool, onClose }) => {
    const [school, setSchool] = useState('');
    const [schoolList, setSchoolList] = useState<SchoolInfo[]>([]);

    const handleSchoolSearch = async () => {
        try {
            const response = await axios.get(`https://localhost:8080/api/searchSchool?SchoolName=${school}`);
            setSchoolList(response.data.data);
        } catch (error) {
            console.error('Error occurred while searching for schools:', error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSchoolSearch();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <input
                    type="text"
                    className="input"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    onKeyDown={handleKeyDown}  // Trigger search on Enter
                />
                <button className="search-button" onClick={handleSchoolSearch}>
                    검색
                </button>

                <ul className="school-list">
                    {schoolList.map((school) => (
                        <li key={school.SD_SCHUL_CODE} className="list-item" onClick={() => onSelectSchool(school)}>
                            {school.SCHUL_NM}, {school.ORG_RDNMA}, {school.ATPT_OFCDC_SC_NM}
                        </li>
                    ))}
                </ul>

                <button className="close-button" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default SchoolSearchModal;
