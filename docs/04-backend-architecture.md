# 백엔드 아키텍처

## 1) 스택

- Supabase(PostgreSQL, Auth, Storage, Edge Functions(Deno), PostgREST)
- GitHub Actions(CI/CD 자동화)

## 2) 서비스 구성

- Postgres: 정규 데이터 저장
- PostgREST: CRUD/API 자동 노출
- Deno Edge Functions:
  - AI 챗봇 프록시(OpenAI API 호출)
  - GitHub README 파싱/정규화
  - 수료증 발급/저장 트리거(확장)
- Supabase Auth: 이메일/소셜 로그인

## 3) API 도메인

- Hackathons
- Teams(Camp)
- Submissions
- Leaderboards
- DashboardRecords
- PortfolioJobs
- Certificates

## 4) 권한 모델

- 공개 읽기: hackathons, public leaderboard
- 인증 사용자 쓰기: teams, submissions, dashboard records
- 운영자 권한: 결과 확정, 공지 등록

## 5) 환경 변수(예시)

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 전용)
- `OPENAI_API_KEY`
- `SENTRY_DSN`

## 6) 백엔드 구현 단계

1. JSON seed 기반 로컬 스키마 확정
2. Supabase 마이그레이션 SQL 작성
3. RLS 정책 적용/검증
4. Edge Functions 배포
5. 프론트 연동 + E2E 검증
