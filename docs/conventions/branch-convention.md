# 브랜치 컨벤션

## 1) 기본 브랜치

- `main`: 배포 기준 브랜치
- `dev`: 통합 개발 브랜치 (git-flow의 develop 역할)

## 2) git-flow 운영 흐름

1. 모든 기능 작업은 `dev`에서 분기한다.
2. 기능/수정 브랜치는 `dev`로 PR 머지한다.
3. 배포 시점에 `dev` -> `main`으로 PR 머지한다.
4. 긴급 운영 수정은 `hotfix/*`를 `main`에서 분기하고, `main`/`dev`에 모두 반영한다.

## 3) 작업 브랜치 네이밍

형식:

`<type>/<scope>-<short-description>`

예시:

- `feature/hackathons-detail-tabs`
- `fix/camp-team-create-validation`
- `docs/conventions-branch-guide`
- `chore/github-actions-cache`

## 3) type 규칙

- `feature`: 사용자 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `refactor`: 동작 변경 없는 구조 개선
- `test`: 테스트 코드 중심 변경
- `chore`: 빌드/설정/의존성
- `hotfix`: 운영 긴급 수정(main에서 직접 분기)

## 4) 분기 기준

- `feature/*`, `fix/*`, `docs/*`, `refactor/*`, `test/*`, `chore/*` 는 기본적으로 `dev`에서 분기
- `hotfix/*` 만 `main`에서 분기

## 5) scope 규칙

- 도메인 또는 영역 단위로 작성
- 권장 예시: `hackathons`, `camp`, `rankings`, `dashboard`, `ai-chatbot`, `conventions`, `github-actions`

## 6) 운영 규칙

- 브랜치 1개 = 목적 1개
- PR 병합 후 작업 브랜치는 삭제
- 긴 작업은 수시로 리베이스 또는 `dev` 동기화
- 커밋 메시지는 `docs/conventions/commit-convention.md` 준수
