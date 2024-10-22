import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';

interface WysiwygEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => void;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ initialTitle = '', initialContent = '', onSubmit }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState<string>(initialTitle);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setIsButtonDisabled(!title.trim() || editorState.getCurrentContent().hasText() === false);
  }, [title, editorState]);

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleSubmit = () => {
    const content = editorState.getCurrentContent().getPlainText();
    onSubmit(title, content); // 제목과 내용을 onSubmit으로 전달
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
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
        }}
        placeholder="내용을 입력하세요"
      />
      <button onClick={handleSubmit} disabled={isButtonDisabled} style={{ marginTop: '10px' }}>
        게시글 작성
      </button>
    </div>
  );
};

export default WysiwygEditor;