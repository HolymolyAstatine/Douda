# Douda 프로젝트

도우다 - 학교 관련 정보 제공 및 커뮤니티 웹 애플리케이션

## 프로젝트 구조

```
Douda/
├── LICENSE                # MIT 라이선스
├── client/               # Next.js 기반 프론트엔드
│   ├── public/           # 정적 파일
│   ├── src/              # 소스 코드
│   └── ...               # Next.js 관련 파일들
├── docs/                 # 프로젝트 문서
│   ├── readme.md         # 프로젝트 개요
│   └── str.png           # 프로젝트 구조 다이어그램
└── server/               # Express.js 기반 백엔드
    ├── src/              # 서버 소스 코드
    ├── types/            # 타입 정의
    └── ...               # 서버 관련 파일들
```

## 설치 및 실행

### 클라이언트

```bash
cd client
npm install
npm run dev
```

### 서버

```bash
cd server
npm install
npm start
```

자세한 내용은 [docs/readme.md](docs/readme.md)를 참조하세요.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
