import React from 'react';

const Banner = () => {
  const handleClick = () => {
    window.open('https://forms.gle/FLNrnNc3reygN15H7', '_blank'); // Opens the URL in a new tab
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100px',
        backgroundImage: `url(${process.env.PUBLIC_URL}/banner_s.png)`, // URL of the image in the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: 'slide 10s infinite',
        cursor: 'pointer',
      }}
    />
  );
};

export default Banner;
