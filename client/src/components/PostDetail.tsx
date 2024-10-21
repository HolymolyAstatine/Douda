import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PostDetailProps {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  nickname: string;
}

const PostDetail: React.FC = () => {
  const [post, setPost] = useState<PostDetailProps | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserID = localStorage.getItem('userID'); // 현재 로그인한 사용자의 ID를 로컬 스토리지에서 가져옵니다.

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://localhost:8080/post_data/posts/${id}`);
        setPost(response.data.data);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        alert('게시글을 불러올 수 없습니다.');
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://localhost:8080/post_data/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p>작성자: {post.nickname}</p>
      <small>작성일: {new Date(post.created_at).toLocaleDateString()}</small>
      {currentUserID && currentUserID === post.author_id.toString() && ( // 수정 및 삭제 버튼은 작성자만 볼 수 있습니다.
        <div>
          <Link to={`/edit/${id}`}>
            <button style={{ marginRight: '10px' }}>수정</button>
          </Link>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;