import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditorComponent from './EditorComponent';

const PostCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (title: string, content: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      await axios.post(
        'https://douda.kro.kr:443/post_data/create_post',
        { title, content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      alert('게시글 작성 성공!');
      navigate('/board'); // 게시글 작성 후 게시판으로 이동
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: '#f0f4f8', 
      borderRadius: '10px', 
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
      maxWidth: '600px', 
      margin: '0 auto' 
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#333', 
        marginBottom: '20px' 
      }}>게시글 작성</h2>
      <EditorComponent onSubmit={handleSubmit} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/board')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            transition: 'background-color 0.3s' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          게시판으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PostCreate;