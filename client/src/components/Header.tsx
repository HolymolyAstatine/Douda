'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰 유효성 검사 (옵션)
      setIsLoggedIn(true);
    }
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header>
      {/* 네비게이션 바 */}
      <nav className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <Image src="/logo512.png" alt="Logo" width={40} height={40} className="mr-2" />
              <h2 className="text-xl font-bold text-gray-800">DOUDA</h2>
            </div>
          </Link>
        </div>
        
        {/* 모바일용 햄버거 메뉴 버튼 */}
        <button 
          onClick={toggleNav} 
          className="md:hidden bg-transparent border-none cursor-pointer"
          aria-label="Toggle navigation"
        >
          <div className="w-7 h-0.5 bg-blue-500 my-1.5"></div>
          <div className="w-7 h-0.5 bg-blue-500 my-1.5"></div>
          <div className="w-7 h-0.5 bg-blue-500 my-1.5"></div>
        </button>

        {/* 데스크톱용 네비게이션 링크 */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/" className="text-blue-500 hover:text-blue-700">홈</Link>
          </li>
          <li>
            <Link href="/board" className="text-blue-500 hover:text-blue-700">게시판</Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link href="/profile" className="text-blue-500 hover:text-blue-700">프로필</Link>
              </li>
              <li>
                <Link href="/meals" className="text-blue-500 hover:text-blue-700">급식표</Link>
              </li>
              <li>
                <Link href="/timetable" className="text-blue-500 hover:text-blue-700">학급 시간표</Link>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <Link href="/login" className="text-blue-500 hover:text-blue-700">로그인</Link>
              </li>
              <li>
                <Link href="/signup" className="text-blue-500 hover:text-blue-700">회원가입</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* 모바일용 네비게이션 메뉴 (토글) */}
      {isNavOpen && (
        <ul className="md:hidden py-2 px-4 bg-gray-50 border-b border-gray-200">
          <li className="py-2">
            <Link href="/" className="text-blue-500 hover:text-blue-700">홈</Link>
          </li>
          <li className="py-2">
            <Link href="/board" className="text-blue-500 hover:text-blue-700">게시판</Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="py-2">
                <Link href="/profile" className="text-blue-500 hover:text-blue-700">프로필</Link>
              </li>
              <li className="py-2">
                <Link href="/meals" className="text-blue-500 hover:text-blue-700">급식표</Link>
              </li>
              <li className="py-2">
                <Link href="/timetable" className="text-blue-500 hover:text-blue-700">학급 시간표</Link>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li className="py-2">
                <Link href="/login" className="text-blue-500 hover:text-blue-700">로그인</Link>
              </li>
              <li className="py-2">
                <Link href="/signup" className="text-blue-500 hover:text-blue-700">회원가입</Link>
              </li>
            </>
          )}
        </ul>
      )}
    </header>
  );
}
