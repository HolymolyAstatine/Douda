import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const WysiwygEditor: React.FC = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleSubmit = () => {
    // 에디터 내용 가져오기
    const content = editorState.getCurrentContent().getPlainText();
    console.log(content); // 예시: 콘솔에 내용 출력
  };

  return (
    <div>
      <h1>게시글 작성</h1>
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

export default WysiwygEditor;