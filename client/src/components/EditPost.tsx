import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import axios from 'axios';

const EditPost: React.FC = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://localhost:8080/post_data/posts/${id}`);
        const { title, content } = response.data.data;
        setTitle(title);
        const contentState = convertFromRaw(JSON.parse(content));
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error('Failed to load the post:', error);
        alert('게시글을 불러오는 데 실패했습니다.');
      }
    };

    fetchPost();
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = JSON.stringify(convertToRaw(contentState));

    try {
      const response = await axios.put(`https://localhost:8080/post_data/update_post/${id}`, {
        title,
        content: contentRaw,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Post updated:', response.data);
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Failed to update the post:', error);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>게시글 수정</h1>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        placeholder="내용을 입력하세요"
      />
      <button onClick={handleSubmit} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
        게시글 수정
      </button>
    </div>
  );
};

export default EditPost;