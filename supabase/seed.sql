-- Insert Mock Hackathons
INSERT INTO hackathons (slug, title, status, tags, thumbnail_url, submission_deadline_at, end_at, timezone, description, team_size, total_prize) VALUES
('toss-next-2026', 'Toss NEXT 2026 Developer Hackathon', 'upcoming', '{"Fintech", "Web3", "AI"}', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', '2026-04-15 23:59:59+00', '2026-04-16 18:00:00+00', 'Asia/Seoul', '토스에서 주최하는 차세대 핀테크/웹3/AI 해커톤입니다. 파괴적인 아이디어로 금융의 미래를 설계하세요.', '1-4명', '10,000,000 KRW'),
('global-ai-challenge', 'Global Generative AI Challenge', 'ongoing', '{"Generative AI", "LLM", "Open Source"}', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800', '2026-03-30 12:00:00+00', '2026-03-31 12:00:00+00', 'America/New_York', '전 세계 개발자들과 함께 최고 수준의 생성형 AI 모델을 활용한 오픈소스 프로젝트를 완성해보세요.', '2-5명', '50,000 USD'),
('eco-sustain-2025', 'Eco Sustain Hackathon 2025', 'ended', '{"Environment", "IoT", "Data"}', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800', '2025-11-20 23:59:59+00', '2025-11-21 18:00:00+00', 'Asia/Seoul', '지속가능한 지구를 위한 IoT 데이터 분석 해커톤이 마무리되었습니다. 제출된 훌륭한 프로젝트들을 확인하세요.', '3-4명', '5,000,000 KRW');

-- Insert Mock Teams
INSERT INTO teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Toss Mavericks', true, 2, 4, '{"Frontend", "Designer"}', '핀테크 앱의 새로운 결제 UX를 제안할 팀원을 구합니다. 미친 실행력 환영!'
FROM hackathons WHERE slug = 'toss-next-2026';

INSERT INTO teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'AI Innovators', true, 3, 5, '{"ML Engineer", "Backend"}', 'LLM을 활용한 자동 문서 요약 에이전트를 개발 중입니다. 백엔드 분 모십니다.'
FROM hackathons WHERE slug = 'global-ai-challenge';

INSERT INTO teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Solo Designer', true, 1, 4, '{"Frontend", "Backend", "PM"}', '안녕하세요, 프로덕트 디자이너입니다. 기획부터 개발까지 함께할 열정적인 팀을 직접 빌드하고 싶어요.'
FROM hackathons WHERE slug = 'toss-next-2026';

-- Insert Mock Leaderboard Rankings
INSERT INTO leaderboard (hackathon_id, team_id, total_score)
SELECT h.id, t.id, 98.5
FROM hackathons h, teams t
WHERE h.slug = 'toss-next-2026' AND t.name = 'Toss Mavericks';

INSERT INTO leaderboard (hackathon_id, team_id, total_score)
SELECT h.id, t.id, 95.0
FROM hackathons h, teams t
WHERE h.slug = 'global-ai-challenge' AND t.name = 'AI Innovators';

INSERT INTO leaderboard (hackathon_id, team_id, total_score)
SELECT h.id, t.id, 92.3
FROM hackathons h, teams t
WHERE h.slug = 'toss-next-2026' AND t.name = 'Solo Designer';
