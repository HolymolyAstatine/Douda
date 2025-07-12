'use client';

import Image from 'next/image';

export function Banner() {
  const handleClick = () => {
    window.open('https://forms.gle/FLNrnNc3reygN15H7', '_blank'); // Opens the URL in a new tab
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-[100px] cursor-pointer"
    >
      <Image 
        src="/banner_s.png"
        alt="Banner"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        priority
        unoptimized
      />
    </div>
  );
}

export default Banner;
