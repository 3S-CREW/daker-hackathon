# AI 기능 명세

## 1) 기능 A: 해커톤 일정/규칙 안내 챗봇

### 목표

- 사용자가 선택한 해커톤(`slug`) 기준으로 일정/규칙/제출 안내를 빠르게 질의응답.

### 입력

- `hackathonSlug`
- `userQuestion`
- 대화 컨텍스트(최근 5~10턴)

### 지식 소스 우선순위

1. `hackathon_details.sections.info.notice`
2. `sections.schedule.milestones`
3. `sections.submit.guide/submissionItems`
4. `sections.eval`

### 응답 규칙

- 반드시 해당 해커톤 데이터에서 근거를 찾아 답변.
- 모르면 모른다고 답하고 관련 링크(rules/faq) 안내.
- 날짜/시간은 `Asia/Seoul` 기준으로 표기.

### 구현

- Supabase Edge Function(Deno)에서 OpenAI API 호출
- 프롬프트 템플릿: 시스템/개발자/사용자 메시지 분리
- 안전장치: 허용된 데이터 필드만 모델에 전달

## 2) 기능 B: README 기반 포트폴리오 생성 보조

- README 섹션 추출/요약/구조화
- 누락된 섹션(프로젝트 개요, 역할, 성과)을 질문형으로 보완
- 최종 HTML 템플릿 데이터(JSON) 반환

## 3) 모델/비용 관리

- 기본 모델: GPT-4o
- 토큰 제한: 질문당 max output 제한
- 캐싱: 동일 slug + 유사 질문 캐시

## 4) 실패 처리

- API 오류 시 fallback 응답 + rules/faq 링크 제공
- 타임아웃 시 재시도 1회
