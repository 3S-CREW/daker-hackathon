# Prompt Log

프로젝트에 입력되는 주요 프롬프트를 시간순으로 누적 기록합니다.

## 규칙

- 새 프롬프트는 문서 하단에 append
- 각 항목은 날짜, 목적, 원문, 결과 요약을 포함

---

## 2026-03-22

### 목적

- 사이트 개발 전 바이브 코딩용 기준 문서/자동화 템플릿 구축

### 원문

- 지금부터 내가 웹 사이트를 만들건데 기본 조건을 알려주고 추가 기능, 내가 지정한 스펙을 고려하여 사이트를 만들기 전에 바이브 코딩에 필요한 md 파일들 (UI, DB, 백엔드, 프론트엔드, 기획 등등)을 만들어줘
- 첨부 파일 소개
  - Hackathone-UI-Flow.png: UI에 대한 워크플로우 파일 (라우터 포함)
  - memo.png: 구현할 웹 기능 명세 파일
  - \*.json: 예시 데이터 구조 파일들
- 추가할 기능
  - 해커톤 일정/규칙 안내 AI 챗봇 추가 (사용자가 설정한 해커톤을 기준으로 만들어지는 챗봇)
  - 시각화를 활용한 리더보드, 대시보드 (심사 이후 자신의 결과물을 기록하고 파악할 수 있는 기능 + 추후 면접 등에 제시할 수료증을 저장하기 기능까지 추가)
  - 내 깃허브 계정을 넣으면 깃허브의 Readme.md 파일을 읽어서 적절한 UI를 적용해서 내 포트폴리오를 html 파일로 만들어주는 기능
  - 랜딩페이지는 무조건 3D 인터랙션 화면으로 해줘
- 요구 기술 스택
  - 프론트엔드: Typescript, React, Storybook, Shadcn ui, tailwind css, framer motion, pnpm, Vercel, vitest, playwright, Github Actions, Tanstack Query, Zustand, React Hook Form, Zod, Sentry, React Router, Vite, FSD 구조
  - 백엔드: supabase, Github Actions, PostgreSQL, Deno, PostgRest
  - 보안 및 로직: RLS, Supabase Auth
  - 기타: AI Engine(OpenAI API (GPT-4o)), 디자인 시스템(Pretendard, 토스 느낌의 디자인 시스템), 모노레포, .gitignore 생성
- 추가 사항
  - docs에 주제 별로 나눈 md 파일들을 저장해주고 내가 입력했던 프롬프트를 저장하는 md 파일도 하나 만들어서 앞으로 이 프로젝트에 입력되는 프롬프트를 누적해줘
  - 프론트엔드/백엔드 코드 컨벤션 md 파일도 만들어주고 전체 커밋 컨벤션, PR 템플릿, 이슈 템플릿, 이 외에도 자동화에 도움되는 파일을 github 폴더에 추가해줘
  - 이 외에 풀 바이브 코딩에 더 필요하다고 생각하는 것들도 추가해줘

### 결과 요약

- `docs`에 요구사항, IA, 프론트/백엔드, DB/RLS, AI, 대시보드, 랜딩 3D, 테스트/운영, 플레이북, 컨벤션 문서 생성
- `.github` 자동화 템플릿 및 워크플로우 파일 추가(예정/진행)
- `.gitignore` 생성(예정/진행)

## 2026-03-22

### 목적

- 브랜치 컨벤션 문서 신규 작성 및 실제 브랜치/커밋 반영

### 원문

- 브랜치 컨벤션 md 파일도 작성해주고 그거에 맞게 브랜치 생성해서 거기로 옮겨서 커밋 컨벤션에 맞게 커밋도 작성해줘

### 결과 요약

- `docs/conventions/branch-convention.md` 생성
- 브랜치 `docs/conventions-branch-guide` 생성 및 전환
- 커밋 `docs(conventions): add branch convention guide` 생성

## 2026-03-22

### 목적

- 남은 변경사항 커밋 진행 + 프롬프트 누적 기록 지속

### 원문

- 해줘 프롬프트 누적도 계속 해주고

### 결과 요약

- 남은 변경사항을 컨벤셔널 커밋으로 정리 진행
- 프롬프트 누적 기록 append 유지

## 2026-03-22

### 목적

- 브랜치 전략을 git-flow 스타일(main/dev/feature)로 정비

### 원문

- 그리고 git flow 처럼 main, dev, 기능 브랜치로 나누면 배포할 때 편할 것 같아서 그렇게 해줘

### 결과 요약

- 브랜치 컨벤션/기여 가이드에 main/dev/feature 흐름 반영
- `dev` 브랜치 생성 및 통합 브랜치 구조 정리
