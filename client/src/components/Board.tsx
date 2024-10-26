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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://douda.kro.kr:443/post_data/posts', {
          params: { offset: (currentPage - 1) * postsPerPage, limit: postsPerPage },
        });
        const fetchedPosts = response.data.data;

        setPosts(fetchedPosts);
        // Check if there's a next page by comparing fetched count with the limit
        setHasNextPage(fetchedPosts.length === postsPerPage);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    document.title = "Douda - 게시판";
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
            <h2 style={{ color: '#007bff' }}>
              <Link to={`/post/${post.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                {post.title}
              </Link>
            </h2>
            <p>작성자: {post.nickname}</p>
            <small>작성일: {new Date(post.created_at).toLocaleDateString()}</small>
            <br />
            <Link to={`/post/${post.id}`} style={{ color: '#007bff', textDecoration: 'underline' }}>게시글 보기</Link>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>게시글이 없습니다.</p>
      )}
      {/* Pagination controls with current page display */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <span>현재 페이지: {currentPage}</span> {/* Display current page */}

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {currentPage >1 && (
            <button onClick={()=> setCurrentPage(1)}>첫 페이지</button>
          )}
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)}>이전 페이지</button>
          )}
          {hasNextPage && (
            <button onClick={() => setCurrentPage(currentPage + 1)}>다음 페이지</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
