# 프론트엔드 코드 컨벤션

## 1) 언어/타입

- TypeScript `strict: true`
- `any` 금지(불가피한 경우 TODO와 함께 제한 범위 명시)
- 공용 타입은 `entities/*/model/types.ts`에 위치

## 2) 컴포넌트

- 함수형 컴포넌트 + named export 우선
- 한 파일에 하나의 주 컴포넌트
- props는 interface 또는 type으로 명시

## 3) 상태관리

- 서버 상태: TanStack Query
- 클라이언트 상태: Zustand
- 폼: React Hook Form + Zod

## 4) 스타일

- Tailwind utility 우선
- 반복 패턴은 `cn` + UI primitive로 추상화
- 하드코딩 컬러 금지, 디자인 토큰 사용

## 5) 네이밍

- 컴포넌트: PascalCase
- 훅: `use` 접두사
- 파일: kebab-case 권장
- Boolean: `is/has/can` 접두사

## 6) 테스트

- 유틸/훅/도메인 로직은 단위 테스트 필수
- 주요 사용자 플로우는 Playwright 시나리오 보장
