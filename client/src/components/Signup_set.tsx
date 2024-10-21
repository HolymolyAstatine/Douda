import React, { useState } from 'react';
import axios from 'axios';
import { SchoolInfo } from '../../../server/types/types';
import './css/Signup_set.css';  // CSS 파일을 임포트

const SignupSet = () => {
    const [nickname, setNickname] = useState('');
    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState('');
    const [classroom, setClassroom] = useState('');
    const [error, setError] = useState('');
    const [gradeError, setGradeError] = useState('');
    const [classroomError, setClassroomError] = useState('');
    const [schoolList, setSchoolList] = useState<SchoolInfo[]>([]);
    const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const validateIntegerInput = (value: string) => {
        return value === '' || /^[1-9]\d*$/.test(value);
    };

    const handleSchoolSearch = async () => {
        try {
            const response = await axios.get(`https://localhost:8080/api/searchSchool?SchoolName=${school}`);
            setSchoolList(response.data.data);  // 학교 목록 업데이트
        } catch (error) {
            console.error('학교 검색 중 오류 발생:', error);
        }
    };

    const handleSchoolSelect = (school: SchoolInfo) => {
        setSelectedSchool(school);
        setSchool(school.SCHUL_NM);
        setSchoolList([]);
        setIsModalOpen(false);  // 모달 닫기
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nickname) {
            setError('닉네임 필드는 필수입니다.');
            return;
        }

        try {
            const response = await axios.post(
                'https://localhost:8080/user_data/signup_setting',
                {
                    nickname,
                    school: selectedSchool?.SCHUL_NM,
                    grade: grade || undefined,
                    classroom: classroom || undefined,
                    SHcode: selectedSchool?.SD_SCHUL_CODE,
                },
            );

            if (response.status === 200) {
                alert('회원가입 정보가 성공적으로 업데이트되었습니다.');
            }
        } catch (error) {
            console.error('회원가입 설정 제출 중 오류 발생:', error);
            setError('회원가입 정보 업데이트에 실패했습니다.');
        }
    };

    return (
        <div className="signup-set">
            <h2>추가 회원가입 정보</h2>
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
                <div className="modal">
                    <div className="modal-content">
                        <input
                            type="text"
                            className="input"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSchoolSearch}>
                            검색
                        </button>

                        <ul className="school-list">
                            {schoolList.map((school) => (
                                <li key={school.SD_SCHUL_CODE} className="list-item" onClick={() => handleSchoolSelect(school)}>
                                    {school.SCHUL_NM}, {school.ORG_RDNMA}, {school.ATPT_OFCDC_SC_NM}
                                </li>
                            ))}
                        </ul>

                        <button className="close-button" onClick={() => setIsModalOpen(false)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignupSet;
