'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  author_id: number;
  created_at: string;
  nickname: string;
}

export default function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const postsPerPage = 20;
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    // 게시글 가져오기
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://douda.kro.kr:443/post_data/posts', {
          params: { offset: (currentPage - 1) * postsPerPage, limit: postsPerPage },
        });
        const fetchedPosts = response.data.data;

        setPosts(fetchedPosts);
        // 다음 페이지가 있는지 확인
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
    <div className="p-5 bg-gray-50">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">게시판</h1>
      
      {isLoggedIn && (
        <Link href="/create">
          <button className="my-2 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            글 작성하기
          </button>
        </Link>
      )}
      
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 p-4 mb-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-blue-600">
                <Link href={`/post/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-700">작성자: {post.nickname}</p>
              <p className="text-sm text-gray-500">작성일: {new Date(post.created_at).toLocaleDateString()}</p>
              <Link href={`/post/${post.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
                게시글 보기
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">게시글이 없습니다.</p>
      )}
      
      {/* 페이지네이션 컨트롤 */}
      <div className="flex flex-col items-center mt-6">
        <span className="mb-2">현재 페이지: {currentPage}</span>
        
        <div className="flex gap-3">
          {currentPage > 1 && (
            <button 
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              첫 페이지
            </button>
          )}
          
          {currentPage > 1 && (
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              이전 페이지
            </button>
          )}
          
          {hasNextPage && (
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              다음 페이지
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
