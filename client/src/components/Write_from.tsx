import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EditorComponent from './EditorComponent';

const PostEdit: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [initialTitle, setInitialTitle] = useState<string>('');
  const [initialContent, setInitialContent] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // 글 수정 시 기존 데이터를 불러오기
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://localhost:443/post_data/${postId}`);
        setInitialTitle(response.data.title);
        setInitialContent(response.data.content);
      } catch (error) {
        console.error('글 불러오기 실패:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (title: string, content: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      await axios.put(
        `https://localhost:443/post_data/update_post/${postId}`,
        { title, content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      alert('게시글 작성 성공!');
      navigate('/board');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f4f8', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>게시글 수정</h2>
      <EditorComponent 
        initialTitle={initialTitle} 
        initialContent={initialContent} 
        onSubmit={handleSubmit} 
      />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/board')} 
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          게시판으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PostEdit;