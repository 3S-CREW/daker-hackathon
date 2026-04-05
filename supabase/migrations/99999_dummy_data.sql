-- 더미 데이터 스크립트 (개발 환경 테스트용)

-- 1. 가짜 유저 생성 (auth.users)
-- Supabase에서 테스트용으로 임의의 UUID를 가진 유저들을 생성합니다.
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'elon@tesla.com', 'fake', NOW(), '{"provider":"github","providers":["github"]}', '{"user_name":"Elon Musk","avatar_url":"https://github.com/torvalds.png","preferred_username":"elon_m"}', NOW(), NOW()),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam@openai.com', 'fake', NOW(), '{"provider":"github","providers":["github"]}', '{"user_name":"Sam Altman","avatar_url":"https://github.com/shadcn.png","preferred_username":"sam_a"}', NOW(), NOW()),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bill@ms.com', 'fake', NOW(), '{"provider":"github","providers":["github"]}', '{"user_name":"Bill Gates","avatar_url":"https://github.com/leerob.png","preferred_username":"bill_g"}', NOW(), NOW()),
('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'steve@apple.com', 'fake', NOW(), '{"provider":"github","providers":["github"]}', '{"user_name":"Steve Jobs","avatar_url":"https://github.com/yyx990803.png","preferred_username":"steve_j"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. 가짜 프로필 세팅 (public.profiles)
INSERT INTO public.profiles (id, name, avatar_url, github_login)
VALUES 
('10000000-0000-0000-0000-000000000001', 'Elon Musk', 'https://github.com/torvalds.png', 'elon_m'),
('20000000-0000-0000-0000-000000000002', 'Sam Altman', 'https://github.com/shadcn.png', 'sam_a'),
('30000000-0000-0000-0000-000000000003', 'Bill Gates', 'https://github.com/leerob.png', 'bill_g'),
('40000000-0000-0000-0000-000000000004', 'Steve Jobs', 'https://github.com/yyx990803.png', 'steve_j')
ON CONFLICT (id) DO NOTHING;

-- 3. 해커톤(Hackathons) 데이터
INSERT INTO public.hackathons (id, slug, title, status, tags, thumbnail_url, description, team_size, total_prize, submission_deadline_at, end_at)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'daker-spring-2026', 'Daker Spring Web3 Hackathon', 'ongoing', '{"Web3", "Blockchain", "React"}', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80', '새로운 웹 패러다임을 혁신하는 블록체인 기반의 웹 개발 해커톤입니다.', '1~4인', '3,000만원', NOW() + INTERVAL '10 days', NOW() + INTERVAL '15 days'),
('a0000000-0000-0000-0000-000000000002', 'ai-agent-challenge', 'General AI Agent Challenge', 'upcoming', '{"AI", "LLM", "Agent"}', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80', 'GPT-4와 오픈소스 모델을 활용해 인간을 돕는 유스케이스 에이전트를 개발하세요.', '2~5인', '5,000만원', NOW() + INTERVAL '30 days', NOW() + INTERVAL '35 days'),
('a0000000-0000-0000-0000-000000000003', 'fintech-rocket-2025', 'Fintech Rocket 2025 (종료됨)', 'ended', '{"Fintech", "Payment"}', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', '혁신적인 송금/결제 모델을 제시하여 글로벌 금융 시장의 판도를 바꾸세요.', '1~3인', '1.5억원', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

-- 4. 팀 및 캠프 모집글(Teams) 데이터
INSERT INTO public.teams (id, hackathon_id, name, recruiting, member_count, max_members, looking_for, intro, contact_type, contact_url, created_by)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '블록체인 뉴비들', true, 2, 4, '{"프론트엔드", "기획자"}', '저희는 이제 막 이더리움을 다뤄보기 시작한 열정러들입니다. 프론트엔드로 Dapp 연동 도와주실 분과 참신한 아이디어 내주실 기획자 구합니다!', 'kakao', 'https://open.kakao.com/o/fake1', '10000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', '오픈AI 마스터즈', false, 4, 4, '{"마감됨"}', '팀 모집이 완료되었습니다. 감사합니다!', 'email', 'mailto:sam@openai.com', '20000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Win32 매니아', true, 1, 3, '{"디자이너", "백엔드"}', '모던 웹 개발을 할 줄 아는 사람을 찾습니다. 디자인 감각이 뛰어난 분 모십니다.', 'discord', 'https://discord.gg/fake2', '30000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', '애플 핀테크', false, 3, 3, '{"마감됨"}', '페이먼트 개발팀입니다.', 'kakao', 'https://open.kakao.com/o/fake3', '40000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- 5. 리더보드 점수 (Leaderboard) - 종료된 해커톤 등
INSERT INTO public.leaderboard (id, hackathon_id, team_id, total_score, score_breakdown_json)
VALUES
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 98.5, '{"creative": 30, "technical": 35, "uiux": 33.5}'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 85.0, '{"creative": 25, "technical": 30, "uiux": 30}'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 92.0, '{"creative": 28, "technical": 32, "uiux": 32}')
ON CONFLICT DO NOTHING;

-- 6. 주고받은 쪽지 내용 (Direct Messages)
INSERT INTO public.direct_messages (sender_id, receiver_id, content)
VALUES
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '안녕하세요 팀장님! 프론트엔드 포지션으로 꼭 합류하고 싶습니다. 저의 포트폴리오는 github.com/sam_a 에 있습니다!'),
('30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004', '저번에 같이 하셨던 AI 프로젝트 너무 인상깊었습니다. 혹시 이번 대회 같이 나가보실 생각 있으신가요?'),
('10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '안녕하세요! 기획자 자리가 아직 비어있는지 궁금해서 연락드렸습니다.');
