// client/src/components/ImageUploadPopup.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface ImageUploadPopupProps {
  onImageUpload: (url: string) => void;
  onClose: () => void;
}

const ImageUploadPopup: React.FC<ImageUploadPopupProps> = ({ onImageUpload, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // 미리보기 URL 생성
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    // JWT 토큰을 로컬 스토리지에서 가져옵니다.
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('https://localhost:8080/post_data/image_upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Uploaded Image URL:', response.data.url); // URL 확인
      onImageUpload(response.data.url); // 서버에서 반환된 이미지 URL
      onClose();
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  return (
    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />} {/* 미리보기 이미지 */}
      <button onClick={handleUpload}>Upload Image</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ImageUploadPopup;