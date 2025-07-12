// React Query 프로바이더 설정
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 오류 시 자동 재시도 비활성화
            retry: false,
            // 기본 스토킹 시간 (ms)
            staleTime: 60 * 1000,
            // 캐시 유지 시간 (ms)
            gcTime: 5 * 60 * 1000,
            // 윈도우 포커스시 자동 리페칭 비활성화
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
