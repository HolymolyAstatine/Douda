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
        const response = await axios.get(`https://localhost:8080/post_data/${postId}`);
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
        `https://localhost:8080/post_data/update_post/${postId}`,
        { title, content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      alert('게시글 수정 성공!');
      navigate('/board');
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <EditorComponent 
      initialTitle={initialTitle} 
      initialContent={initialContent} 
      onSubmit={handleSubmit} 
    />
  );
};

export default PostEdit;
