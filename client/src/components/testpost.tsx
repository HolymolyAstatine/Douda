import React, { useState } from 'react';
import axios from 'axios';
// 테스트 컴포넌트

function App() {
  const [image, setImage] = useState<File | null>(null); // File 타입 지정
  const [result, setResult] = useState<string>(''); // string 타입으로 변경

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // 파일이 있는 경우에만 상태 업데이트
    }
  };

  const handleUpload = async () => {
    try {
      if (!image) {
        alert('이미지를 선택해주세요.');
        return;
      }

      // 로컬스토리지에서 JWT 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post('https://localhost:8080/post_data/file_upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
        },
      });

      setResult(`업로드 성공: ${response.data.url}`);
    } catch (error) {
      console.error('업로드 실패:', error);
      setResult('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>사진 업로드</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>업로드</button>
      <div>{result}</div>
    </div>
  );
}

export default App;
