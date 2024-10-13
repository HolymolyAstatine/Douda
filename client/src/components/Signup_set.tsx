// client/src/components/Signup_set.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import errorIcon from "../img/error_exclamation_mark.svg";
import "./css/Signup_set.css";

const SignupSet = () => {
    // 각 입력 필드에 대한 상태 변수 초기화
    const [nickname, setNickname] = useState(''); // 닉네임 상태
    const [school, setSchool] = useState(''); // 학교 상태
    const [grade, setGrade] = useState(''); // 학년 상태
    const [classroom, setClassroom] = useState(''); // 반 상태
    const [error, setError] = useState(''); // 일반 오류 메시지 상태
    const [gradeError, setGradeError] = useState(''); // 학년 오류 메시지 상태
    const [classroomError, setClassroomError] = useState(''); // 반 오류 메시지 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const location = useLocation(); // 현재 위치 정보를 가져오기 위한 훅

    // URL 상태에서 id와 email 추출
    const { id: Gid, email } = location.state || { id: '', email: '' };
    const isFormValid = !!nickname; // 닉네임이 있을 경우 폼 유효성 검사

    // 정수 입력 검증 함수
    const validateIntegerInput = (value: string) => {
        // 비어있거나 양의 정수인지 확인
        return value === '' || /^[1-9]\d*$/.test(value); // 빈 문자열 또는 양의 정수 허용
    };

    // 학년 입력 변경 핸들러
    const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.target.value;
        setGrade(value);

        // 값이 유효하지 않고 비어있지 않을 경우 오류 메시지 설정
        if (value !== '' && !validateIntegerInput(value)) {
            setGradeError('유효한 정수를 입력하세요.');
        } else {
            setGradeError('');
        }
    };

    // 반 입력 변경 핸들러
    const handleClassroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClassroom(value);

        // 값이 유효하지 않고 비어있지 않을 경우 오류 메시지 설정
        if (value !== '' && !validateIntegerInput(value)) {
            setClassroomError('유효한 정수를 입력하세요.');
        } else {
            setClassroomError('');
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 정수 입력 유효성 검사
        if (!validateIntegerInput(grade) || !validateIntegerInput(classroom)) {
            setError('입력 오류를 수정한 후 제출하세요.');
            return;
        }

        // 닉네임이 비어있으면 오류 설정
        if (!isFormValid) {
            setError('모든 필드는 필수입니다.');
            return;
        }

        try {
            // 회원가입 설정 API 호출
            const response = await axios.post(
                'https://localhost:8080/user_data/signup_setting',
                { Gid, email, nickname, school, grade: grade || undefined, classroom: classroom || undefined },
            );

            // 성공적인 응답 처리
            if (response.status === 200) {
                alert('회원가입 정보가 성공적으로 업데이트되었습니다.');
                navigate('/'); // 메인 페이지로 이동
            }
        } catch (error) {
            console.error('회원가입 설정 제출 중 오류 발생:', error); // 콘솔에 오류 기록
            setError('회원가입 정보 업데이트에 실패했습니다.'); // 오류 메시지 설정
        }
    };

    return (
        <div>
            <h2>추가 회원가입 정보</h2>
            <h4 className='required'>닉네임은 필수입니다.</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* 오류 메시지 출력 */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>닉네임:</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)} // 닉네임 상태 업데이트
                        required
                    />
                </div>
                <div>
                    <label>학교:</label>
                    <input
                        type="text"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)} // 학교 상태 업데이트
                        required
                    />
                </div>
                <div>
                    <label>학년:</label>
                    <input
                        type="text"
                        value={grade}
                        onChange={handleGradeChange} // 학년 상태 업데이트
                    />
                    {gradeError && ( // 학년 오류가 있을 경우 오류 메시지 표시
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
                        onChange={handleClassroomChange} // 반 상태 업데이트
                    />
                    {classroomError && ( // 반 오류가 있을 경우 오류 메시지 표시
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={errorIcon} alt="Error" className="error-icon" />
                            <span style={{ marginLeft: '8px', color: 'red' }}>{classroomError}</span>
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    disabled={!isFormValid || !!gradeError || !!classroomError} // 유효성 검사에 따라 버튼 활성화/비활성화
                    style={{
                        backgroundColor: isFormValid && !gradeError && !classroomError ? '#4CAF50' : '#ccc',
                        color: isFormValid && !gradeError && !classroomError ? 'white' : '#777',
                        cursor: isFormValid && !gradeError && !classroomError ? 'pointer' : 'not-allowed'
                    }}
                >
                    제출
                </button>
            </form>
        </div>
    );
};

export default SignupSet;
