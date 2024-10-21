import React, { useState } from 'react';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = JSON.stringify(convertToRaw(contentState));

    try {
      const response = await axios.post('https://localhost:8080/post_data/create_post', {
        title: title,
        content: contentRaw,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Post created:', response.data);
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('Post creation failed:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>게시글 작성</h1>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="내용을 입력하세요"
        />
      </div>
      <button onClick={handleSubmit} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
        게시글 저장
      </button>
    </div>
  );
};

export default CreatePost;