import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditorComponent from './WysiwygEditor';

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Douda - 게시글 작성";
  }, []);
  const handleSubmit = async (title: string, content: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      await axios.post(
        'https://localhost:8080/post_data/create_post',
        { title, content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      alert('게시글 작성 성공!');
      navigate('/board'); // 게시판으로 리다이렉트
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return <EditorComponent onSubmit={handleSubmit} />; // EditorComponent에 onSubmit prop 전달
};

export default PostCreate;