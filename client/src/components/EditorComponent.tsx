import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface EditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => void;
}

const EditorComponent: React.FC<EditorProps> = ({ initialTitle = '', initialContent = '', onSubmit }) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [isContentEmpty, setIsContentEmpty] = useState<boolean>(!initialContent);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent; // 초기 본문 설정
    }
  }, [initialContent]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;

      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFileData(file);
      } else {
        setImagePreview(null);
        setFileData(file);
      }
    }
  };

  const uploadFile = async (file: File): Promise<string | undefined> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

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

  const handleFileUpload = async () => {
    if (!fileData) {
      alert('파일을 선택해주세요.');
      return;
    }

    const fileUrl = await uploadFile(fileData);

    if (fileUrl && editorRef.current) {
      const content = editorRef.current.innerHTML.trim();
      if (!window.getSelection()?.rangeCount || content === '' || content === '<br>') {
        editorRef.current.innerHTML = ''; // 본문이 비었으면 기본 텍스트 제거

        if (fileData.type.startsWith('image/')) {
          editorRef.current.innerHTML = `<img src="${fileUrl}" alt="Uploaded Image" style="max-width: 100%;" />`;
        } else {
          editorRef.current.innerHTML = `<a href="${fileUrl}" style="display: block;">${fileData.name}</a>`;
        }
      } else {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        if (fileData.type.startsWith('image/')) {
          const imgElement = document.createElement('img');
          imgElement.src = fileUrl;
          imgElement.alt = 'Uploaded Image';
          imgElement.style.maxWidth = '100%';
          range.insertNode(imgElement);
        } else {
          const fileLink = document.createElement('a');
          fileLink.href = fileUrl;
          fileLink.textContent = fileData.name;
          fileLink.style.display = 'block';
          range.insertNode(fileLink);
        }

        range.collapse(false);
      }

      setFileData(null);
      setImagePreview(null);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setIsContentEmpty(content === '' || content === '<br>');
    }
  };

  useEffect(() => {
    setIsButtonDisabled(!title.trim() || isContentEmpty);
  }, [title, isContentEmpty]);

  const handleSubmit = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onSubmit(title, content);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '12px', fontSize: '16px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
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
          backgroundColor: '#f9f9f9',
          color: isContentEmpty ? '#999' : '#000',
        }}
      >
        {isContentEmpty ? '본문을 작성하세요' : null}
      </div>

      <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
      
      {imagePreview ? (
        <div>
          <p>이미지 미리보기:</p>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginBottom: '10px', borderRadius: '5px' }} />
        </div>
      ) : fileData ? (
        <div>
          <p>파일: {fileData.name}</p>
          <button disabled style={{ padding: '5px 10px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px' }}>다운로드 불가</button>
        </div>
      ) : null}

      <button onClick={handleFileUpload} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
        파일 업로드
      </button>

      <button onClick={handleSubmit} disabled={isButtonDisabled} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        게시글 작성
      </button>
    </div>
  );
};

export default EditorComponent;