# 데이터베이스 스키마 및 RLS 정책

## 1) 핵심 테이블

### hackathons

- slug (PK)
- title
- status (upcoming|ongoing|ended)
- tags (text[])
- thumbnail_url
- submission_deadline_at
- end_at
- timezone

### hackathon_details

- hackathon_slug (PK/FK)
- overview_json
- info_json
- eval_json
- schedule_json
- prize_json
- teams_json
- submit_json
- leaderboard_json

### teams

- team_code (PK)
- hackathon_slug (FK)
- name
- is_open
- member_count
- looking_for (text[])
- intro
- contact_type
- contact_url
- created_by (auth.uid)
- created_at

### submissions

- id (uuid PK)
- hackathon_slug (FK)
- team_code (FK)
- payload_json
- submitted_at
- created_by (auth.uid)

### leaderboard_entries

- id (uuid PK)
- hackathon_slug (FK)
- rank
- team_name
- score
- score_breakdown_json
- artifacts_json
- submitted_at
- updated_at

### dashboard_records

- id (uuid PK)
- user_id (auth.uid)
- hackathon_slug
- memo
- outcome_json
- created_at

### certificates

- id (uuid PK)
- user_id (auth.uid)
- hackathon_slug
- file_url
- metadata_json
- created_at

## 2) RLS 정책(요약)

- 공개 조회 허용: hackathons, hackathon_details, leaderboard_entries(확정 결과)
- teams
  - SELECT: 공개
  - INSERT: 로그인 사용자
  - UPDATE/DELETE: `created_by = auth.uid()`
- submissions
  - INSERT/SELECT: 로그인 사용자 + 자신 팀
  - UPDATE 제한(제출 이후 수정 정책은 대회 규정별)
- dashboard_records/certificates
  - 사용자 본인 행만 접근 가능

## 3) 인덱스

- `teams(hackathon_slug, is_open)`
- `submissions(hackathon_slug, team_code, submitted_at desc)`
- `leaderboard_entries(hackathon_slug, rank)`
- `dashboard_records(user_id, created_at desc)`

## 4) 샘플 데이터 매핑

- `public_hackathons.json` -> `hackathons`
- `public_hackathon_detail.json` -> `hackathon_details`
- `public_teams.json` -> `teams`
- `public_leaderboard.json` -> `leaderboard_entries`
