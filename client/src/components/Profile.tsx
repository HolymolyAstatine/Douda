// client/src/components/Profile.tsx
// 사용자 프로파일 데이터를 관리하는 프로파일 컴포넌트
import React, { useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import ProfileEdit from './ProfileEdit';

interface ProfileProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>; // 로그인 상태를 관리하는 Prop
}

const Profile: React.FC<ProfileProps> = ({ setIsLoggedIn }) => {
  const [profileData, setProfileData] = useState<any>(null); // 프로파일 데이터를 저장할 상태
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 토글 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 계정 삭제 모달 표시 상태
  const [confirmDelete, setConfirmDelete] = useState(false); // 삭제 확인 체크박스 상태
  const navigate = useNavigate(); // 프로그래밍적으로 네비게이션하기 위한 훅

  // React Query를 사용하여 프로파일 데이터 가져오기
  const { data, error, isLoading } = useQuery('profile', () => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      navigate('/'); // 토큰이 없으면 로그인 페이지로 리디렉션
      throw new Error('No token found');
    }
    return axios
      .get('https://douda.kro.kr:443/profile-server', {
        headers: { Authorization: `Bearer ${token}` }, // Authorization 헤더 설정
        withCredentials: true,
      })
      .catch((err) => { throw err }); // 오류 처리
  }, {
    enabled: !!localStorage.getItem('token'), // 토큰이 있을 때만 쿼리 활성화
    retry: (failureCount, error) => {
      if (error.response?.status === 401) {
        return false; // 401 오류 발생 시 재시도 중지
      }
      return failureCount < 3; // 다른 오류에 대해 최대 3번 재시도
    },
    onSuccess: (response) => {
      if (response.data.code === 401) {
        navigate('/'); // 권한 없음 시 리디렉션
      }
      setProfileData(response.data.data); // 성공 시 프로파일 데이터 설정
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해 주세요.'); // 세션 만료 시 알림
        localStorage.removeItem('token'); // 토큰 제거
        setIsLoggedIn(false); // 로그인 상태 업데이트
        navigate('/'); // 로그인 페이지로 리디렉션
      }
    },
  });

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 제거
    setIsLoggedIn(false); // 로그인 상태 업데이트
    navigate('/'); // 로그인 페이지로 리디렉션
  };

  // 계정 삭제 핸들러
  const handleDeleteAccount = () => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    if (!token) {
      alert('토큰이 없습니다.'); // 토큰이 없으면 알림
      navigate('/'); // 로그인 페이지로 리디렉션
      return;
    }

    axios
      .delete('https://douda.kro.kr:443/user_data/delete_account', {
        headers: { Authorization: `Bearer ${token}` }, // Authorization 헤더 설정
        withCredentials: true,
      })
      .then(() => {
        alert('계정이 성공적으로 삭제되었습니다.'); // 삭제 성공 시 알림
        localStorage.removeItem('token'); // 토큰 제거
        setIsLoggedIn(false); // 로그인 상태 업데이트
        navigate('/'); // 로그인 페이지로 리디렉션
      })
      .catch((err) => {
        alert('계정 삭제에 실패했습니다.'); // 실패 시 알림
      });
  };

  // 편집 모드 닫기
  const closeEdit = () => {
    setIsEditing(false); // 편집 상태 토글
  };

  // 로딩 상태
  if (isLoading) return <div style={{ textAlign: 'center' }}>Loading...</div>;
  // 오류 처리
  if (error) return <div style={{ textAlign: 'center' }}>프로필을 가져오는 데 오류가 발생했습니다.</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>프로필</h1>
      {/* 프로파일 정보 표시 */}
      <div style={{ marginBottom: '20px' }}>
        <p><strong>ID:</strong> {profileData?.id}</p>
        <p><strong>Email:</strong> {profileData?.email}</p>
        <p><strong>Nickname:</strong> {profileData?.nickname}</p>
        <p><strong>School:</strong> {profileData?.school ? profileData.school : '없음'}</p>
        <p><strong>Grade:</strong> {profileData?.grade ? profileData.grade : '없음'}</p>
        <p><strong>Classroom:</strong> {profileData?.classroom ? profileData.classroom : '없음'}</p>
      </div>
      {/* 프로파일 편집 버튼 */}
      <button onClick={() => setIsEditing(true)} style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
        프로필 편집
      </button>
      {/* 로그아웃 버튼 */}
      <button onClick={handleLogout} style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>
        로그아웃
      </button>

      {/* 계정 삭제 모달 표시 버튼 */}
      <button onClick={() => setShowDeleteModal(true)} style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}>
        계정 삭제
      </button>

      {/* 계정 삭제 모달 */}
      {showDeleteModal && (
        <div className="modal" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginTop: '20px' }}>
          <h2>정말로 계정을 삭제하시겠습니까?</h2>
          <p>삭제 후 30일 동안 다시 가입할 수 없습니다.</p>
          <label>
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)} // 확인 상태 업데이트
            />
            결과를 이해합니다.
          </label>
          <button
            style={{
              backgroundColor: confirmDelete ? 'red' : 'grey', // 확인 상태에 따라 색상 변경
              cursor: confirmDelete ? 'pointer' : 'not-allowed',
              padding: '10px 15px',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px',
            }}
            onClick={handleDeleteAccount} // 계정 삭제 트리거
            disabled={!confirmDelete} // 확인되지 않으면 버튼 비활성화
          >
            계정 삭제
          </button>
          <button onClick={() => setShowDeleteModal(false)} style={{ marginLeft: '10px', padding: '10px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px' }}>
            취소
          </button> {/* 모달 닫기 */}
        </div>
      )}

      {/* 프로파일 편집 컴포넌트 */}
      {isEditing && <ProfileEdit profileData={profileData} onClose={closeEdit} />}
    </div>
  );
};

export default Profile;