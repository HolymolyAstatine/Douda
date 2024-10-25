import React from 'react';

const Banner = () => {
  const handleClick = () => {
    window.location.href = 'https://forms.gle/FLNrnNc3reygN15H7'; // 이동할 URL
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100px',
        backgroundImage: `url(${process.env.PUBLIC_URL}/banner_s.png)`, // public 폴더에 있는 이미지 URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: 'slide 10s infinite',
        cursor: 'pointer',
      }}
    />
  );
};

export default Banner;