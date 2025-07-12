# Douda
도우다<br>
2024년 고등학교 프로젝트

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](VERSION)

<h2>웹사이트 링크</h2>
<a href="https://douda.kro.kr" style="color: lightblue;">👉 웹사이트 방문하기</a>

## 목차
- [프로젝트 소개](#프로젝트-소개)
- [구조](#구조)
- [기능](#기능)
- [기여 & 요청](#기여&요청)
- [라이선스](#라이선스)
- [문의](#문의)
- [팀원](#팀원)

## 프로젝트 소개
학교 수업량 유연화 주간에 진행됬던 '공존 프로젝트' 에
발표하기 위해 제작했던 '도우다' 입니다.

## 구조
![프로젝트 구조](./docs/str.png)
<h3>사용언어</h3>
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" /> 
<img src="https://img.shields.io/badge/NextJS-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Badge" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge" />

```
Douda/
├── LICENSE                # MIT 라이선스
├── client/               # Next.js 기반 프론트엔드
│   ├── public/           # 정적 파일
│   ├── src/              # 소스 코드
│   └── ...               # Next.js 관련 파일들
├── docs/                 # 프로젝트 문서
└── server/               # Express.js 기반 백엔드
    ├── src/              # 서버 소스 코드
    └── types/            # 타입 정의
```

## 기능
- [급식표 확인]
- [시간표 확인]
- [게시판]

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

## 기여 & 요청

<a href="https://github.com/HolymolyAstatine/Douda/issues" style="color: lightblue;">👉 버그 신고(깃 허브 이슈)</a> <br>
<a href="https://github.com/HolymolyAstatine/Douda/pulls" style="color: lightblue;">👉풀 리퀘스트(환영!!)</a> <br>
<a href="https://github.com/HolymolyAstatine/Douda/issues" style="color: lightblue;">👉 기능 추가 요청(깃 허브 이슈로 해주세요)</a> <br>

## 라이선스
<h3>아무나 사용하셔도 됩니다.</h3>

## 문의
임시로 이메일 보내주세요 >> (kpa7089@gmail.com)  << <br>

## 팀원

| 이름     | 역할            | GitHub                           | 이메일               |
| -------- | --------------- | -------------------------------- | -------------------- |
| 김평안   | 총괄/프론트/백엔드  | [HolymolyAstatine](https://github.com/HolymolyAstatine) | kpa7089@gmail.com |
| 박지찬   | 디자인/프론트    | [lancelot-blacktail](https://github.com/lancelot-blacktail) | jichanpark11@gmail.com |
| 최민준   | 기획/백엔드      | [cmj0105](https://github.com/cmj0105) | chois0990@gmail.com |

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
