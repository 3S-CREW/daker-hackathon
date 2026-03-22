# 백엔드 코드 컨벤션

## 1) 기본 원칙

- Supabase SQL/RLS/Function은 코드리뷰 필수
- 권한 정책(RLS) 없는 테이블 생성 금지
- 공개 API는 최소 필드만 노출

## 2) SQL

- 스네이크 케이스 사용
- PK/FK 명확히 선언
- 마이그레이션 파일은 순차 번호+설명 사용

## 3) Edge Functions(Deno)

- 입력 Zod 검증
- 에러 응답 포맷 통일: `{ code, message, details? }`
- OpenAI 호출 시 timeout/retry/circuit-breaker 고려

## 4) Auth/RLS

- 사용자 데이터는 `auth.uid()` 기준 격리
- 서비스 롤 키는 서버 전용 경로에서만 사용
- 정책 변경 시 테스트 쿼리 추가

## 5) 감사/로깅

- 민감정보 로그 출력 금지
- 요청 ID 기반 추적 가능하도록 구조화
