import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['douda.kro.kr'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  typescript: {
    // 프로덕션 빌드 시 타입 체크 오류가 발생해도 빌드를 계속 진행
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // 프로덕션 빌드 시 린트 오류가 발생해도 빌드를 계속 진행
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  }
};

export default nextConfig;
