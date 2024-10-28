import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, AtomicBlockUtils, ContentState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ImageUploadPopup from './ImageUploadPopup';

interface WysiwygEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => void;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ initialTitle = '', initialContent = '', onSubmit }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState<string>(initialTitle);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [showImagePopup, setShowImagePopup] = useState<boolean>(false);

  useEffect(() => {
    setTitle(initialTitle);
    if (initialContent) {
      const contentState = stateFromHTML(initialContent);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [initialTitle, initialContent]);

  useEffect(() => {
    setIsButtonDisabled(!title.trim() || !editorState.getCurrentContent().hasText());
  }, [title, editorState]);

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleSubmit = () => {
    const content = stateToHTML(editorState.getCurrentContent());
    console.log(content);
    onSubmit(title, content);
  };

  const insertImage = (imageUrl: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageUrl });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    
    // Atomic block을 추가하여 이미지 삽입
    let newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

    setEditorState(newEditorState);
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
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'history'],
        }}
        placeholder="내용을 입력하세요"
      />
      <button onClick={() => setShowImagePopup(true)} style={{ marginTop: '10px' }}>
        이미지 추가
      </button>
      <button onClick={handleSubmit} disabled={isButtonDisabled} style={{ marginTop: '10px' }}>
        게시글 작성
      </button>
      {showImagePopup && <ImageUploadPopup onImageUpload={insertImage} onClose={() => setShowImagePopup(false)} />}
    </div>
  );
};

export default WysiwygEditor;