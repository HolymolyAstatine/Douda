// client/src/components/NotFound.tsx
//404 Not Found 컴포넌트
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    document.title = "Douda - 404 not found";
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>We couldn't find the page you were looking for.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default NotFound;