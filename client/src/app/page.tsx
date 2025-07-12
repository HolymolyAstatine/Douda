'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Banner from '@/components/Banner';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleBanner = () => {
    setIsBannerVisible(prevState => !prevState);
  };

  return (
    <div>
      <div className="p-5 text-center bg-gray-50 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">도우다 - Douda</h1>
        
        {isLoggedIn ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">도우다를 사용해주셔서 감사합니다!</h2>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/timetable">
                <button className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  학급시간표로 이동
                </button>
              </Link>
              
              <Link href="/meals">
                <button className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  오늘의 식단으로 이동
                </button>
              </Link>
              
              <Link href="/board">
                <button className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                  게시판으로 이동
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <nav className="mt-5">
            <Link href="/login">
              <button className="px-5 py-2 mx-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                Log in
              </button>
            </Link>
            
            <Link href="/signup">
              <button className="px-5 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Sign up
              </button>
            </Link>
          </nav>
        )}
      </div>
      
      {/* 배너 토글 버튼 */}
      <div className="text-center my-4">
        <button 
          onClick={toggleBanner} 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          {isBannerVisible ? '배너 숨기기' : '배너 보이기'}
        </button>
      </div>
      
      {/* 배너 영역 */}
      {isBannerVisible && <Banner />}
    </div>
  );
}
