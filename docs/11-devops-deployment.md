# DevOps / 배포 운영

## 1) 배포 전략

- 프론트엔드: Vercel
- 백엔드: Supabase 관리형
- 브랜치 전략: main(production), develop(optional)

## 2) CI 파이프라인

- PR: lint + typecheck + unit test
- main merge: build + e2e smoke + 배포

## 3) 관측성

- Sentry: FE/Edge Function 오류 수집
- 릴리즈 태깅: 배포 SHA 연결

## 4) 시크릿 관리

- GitHub Actions Secrets
- Vercel Environment Variables
- Supabase project secrets

## 5) 롤백

- Vercel 이전 배포로 즉시 롤백
- DB 마이그레이션은 전/후방 호환 전략 유지
