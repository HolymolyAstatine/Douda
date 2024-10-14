// client/src/components/Signup_set.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import errorIcon from "../img/error_exclamation_mark.svg";
import "./css/Signup_set.css";

const SignupSet = () => {
    const [nickname, setNickname] = useState('');
    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState('');
    const [classroom, setClassroom] = useState('');
    const [error, setError] = useState('');
    const [gradeError, setGradeError] = useState('');
    const [classroomError, setClassroomError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const { id: Gid, email } = location.state || { id: '', email: '' };
    const isFormValid = !!nickname;

    const validateIntegerInput = (value: string) => {
        return value === '' || /^[1-9]\d*$/.test(value);
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGrade(value);
        if (value !== '' && !validateIntegerInput(value)) {
            setGradeError('유효한 정수를 입력하세요.');
        } else {
            setGradeError('');
        }
    };

    const handleClassroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClassroom(value);
        if (value !== '' && !validateIntegerInput(value)) {
            setClassroomError('유효한 정수를 입력하세요.');
        } else {
            setClassroomError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateIntegerInput(grade) || !validateIntegerInput(classroom)) {
            setError('입력 오류를 수정한 후 제출하세요.');
            return;
        }
        if (!isFormValid) {
            setError('모든 필드는 필수입니다.');
            return;
        }

        try {
            const response = await axios.post(
                'https://localhost:8080/user_data/signup_setting',
                { Gid, email, nickname, school, grade: grade || undefined, classroom: classroom || undefined },
            );

            if (response.status === 200) {
                alert('회원가입 정보가 성공적으로 업데이트되었습니다.');
                navigate('/');
            }
        } catch (error) {
            console.error('회원가입 설정 제출 중 오류 발생:', error);
            setError('회원가입 정보 업데이트에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>추가 회원가입 정보</h2>
            <h4 className='required'>닉네임은 필수입니다.</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>닉네임:</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label>학교:</label>
                    <input
                        type="text"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label>학년:</label>
                    <input
                        type="text"
                        value={grade}
                        onChange={handleGradeChange}
                        style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {gradeError && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={errorIcon} alt="Error" className="error-icon" />
                            <span style={{ marginLeft: '8px', color: 'red' }}>{gradeError}</span>
                        </div>
                    )}
                </div>
                <div>
                    <label>반:</label>
                    <input
                        type="text"
                        value={classroom}
                        onChange={handleClassroomChange}
                        style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {classroomError && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={errorIcon} alt="Error" className="error-icon" />
                            <span style={{ marginLeft: '8px', color: 'red' }}>{classroomError}</span>
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    disabled={!isFormValid || !!gradeError || !!classroomError} 
                    style={{
                        backgroundColor: isFormValid && !gradeError && !classroomError ? '#4CAF50' : '#ccc',
                        color: isFormValid && !gradeError && !classroomError ? 'white' : '#777',
                        cursor: isFormValid && !gradeError && !classroomError ? 'pointer' : 'not-allowed',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        marginTop: '10px'
                    }}
                >
                    제출
                </button>
            </form>
        </div>
    );
};

export default SignupSet;