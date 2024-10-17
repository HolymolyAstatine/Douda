import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  author_id: number;
  created_at: string;
  nickname: string;
}

interface BoardProps {
  isLoggedIn: boolean;
}

const Board: React.FC<BoardProps> = ({ isLoggedIn }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://localhost:443/post_data/posts');
        // 게시글을 역순으로 배열
        setPosts(response.data.data.reverse());
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>게시판</h1>
      {isLoggedIn ? (
        <Link to="/create">
          <button style={{ margin: '10px 0', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
            글 작성하기
          </button>
        </Link>
      ) : null}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
            <h2 style={{ color: '#007bff' }}>{post.title}</h2>
            <p>작성자: {post.nickname}</p>
            <small>작성일: {new Date(post.created_at).toLocaleDateString()}</small>
            <br />
            <Link to={`/post/${post.id}`} style={{ color: '#007bff', textDecoration: 'underline' }}>게시글 보기</Link>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>게시글이 없습니다.</p>
      )}
    </div>
  );
};

export default Board;