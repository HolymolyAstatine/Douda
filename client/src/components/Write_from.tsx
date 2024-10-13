import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostEditor: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [isContentEmpty, setIsContentEmpty] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 이미지 선택 핸들러
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // 서버에 이미지 업로드 후 URL을 반환 받는 함수
  const uploadImage = async (file: File): Promise<string | undefined> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('https://localhost:8080/post_data/file_upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.url;
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  // 이미지 업로드 및 본문에 이미지 삽입 함수
  const handleImageUpload = async () => {
    if (!image) {
      alert('이미지를 선택해주세요.');
      return;
    }

    const imageUrl = await uploadImage(image);

    if (imageUrl && editorRef.current) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.alt = 'Uploaded Image';
      imgElement.style.maxWidth = '100%';

      range.insertNode(imgElement);
      range.collapse(false);
      setImage(null);
    }
  };

  // 본문에 내용이 있는지 확인
  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setIsContentEmpty(content === '' || content === '<br>');
    }
  };

  // 제목과 본문 내용이 있을 때 버튼 활성화
  useEffect(() => {
    setIsButtonDisabled(!title.trim() || isContentEmpty);
  }, [title, isContentEmpty]);

  // 게시글 작성 핸들러
  const handleSubmit = async () => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:8080/post_data/create_post',
        { title, content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      alert('게시글 작성 성공!');
      navigate('/board'); // 게시판 페이지로 네비게이트
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '18px', marginBottom: '10px' }}
      />
      
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        style={{
          minHeight: '300px',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px',
          color: isContentEmpty ? '#999' : '#000',
        }}
      >
        {isContentEmpty ? '본문을 작성하세요' : null}
      </div>
      
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>이미지 업로드</button>

      <button onClick={handleSubmit} disabled={isButtonDisabled} style={{ marginTop: '10px' }}>
        게시글 작성
      </button>
    </div>
  );
};

export default PostEditor;
