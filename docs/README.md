# Docs Index

이 폴더는 해커톤 웹서비스 구현 전, 바이브 코딩에 필요한 기준 문서를 모아둔 공간입니다.

## 문서 목록

1. `01-product-requirements.md` — 제품 요구사항/범위/MVP 기준
2. `02-information-architecture-ui-flow.md` — 라우팅/화면 구조/UI 플로우
3. `03-frontend-architecture.md` — 프론트엔드 기술 아키텍처(FSD 포함)
4. `04-backend-architecture.md` — Supabase + PostgREST + Deno 설계
5. `05-database-schema-rls.md` — DB 스키마, RLS, Auth 정책
6. `06-ai-features-spec.md` — AI 챗봇/README 포트폴리오 생성 기능
7. `07-leaderboard-dashboard-analytics.md` — 리더보드/대시보드/수료증 저장 기능
8. `08-github-readme-portfolio.md` — GitHub README 기반 HTML 포트폴리오 파이프라인
9. `09-landing-3d-spec.md` — 랜딩 3D 인터랙션 명세
10. `10-testing-quality.md` — Vitest/Playwright/품질 게이트
11. `11-devops-deployment.md` — Vercel/GitHub Actions/Sentry 운영
12. `12-vibe-coding-playbook.md` — 바이브 코딩 운영 가이드
13. `conventions/frontend-convention.md` — 프론트엔드 코드 컨벤션
14. `conventions/backend-convention.md` — 백엔드 코드 컨벤션
15. `conventions/branch-convention.md` — 브랜치 네이밍/운영 규칙
16. `conventions/commit-convention.md` — 커밋/PR 규칙
17. `prompt-log.md` — 프로젝트 프롬프트 누적 로그

## 기본 원칙

- 기본 데이터 소스는 제공된 JSON 예시 구조를 기준으로 시작한다.
- 로컬 우선(localStorage)으로 동작하고, Supabase 연동 시 동일 스키마를 유지한다.
- MVP를 먼저 완성하고, 이후 확장 기능(고급 분석/포트폴리오 스타일 확장)을 붙인다.
