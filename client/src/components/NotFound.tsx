// client/src/components/NotFound.tsx
//404 Not Found 컴포넌트
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>We couldn't find the page you were looking for.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default NotFound;
