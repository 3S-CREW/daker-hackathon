# 프론트엔드 아키텍처

## 1) 스택

- TypeScript, React, React Router, Vite
- shadcn/ui, Tailwind CSS, Framer Motion
- TanStack Query, Zustand, React Hook Form, Zod
- Vitest, Playwright, Storybook

## 2) 구조 전략: FSD(Feature-Sliced Design)

```text
apps/web/src
  app/                 # 라우터, providers, 전역 스타일
  pages/               # route-level pages
  widgets/             # 페이지 조합 블록
  features/            # 사용자 액션 중심 기능
  entities/            # 도메인 모델 (hackathon/team/submission)
  shared/
    api/               # api clients
    lib/               # utils, formatters
    ui/                # 공용 UI
    config/            # env, constants
```

## 3) 상태 관리

- 서버 상태: TanStack Query
- 클라이언트 UI 상태: Zustand
- 폼 상태: React Hook Form + Zod Resolver

## 4) 주요 화면 컴포넌트

- Landing3DScene
- HackathonList / HackathonCard
- HackathonDetailTabs
- TeamCampBoard
- SubmissionPanel
- LeaderboardTable + LeaderboardCharts
- PortfolioBuilderPanel

## 5) 디자인 가이드

- Pretendard 폰트
- 토스 느낌: 간결한 여백, 선명한 계층, 강한 CTA
- 컬러/타이포/간격은 토큰으로 관리
- 컴포넌트 문서화는 Storybook 기준

## 6) 오류/로깅

- 에러 바운더리 도입
- Sentry 브라우저 SDK 연동
- 비정상 API 응답 표준 핸들러 제공

## 7) 성능

- 라우트 단위 코드 스플리팅
- 차트/3D 컴포넌트 lazy loading
- 이미지 최적화(webp 우선)
