'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="p-5 bg-gray-100 text-center mt-auto">
      <p className="m-0">© 2024 DOUDA team. All rights reserved.</p>
      <p className="m-0">
        Created by 
        <a 
          href="https://github.com/hafskjfha" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mx-1 text-blue-500 hover:text-blue-700"
        >
          Teawon Jung
        </a> 
        & 
        <a 
          href="https://github.com/HolymolyAstatine" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mx-1 text-blue-500 hover:text-blue-700"
        >
          Jangho Yoon
        </a>
      </p>
      <p className="m-0">
        <a 
          href='https://github.com/HolymolyAstatine/Douda' 
          target="_blank" 
          rel="noopener noreferrer"
          className="mx-1 text-blue-500 hover:text-blue-700"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
