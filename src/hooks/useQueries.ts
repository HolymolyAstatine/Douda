'use client';

import { useQuery } from '@tanstack/react-query';
import { api, Post, Meal, Timetable, PaginatedResponse } from '@/utils/api';

/**
 * 게시글 목록을 가져오는 훅
 * - 서버에서는 기본 데이터 로딩
 * - 클라이언트에서는 필요할 때 추가 데이터 로딩
 */
export function usePosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => api.getPosts(page, limit),
    // SSR과 관련된 설정
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
}

/**
 * 단일 게시글을 가져오는 훅
 */
export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => api.getPost(id),
    // 데이터가 없을 때만 로딩 상태 표시
    staleTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: false,
  });
}

/**
 * 특정 날짜의 급식 정보를 가져오는 훅
 */
export function useMeals(date: string) {
  return useQuery({
    queryKey: ['meals', date],
    queryFn: () => api.getMeals(date),
    staleTime: 1000 * 60 * 60, // 1시간
    refetchOnWindowFocus: false,
  });
}

/**
 * 특정 날짜의 시간표를 가져오는 훅
 */
export function useTimetable(classId: string, date: string) {
  return useQuery({
    queryKey: ['timetable', classId, date],
    queryFn: () => api.getTimetable(classId, date),
    staleTime: 1000 * 60 * 60 * 24, // 24시간
    refetchOnWindowFocus: false,
  });
}
