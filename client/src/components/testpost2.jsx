import React, { useState } from 'react';
//테스트 컴포넌트

const PostCreationForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 이미지 미리보기
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 서버에 이미지 업로드
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      // 이미지 업로드 API 요청 (여기에 실제 API 엔드포인트를 사용하세요)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      imageUrl = data.url; // 서버에서 반환된 이미지 URL
    }

    // 게시글 생성 요청
    const postData = {
      title,
      content: imageUrl ? `${content} <img src="${imageUrl}" alt="uploaded" />` : content,
    };

    await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    // 폼 초기화
    setTitle('');
    setContent('');
    setImage(null);
    setImagePreview('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>게시글 작성</h2>
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100px', height: '100px' }} />}
      <button type="submit">게시글 작성</button>
    </form>
  );
};

export default PostCreationForm;
