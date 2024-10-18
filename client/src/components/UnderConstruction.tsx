import React from 'react';
import { Link } from 'react-router-dom';

const UnderConstruction: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>🙏개발 중인 페이지입니다.🙏</h1>
            <p>🛠️이 페이지는 현재 개발 중입니다. 나중에 다시 방문해 주세요!🛠️</p>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
                홈으로 돌아가기
            </Link>
        </div>
    );
};

export default UnderConstruction;