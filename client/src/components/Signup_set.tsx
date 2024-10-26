// SignupSet.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SchoolInfo } from '../../../server/types/types';
import SchoolSearchModal from './SchoolSearchModal';
import './css/Signup_set.css';
import { useLocation, useNavigate } from 'react-router-dom';

const SignupSet = () => {
    const [nickname, setNickname] = useState('');
    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState('');
    const [classroom, setClassroom] = useState('');
    const [error, setError] = useState('');
    const [gradeError, setGradeError] = useState('');
    const [classroomError, setClassroomError] = useState('');
    const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const { id, email } = location.state || {};
    const navigate = useNavigate();

    const handleSchoolSelect = (school: SchoolInfo) => {
        setSelectedSchool(school);
        setSchool(school.SCHUL_NM);
        setIsModalOpen(false);  // Close the modal
    };

    useEffect(() => {
        document.title = "Douda - 회원가입";
      }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nickname) {
            setError('닉네임은 필수입니다.');
            return;
        }

        try {
            const response = await axios.post(
                'https://localhost:8080/user_data/signup_setting',
                {
                    Gid:id,
                    email,
                    nickname,
                    school: selectedSchool?.SCHUL_NM,
                    grade: grade || undefined,
                    classroom: classroom || undefined,
                    SHcode: selectedSchool?.SD_SCHUL_CODE,
                },
            );

            if (response.status === 200) {
                alert('회원가입 성공!');
                navigate('/')
            }
        } catch (error) {
            console.error('Error submitting signup settings:', error);
            setError('회원가입을 하는데 에러가 발생했습니다.');
        }
    };

    return (
        <div className="signup-set">
            <h2>추가 회원가입 정보 입력</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>닉네임:</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        className="input"
                    />
                </div>

                <div>
                    <label>학교:</label>
                    <button
                        type="button"
                        className="search-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        학교 검색
                    </button>
                    {selectedSchool && <p>{selectedSchool.SCHUL_NM}</p>}
                </div>

                <div>
                    <label>학년:</label>
                    <input
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="input"
                    />
                </div>

                <div>
                    <label>반:</label>
                    <input
                        type="text"
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        className="input"
                    />
                </div>

                <button type="submit" className="submit-button">
                    제출
                </button>
            </form>

            {isModalOpen && (
                <SchoolSearchModal
                    onSelectSchool={handleSchoolSelect}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default SignupSet;
