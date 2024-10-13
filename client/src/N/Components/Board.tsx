// client/src/nice/Components/Board.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 800px;
`;

const PostList = styled.div`
  width: 100%;
  margin: 20px 0;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PostItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #dbdbdb;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

const PostTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #262626;
`;

const PostContent = styled.p`
  margin: 5px 0 0;
  color: #666666;
`;

const PostDetail = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CommentList = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #dbdbdb;
`;

const CommentItem = styled.div`
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #0095f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #007bb5;
  }
`;

const Board: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleAddPost = () => {
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    const newPost = {
      id: Date.now(),
      title: newPostTitle,
      content: newPostContent,
      comments: [],
    };
    setPosts([...posts, newPost]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '' || !selectedPost) {
      alert('댓글을 입력하세요.');
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewComment(''); // 댓글 입력란 비우기
    setSelectedPost({ ...selectedPost, comments: [...selectedPost.comments, newComment] }); // 선택된 게시글 업데이트
  };

  return (
    <BoardContainer>
      <h2>게시판</h2>
      <Input
        type="text"
        placeholder="제목을 입력하세요"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="내용을 입력하세요"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <Button onClick={handleAddPost}>게시글 추가</Button>

      <PostList>
        {posts.length === 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          posts.map(post => (
            <PostItem key={post.id} onClick={() => handlePostClick(post)}>
              <PostTitle>{post.title}</PostTitle>
              <PostContent>{post.content}</PostContent>
            </PostItem>
          ))
        )}
      </PostList>

      {selectedPost && (
        <PostDetail>
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.content}</p>
          <CommentList>
            {selectedPost.comments.length === 0 ? (
              <p>댓글이 없습니다.</p>
            ) : (
              selectedPost.comments.map((comment: any, index: any) => (
                <CommentItem key={index}>{comment}</CommentItem>
              ))
            )}
          </CommentList>
          <Input
            type="text"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>댓글 달기</Button>
        </PostDetail>
      )}
    </BoardContainer>
  );
};

export default Board;