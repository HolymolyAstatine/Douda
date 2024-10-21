import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const PostCreate = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [title, setTitle] = useState('');
  // Bold, Italic 등 텍스트 스타일을 적용하는 함수
  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Bold 버튼 클릭 시 텍스트를 Bold로 변환
  const toggleBold = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  // 게시글 저장 함수
  const handleSubmit = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText(); // 에디터의 내용을 가져옴

    // 서버로 전송하는 API 호출 (예시)
    fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title, // 게시글 제목
        content: plainText, // 게시글 내용 (plain text 형식)
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('게시글이 성공적으로 전송되었습니다.', data);
        // 성공적으로 작성된 후 로직 추가 (예: 목록으로 이동)
      })
      .catch((error) => {
        console.error('게시글 전송 중 오류가 발생했습니다.', error);
      });
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '18px' }}
      />
      <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '300px' }}>
        <button onClick={toggleBold} style={{ marginBottom: '10px', cursor: 'pointer' }}>
          Bold
        </button>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}
      >
        게시글 저장
      </button>
    </div>
  );
};

export default PostCreate;
