import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import WysiwygEditor from './WysiwygEditor'; // 별도의 에디터 컴포넌트가 있다고 가정

interface PostEditProps {
  postId: number; // postId를 props로 받기 위한 인터페이스 정의
}

const PostEdit: React.FC<PostEditProps> = () => {
  const { postId } = useParams<{ postId: string }>();
  const [initialTitle, setInitialTitle] = useState<string>('');
  const [initialContent, setInitialContent] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://localhost:8080/post_data/get-posts/${postId}`);
        const fetchedPost = response.data.data;
        setInitialTitle(fetchedPost.title);
        setInitialContent(fetchedPost.content);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('게시글 수정 성공!');
      navigate('/board'); // 수정 후 게시판으로 이동
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <WysiwygEditor
      initialTitle={initialTitle}
      initialContent={initialContent}
      onSubmit={handleSubmit}
    />
  );
};

export default PostEdit;