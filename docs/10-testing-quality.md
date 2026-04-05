# 테스트 및 품질 기준

## 1) 테스트 레이어

- Unit: Vitest
- Component: Vitest + Testing Library
- E2E: Playwright

## 2) 최소 커버리지 목표

- 핵심 도메인(제출/팀/리더보드): 80%+
- 유틸/포맷터: 90%+

## 3) 필수 E2E 시나리오

- 메인 -> 목록 -> 상세 진입
- 상세 Submit 저장/제출
- Camp 팀 생성/필터
- Rankings 표시 확인
- AI 챗봇 질의응답 기본 케이스

## 4) 품질 게이트

- `typecheck` 통과
- `lint` 통과
- `test` 통과
- Playwright smoke 통과
