# Next.js 프로젝트 파일

이 파일은 Next.js로 마이그레이션된 클라이언트 코드를 포함합니다.
원래 코드는 루트 디렉토리에 있었지만, 프로젝트 구조를 원래대로 복원하기 위해
client 폴더로 이동해야 합니다.

## 파일 이동 방법

1. 루트 디렉토리의 다음 파일들을 client 디렉토리로 복사해야 합니다:
   - eslint.config.mjs
   - next-env.d.ts
   - next.config.ts
   - package.json
   - package-lock.json
   - postcss.config.mjs
   - tailwind.config.js
   - tsconfig.json

2. 다음 디렉토리들을 client 디렉토리로 복사해야 합니다:
   - .next/
   - public/
   - src/

## 참고

이 파일을 읽은 후, 아래 명령어를 실행하여 파일들을 이동할 수 있습니다:

```powershell
# PowerShell에서 실행
cd e:\develop\migration\next-douda
Copy-Item -Path eslint.config.mjs, next-env.d.ts, next.config.ts, package.json, package-lock.json, postcss.config.mjs, tailwind.config.js, tsconfig.json -Destination client\
Copy-Item -Recurse -Path .next, public, src -Destination client\
```

파일 이동 후 루트 디렉토리의 원본 파일을 삭제할 수 있습니다.
