/**
 * API 호출을 위한 유틸리티 함수
 */

// 기본 API URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

/**
 * API 요청을 위한 기본 fetch 함수
 */
export async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 토큰이 있으면 추가
    ...getAuthHeader(),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // API 에러 처리
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API 요청 실패 (${response.status})`);
  }

  // 응답이 없는 경우 (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * 인증 헤더 가져오기
 */
function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * API 관련 타입 정의
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

/**
 * 페이지네이션을 위한 타입
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 예시용 API 호출 함수들
 */
export const api = {
  // 게시글 목록 가져오기
  getPosts: (page = 1, limit = 10) => 
    fetchApi<PaginatedResponse<Post>>(`/posts?page=${page}&limit=${limit}`),
  
  // 단일 게시글 가져오기
  getPost: (id: number) => 
    fetchApi<Post>(`/posts/${id}`),
  
  // 급식 정보 가져오기
  getMeals: (date: string) => 
    fetchApi<Meal[]>(`/meals?date=${date}`),
  
  // 시간표 정보 가져오기
  getTimetable: (classId: string, date: string) => 
    fetchApi<Timetable>(`/timetable?classId=${classId}&date=${date}`),
};

/**
 * 데이터 모델 타입 정의 예시
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  menu: string[];
  nutritionalInfo?: string;
}

export interface Timetable {
  date: string;
  classId: string;
  schedule: {
    period: number;
    subject: string;
    teacher?: string;
    room?: string;
  }[];
}
