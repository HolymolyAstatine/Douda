import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // useParams 추가

interface EditPostProps {
  postId: number; // 수정할 게시글의 ID
}

const EditPost: React.FC<EditPostProps> = () => {
  const { postId } = useParams<{ postId: string }>(); // URL에서 postId 가져오기
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post_data/get-posts/${postId}`, {
          headers: {
            'Authorization': `Bearer {token}`, // JWT 토큰 추가
          },
        });
        const { title, content } = response.data.data; // 기존 게시글 데이터 가져오기
        setTitle(title);
        setEditorState(EditorState.createWithContent(ContentState.createFromText(content)));
      } catch (error: any) {
        console.error('게시글을 가져오는 데 실패했습니다:', error.response.data);
      }
    };
  
    fetchPost();
  }, [postId]);

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleSubmit = async () => {
    const content = editorState.getCurrentContent().getPlainText();
    try {
      const response = await axios.put(`/post_data/update_post/${postId}`, {
        title,
        content,
      }, {
        headers: {
          'Authorization': `Bearer {token}`, // JWT 토큰 추가
        },
      });
      console.log(response.data);
    } catch (error: any) {
      console.error('게시글 수정 실패:', error.response.data);
    }
  };

  return (
    <div>
      <h1>게시글 수정</h1>
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
      <button onClick={handleSubmit}>수정</button>
    </div>
  );
};

export default EditPost;