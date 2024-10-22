import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  like_count: number;
  dislike_count: number;
  comment_count: number;
}

interface Comment {
  id: number;
  content: string;
  author_id: number;
  created_at: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 게시글 ID 추출
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>(''); 
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // 수정 중인 댓글 ID
  const [editedCommentContent, setEditedCommentContent] = useState<string>(''); // 수정할 댓글 내용
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://localhost:8080/post_data/get-posts/${id}`);
        const fetchedPost = response.data.data;
        setPost(fetchedPost);
        setLikeCount(fetchedPost.like_count);
        setDislikeCount(fetchedPost.dislike_count);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://localhost:8080/post_data/get-posts/${id}/comments`);
        setComments(response.data.data);
      } catch (error) {
        console.error('댓글 불러오기 실패:', error);
      }
    };

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userResponse = await axios.get('https://localhost:8080/user_data/auth/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUserId(userResponse.data.id);
        } catch (error) {
          console.error('사용자 정보 불러오기 실패:', error);
        }
      }
    };

    fetchPost();
    fetchComments();
    fetchCurrentUser();
  }, [id]);

  const handleDeletePost = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://localhost:8080/post_data/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('게시글이 삭제되었습니다.');
        navigate('/'); // 게시글 삭제 후 메인 페이지로 이동
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
      }
    }
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLike = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }
    try {
      await axios.post(`https://localhost:8080/post_data/posts/${id}/like`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLikeCount(likeCount + 1); // 좋아요 수 증가
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  // 싫어요 버튼 클릭 핸들러
  const handleDislike = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }
    try {
      await axios.post(`https://localhost:8080/post_data/posts/${id}/dislike`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDislikeCount(dislikeCount + 1); // 싫어요 수 증가
    } catch (error) {
      console.error('싫어요 실패:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://localhost:8080/post_data/posts/${id}/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }
  };

  // 댓글 수정 모드로 전환
  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentContent('');
  };

  // 댓글 수정 저장
  const handleSaveEditComment = async (commentId: number) => {
    if (!editedCommentContent.trim()) {
      return alert('댓글 내용을 입력해주세요.');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://localhost:8080/post_data/posts/${id}/comments/${commentId}`,
        { content: editedCommentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editedCommentContent } : comment
        )
      );
      setEditingCommentId(null); // 수정 모드 해제
      setEditedCommentContent('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      return alert('댓글을 작성해주세요!');
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
        return;
      }

      await axios.post(
        `https://localhost:8080/post_data/posts/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      const updatedComments = await axios.get(`https://localhost:8080/post_data/posts/${id}/comments`);
      setComments(updatedComments.data.data);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  if (!post) {
    return <div>게시글을 불러오는 중입니다...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <div>
        <p>작성자 ID: {post.author_id}</p>
        <p>작성일: {new Date(post.created_at).toLocaleDateString()}</p>
        <p>수정일: {new Date(post.updated_at).toLocaleDateString()}</p>
      </div>

      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <div>
        <button onClick={handleLike}>좋아요 ({likeCount})</button>
        <button onClick={handleDislike}>싫어요 ({dislikeCount})</button>
      </div>

      {currentUserId === post.author_id && (
        <div>
          <button onClick={() => navigate(`/edit/${post.id}`)}>수정</button>
          <button onClick={handleDeletePost}>삭제</button>
        </div>
      )}

      <h2>댓글 ({comments.length})</h2>
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                    style={{ width: '100%', height: '80px', marginBottom: '10px' }}
                  />
                  <button onClick={() => handleSaveEditComment(comment.id)}>저장</button>
                  <button onClick={handleCancelEdit}>취소</button>
                </div>
              ) : (
                <div>
                  <p>{comment.content}</p>
                  <small>작성자 ID: {comment.author_id}</small>
                  <br />
                  <small>작성일: {new Date(comment.created_at).toLocaleDateString()}</small>

                  {currentUserId === comment.author_id && (
                    <div>
                      <button onClick={() => handleEditComment(comment)}>수정</button>
                      <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>

      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성하세요"
          style={{ width: '100%', height: '100px', marginBottom: '10px' }}
        />
        <button onClick={handleCommentSubmit}>댓글 작성</button>
      </div>
    </div>
  );
};

export default PostDetail;