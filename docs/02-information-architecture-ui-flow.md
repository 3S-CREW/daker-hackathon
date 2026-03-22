# 정보구조(IA) 및 UI 플로우

## 1) 전역 네비게이션

- 상단 네비: `/hackathons`, `/camp`, `/rankings`
- 메인 CTA
  - 해커톤 보러가기 -> `/hackathons`
  - 팀 찾기 -> `/camp`
  - 랭킹 보기 -> `/rankings`

## 2) 라우팅 구조

- `/`
  - 랜딩 3D 인터랙션 + 핵심 CTA
- `/hackathons`
  - 해커톤 카드 리스트
  - 상태/태그/기간/참가자수(확장 필드) 표시
- `/hackathons/:slug`
  - 탭 또는 섹션 네비로 8개 섹션 진입
- `/rankings`
  - 글로벌/대회별 랭킹 테이블
- `/camp`
  - 팀 리스트/생성/필터

## 3) 상세 페이지 섹션 흐름

1. Overview: 대회 요약, 팀 정책
2. Info: 공지/규칙/FAQ
3. Eval: 평가 방식/제한
4. Schedule: 마일스톤 타임라인
5. Prize: 상금
6. Teams: 팀 리스트로 이동 + 팀 구성
7. Submit: 제출 가이드/제출 UI
8. Leaderboard: 순위/점수/업데이트 시각

## 4) 데이터 흐름

- 소스 우선순위
  1. localStorage
  2. 정적 JSON seed
  3. Supabase(연동 이후)
- localStorage 키
  - `hackathons`
  - `teams`
  - `submissions`
  - `leaderboards`
  - `dashboardRecords`
  - `certificates`

## 5) 상태 및 예외

- 데이터 없음: 빈 상태 컴포넌트 + CTA
- 오류: 재시도 버튼 + 에러 코드
- 로딩: Skeleton UI

## 6) Camp 연결 규칙

- `team.hackathonSlug` 로 대회 상세와 팀 데이터 연결
- `/camp?hackathon=:slug` 필터 파라미터 사용

## 7) 접근성 체크리스트

- 탭 키 이동 순서 보장
- 모달/드로어 포커스 트랩
- 차트 대체 텍스트 제공
