import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';

const PostCreate: React.FC = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleSubmit = async () => {
    const content = editorState.getCurrentContent().getPlainText();
    try {
      const response = await axios.post('/post_data/create_post', {
        title,
        content,
      }, {
        headers: {
          'Authorization': `Bearer {token}`, // JWT 토큰 추가
        },
      });
      console.log(response.data);
    } catch (error: any) {
      console.error('게시글 작성 실패:', error.response.data);
    }
  };

  return (
    <div>
      <h1>게시글 작성</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
        }}
        placeholder="내용을 입력하세요"
      />
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
};

export default PostCreate;