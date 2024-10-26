import React, { useEffect, useState } from 'react'; // React 및 필요한 훅을 import
import { useNavigate, useParams } from 'react-router-dom'; // 라우팅 관련 훅을 import
import axios from 'axios'; // axios를 import하여 HTTP 요청을 처리
import WysiwygEditor from './WysiwygEditor'; // 별도의 WYSIWYG 에디터 컴포넌트를 import

interface PostEditProps {
  postId: number; // postId를 props로 받기 위한 인터페이스 정의
}

const PostEdit: React.FC<PostEditProps> = () => { // PostEdit 컴포넌트 정의
  const { postId } = useParams<{ postId: string }>(); // URL에서 postId 추출
  const [initialTitle, setInitialTitle] = useState<string>(''); // 게시글 제목의 초기 상태 정의
  const [initialContent, setInitialContent] = useState<string>(''); // 게시글 내용의 초기 상태 정의
  const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동을 처리

  useEffect(() => { // 컴포넌트가 마운트될 때 실행되는 useEffect 훅
    const fetchPost = async () => { // 게시글을 가져오는 비동기 함수 정의
      try {
        const response = await axios.get(`https://douda.kro.kr/post_data/get-posts/${postId}`); // 게시글 데이터 요청
        const fetchedPost = response.data.data; // 응답에서 게시글 데이터 추출
        setInitialTitle(fetchedPost.title); // 제목 상태 업데이트
        setInitialContent(fetchedPost.content); // 내용 상태 업데이트
      } catch (error) {
        console.error('글 불러오기 실패:', error); // 오류 발생 시 콘솔에 로그 출력
      }
    };

    fetchPost(); // 게시글 가져오기 함수 호출
  }, [postId]); // postId가 변경될 때마다 useEffect가 실행됨

  const handleSubmit = async (title: string, content: string) => { // 게시글 수정 제출 처리 함수
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) { // 토큰이 없으면 경고 메시지 출력
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      return; // 함수 종료
    }

    try {
      await axios.put( // 게시글 수정 요청
        `https://douda.kro.kr/post_data/update_post/${postId}`,
        { title, content }, // 수정할 제목과 내용을 포함
        {
          headers: {
            'Content-Type': 'application/json', // 요청 헤더 설정
            Authorization: `Bearer ${token}`, // 인증 헤더 설정
          },
        }
      );

      alert('게시글 수정 성공!'); // 수정 성공 메시지 출력
      navigate('/board'); // 수정 후 게시판으로 이동
    } catch (error) {
      console.error('게시글 수정 실패:', error); // 오류 발생 시 콘솔에 로그 출력
      alert('게시글 수정 중 오류가 발생했습니다.'); // 오류 메시지 출력
    }
  };

  return (
    <WysiwygEditor // WYSIWYG 에디터 컴포넌트 렌더링
      initialTitle={initialTitle} // 초기 제목 전달
      initialContent={initialContent} // 초기 내용 전달
      onSubmit={handleSubmit} // 제출 핸들러 전달
    />
  );
};

export default PostEdit; // PostEdit 컴포넌트를 내보냄