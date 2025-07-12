'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  useEffect(() => {
    document.title = "Douda - 404 not found";
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <Image 
        src="/error_exclamation_mark.svg" 
        alt="Error" 
        width={80} 
        height={80} 
        className="mb-6"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-600 mb-6 max-w-md">요청하신 페이지를 찾을 수 없습니다. 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.</p>
      <Link href="/">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          홈으로 돌아가기
        </button>
      </Link>
    </div>
  );
}
