# Daker Hackathon

Daker Hackathon은 해커톤 참가 전 과정(탐색, 팀 빌딩, 제출, 랭킹, 포트폴리오)을 하나의 웹 서비스로 연결하는 프로젝트입니다.

랜딩 페이지의 3D 인터랙션에서 시작해, 해커톤 상세/팀 모집/결과 제출/글로벌 랭킹/개인 대시보드까지 자연스럽게 이어지는 사용자 흐름을 제공합니다.

## 참여자

|                                                         Vibe Coder                                                         |                                                  Vibe Coder                                                  |
|:-------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------:|
|                      <img width="130px" src="https://avatars.githubusercontent.com/hi2242" />                       |               <img width="130px" src="https://avatars.githubusercontent.com/lhs2257" />               |
|                                                  인하대학교 전기전자공학부 20                                                   |                                          세종대학교 전자정보통신공학과 20                                           |
|                                                         윤종근                                                         |                                                  이호섭                                                  |
|                                        [@hi2242](https://github.com/hi2242)                                         |                                [@lhs2257](https://github.com/lhs2257)                                 |


## 핵심 기능

- 랜딩 + 홈 전환 UX: 3D 랜딩에서 카드 기반 진입으로 이어지는 온보딩
- 해커톤 탐색: 상태/태그 필터가 가능한 해커톤 목록과 상세 페이지
- 팀 빌딩(Camp): 팀 생성/수정, 모집 상태 확인, 팀 간 소통
- 제출/리더보드: 해커톤 결과 제출 및 점수 기반 랭킹 확인
- AI 도우미: 대회 맥락 기반 질문 응답 지원
- 포트폴리오/대시보드: 참가 이력, 회고, 수료증 등 개인 기록 관리

## 기술 스택

- Frontend: React, TypeScript, Vite, Tailwind CSS
- State/Data: TanStack Query, React Hook Form, Zod
- Backend(BaaS): Supabase (Auth, DB, Edge Functions)
- E2E: Playwright
- Monorepo: pnpm workspace

## 프로젝트 구조

- `apps/web`: 메인 프론트엔드 애플리케이션
- `supabase`: 마이그레이션, 시드 데이터, Edge Functions
- `docs`: 요구사항, 아키텍처, 운영/협업 문서

## 사용자 흐름 다이어그램

### 1) 전체 플로우 차트
<img width="3454" height="4194" alt="User Flow Chart" src="https://github.com/user-attachments/assets/b05679b0-1645-4f4d-914a-616700c70214" />

### 2) 페이지 라우팅 차트
<img width="2089" height="3057" alt="Page Router Chart" src="https://github.com/user-attachments/assets/7cd22070-5e78-451d-a668-79d3637702b1" />

## 문서 소개

- 문서 인덱스: `docs/README.md`
- 요구사항/범위: `docs/01-product-requirements.md`
- UI 플로우/라우팅: `docs/02-information-architecture-ui-flow.md`
- 프롬프트 로그: `docs/prompt-log.md`
- 프론트 컨벤션: `docs/conventions/frontend-convention.md`
- 백엔드 컨벤션: `docs/conventions/backend-convention.md`
- 커밋 규칙: `docs/conventions/commit-convention.md`

## 로컬 실행

```bash
pnpm install
pnpm dev
```

## 라이선스

이 프로젝트는 루트의 LICENSE 파일을 따릅니다.
