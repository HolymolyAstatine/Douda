import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 라우팅을 위해 사용

interface Post {
  id: number;
  title: string;
  author_id: number;
  created_at: string;
}

const Board: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // 서버로부터 게시글 목록을 가져오는 함수
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://localhost:8080/post_data/posts');
        setPosts(response.data.data); // 게시글 목록 설정
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    fetchPosts(); // 컴포넌트가 렌더링될 때 게시글 목록을 가져옴
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>게시판</h1>
      <Link to="/ww">
        <button style={{ margin: '10px 0', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          글 작성하기
        </button>
      </Link>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
            <h2 style={{ color: '#007bff' }}>{post.title}</h2>
            <p>작성자 ID: {post.author_id}</p>
            <small>작성일: {new Date(post.created_at).toLocaleDateString()}</small>
            <br />
            <Link to={`/post/${post.id}`} style={{ color: '#007bff', textDecoration: 'underline' }}>게시글 보기</Link> {/* 상세 페이지로 이동 */}
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>게시글이 없습니다.</p>
      )}
    </div>
  );
};

export default Board;