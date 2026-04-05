# Contributing Guide

## 브랜치

- 기본 흐름: `main`(배포) / `dev`(통합 개발)
- 기능: `feature/<scope>-<short-name>` (`dev`에서 분기)
- 버그: `fix/<scope>-<short-name>` (`dev`에서 분기)
- 문서: `docs/<scope>-<short-name>` (`dev`에서 분기)
- 긴급배포: `hotfix/<scope>-<short-name>` (`main`에서 분기)

## 커밋

- Conventional Commits 준수
- 자세한 규칙은 `docs/conventions/commit-convention.md` 참고

## PR

- 작은 단위 PR 권장
- `pull_request_template.md` 체크리스트를 반드시 채울 것
- UI 변경 시 스크린샷 첨부

## 문서 동기화

- 요구사항/설계 변경 시 `docs` 먼저 업데이트
- AI/프롬프트 작업 이력은 `docs/prompt-log.md`에 append

## 코드 품질

- PR 전 최소 실행
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test -- --run`
