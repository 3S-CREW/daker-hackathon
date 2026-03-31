-- ============================================================
-- 1. Mock Hackathons (12개로 다양화)
-- ============================================================
TRUNCATE public.hackathons CASCADE;

INSERT INTO public.hackathons (id, slug, title, status, tags, thumbnail_url, submission_deadline_at, end_at, timezone, description, team_size, total_prize) VALUES
(gen_random_uuid(), 'toss-next-2026', 'Toss NEXT 2026 Developer Hackathon', 'upcoming', '{"Fintech", "UX", "Core"}', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200', '2026-06-15 23:59:59+09', '2026-06-16 18:00:00+09', 'Asia/Seoul', '토스에서 주최하는 차세대 핀테크 해커톤입니다. 기존의 틀을 깨는 혁신적인 금융 사용자 경험을 설계하세요.', '1-4명', '10,000,000 KRW'),
(gen_random_uuid(), 'global-ai-2025', 'Global Generative AI Challenge', 'ongoing', '{"Generative AI", "LLM", "Open Source"}', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200', '2026-04-10 12:00:00+00', '2026-04-11 12:00:00+00', 'America/New_York', '전 세계 개발자들과 함께 최고 수준의 생성형 AI 모델을 활용한 오픈소스 프로젝트를 완성해보세요.', '2-5명', '50,000 USD'),
(gen_random_uuid(), 'eco-sustain-2025', 'Eco Sustain Hackathon 2025', 'ended', '{"Environment", "IoT", "Data"}', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200', '2025-11-20 23:59:59+09', '2025-11-21 18:00:00+09', 'Asia/Seoul', '지속가능한 지구를 위한 IoT 데이터 분석 해커톤이 마무리되었습니다. 환경 문제를 기술로 해결한 멋진 작업들을 확인하세요.', '3-4명', '5,000,000 KRW'),
(gen_random_uuid(), 'google-ml-jam', 'Google ML Experts Jam', 'upcoming', '{"Machine Learning", "Cloud", "Big Data"}', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200', '2026-07-20 23:59:59+09', '2026-07-22 18:00:00+09', 'Asia/Seoul', 'Google Cloud Platform(GCP) 상에서 혁신적인 머신러닝 파이프라인을 구축하고 실제 비즈니스 문제를 해결합니다.', '2-4명', '15,000,000 KRW'),
(gen_random_uuid(), 'game-on-mobile', 'Mobile Game Jam: 48h Challenge', 'ongoing', '{"Game", "Unity", "Mobile"}', 'https://images.unsplash.com/photo-1556438158-859e1bbdd194?auto=format&fit=crop&q=80&w=1200', '2026-03-31 00:00:00+09', '2026-04-01 18:00:00+09', 'Asia/Seoul', '단 48시간 안에 모바일 게임 프로토타입을 완성하는 극한의 챌린지입니다. 독창적인 플레이 메커니즘을 보여주세요.', '1-3명', '3,000,000 KRW'),
(gen_random_uuid(), 'blockchain-core-2025', 'Blockchain Devnet Hackathon', 'ended', '{"Blockchain", "Solidity", "Web3"}', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200', '2025-12-05 23:59:59+09', '2025-12-06 18:00:00+09', 'Europe/Berlin', '탈중앙화 앱(dApp)의 한계를 뛰어넘는 Web3 인프라 구축 프로젝트들이 다수 출품되었습니다.', '2-4명', '10,000 ETH (Prize Pool)'),
(gen_random_uuid(), 'healthcare-ai-future', 'Healthcare AI Innovation', 'upcoming', '{"Healthcare", "AI", "Ethics"}', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200', '2026-08-30 23:59:59+09', '2026-09-01 12:00:00+09', 'Asia/Seoul', '의료 데이터를 활용하여 환자의 삶을 개선하고 의료 시스템의 효율성을 높이는 AI 솔루션을 제안하세요.', '1-5명', '20,000,000 KRW'),
(gen_random_uuid(), 'security-capture-flag', 'Cyber Security CTF 2026', 'ongoing', '{"Security", "Network", "Coding"}', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200', '2026-04-05 23:59:59+09', '2026-04-06 12:00:00+09', 'Asia/Seoul', '실시간 인프라 방어 및 공격 시나리오를 통해 최고의 보안 전문가를 가립니다. 시스템의 취약점을 찾고 방어하세요.', '2-3명', '8,000,000 KRW'),
(gen_random_uuid(), 'edutech-smart-learning', 'Smart Learning Edu-Tech', 'ended', '{"Education", "UX", "LMS"}', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200', '2026-01-15 23:59:59+09', '2026-01-17 18:00:00+09', 'Asia/Seoul', '비대면 교육의 한계를 극복하고 학습 몰입도를 높이는 에듀테크 서비스들이 상을 받았습니다.', '2-4명', '12,000,000 KRW'),
(gen_random_uuid(), 'ar-vr-metaverse', 'The Next Metaverse Jam', 'upcoming', '{"AR", "VR", "Unity"}', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1200', '2026-10-10 23:59:59+09', '2026-10-12 18:00:00+09', 'Europe/Paris', '메타버스를 넘어 현실과 디지털 세계를 잇는 혁신적인 AR/VR 경험을 창조하세요.', '1-4명', '20,000 EUR'),
(gen_random_uuid(), 'coding-for-nature', 'Coding for Nature 24h', 'ongoing', '{"Environment", "Speed", "Data"}', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200', '2026-03-31 09:00:00+09', '2026-04-01 09:00:00+09', 'Asia/Seoul', '자연 보호를 위해 24시간 동안 몰입하여 환경 데이터를 시각화하고 해결 방안을 코딩합니다.', '2-4명', '1,000,000 KRW'),
(gen_random_uuid(), 'open-fin-tech-day', 'Open Fintech Day 2026', 'ended', '{"Fintech", "API", "Security"}', 'https://images.unsplash.com/photo-1550565118-3d143c4a5ecd?auto=format&fit=crop&q=80&w=1200', '2026-02-28 23:59:59+09', '2026-03-01 18:00:00+09', 'Asia/Seoul', '오픈 API를 활용하여 누구나 쉽고 안전하게 이용할 수 있는 새로운 금융 서비스들의 축제였습니다.', '1-4명', '7,000,000 KRW');

-- ============================================================
-- 2. Mock Hackathon Details (상세 8개 섹션)
-- ============================================================
INSERT INTO public.hackathon_details (hackathon_id, overview_json, info_json, eval_json, schedule_json, prize_json, teams_json, submit_json, leaderboard_json)
SELECT 
    id,
    jsonb_build_object('content', description || E'\n\n지금 바로 도전하고 새로운 금융의 미래를 확인해 보세요.'),
    jsonb_build_object(
        'rules', jsonb_build_array('만 19세 이상 대학생 또는 현업 개발자 참여 가능', '팀 인원은 최대 4명까지 구성 가능', '모든 제출물은 오픈소스로 공개되어야 함'),
        'notice', '대회 중 외부 인공지능 툴(ChatGPT, Copilot 등) 활용이 허용됩니다.'
    ),
    jsonb_build_object(
        'criteria', jsonb_build_array(
            jsonb_build_object('item', '창의성', 'weight', '40%', 'desc', '아이디어의 참신함과 기존 시장과의 차별성'),
            jsonb_build_object('item', '기술력', 'weight', '30%', 'desc', '구현된 결과물의 완성도와 시스템 아키텍처'),
            jsonb_build_object('item', '사업성', 'weight', '30%', 'desc', '실제 서비스화 가능성 및 비즈니스 임팩트')
        )
    ),
    jsonb_build_object(
        'timeline', jsonb_build_array(
            jsonb_build_object('date', '2026-03-01', 'event', '참가 신청 및 아이디어 구상 단계'),
            jsonb_build_object('date', '2026-04-01', 'event', '팀 빌딩 및 개발 시작'),
            jsonb_build_object('date', '2026-06-15', 'event', '최종 제출 마감'),
            jsonb_build_object('date', '2026-06-16', 'event', '결과 발표 및 시상식')
        )
    ),
    jsonb_build_object(
        'prizes', jsonb_build_array(
            jsonb_build_object('rank', '대상', 'amount', '5,000,000 KRW', 'benefit', '토스 채용 서류 면제권'),
            jsonb_build_object('rank', '최우수상', 'amount', '3,000,000 KRW', 'benefit', '아이패드 프로 지급'),
            jsonb_build_object('rank', '우수상', 'amount', '2,000,000 KRW', 'benefit', '애플 워치 지급')
        )
    ),
    jsonb_build_object('total_teams', 12, 'recruiting_teams', 5),
    jsonb_build_object('instruction', 'GitHub 리포지토리 URL과 함께 3분 내외의 데모 영상을 제출해 주세요.'),
    jsonb_build_object('top_3', jsonb_build_array('Toss Mavericks', 'UI Masters', 'Algorithm Gods'))
FROM public.hackathons;

-- ============================================================
-- 3. Mock Teams (25개로 풍부하게)
-- ============================================================
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT 
    id, 
    'Toss Mavericks', true, 2, 4, '{"Frontend", "Designer"}', '핀테크 앱의 새로운 결제 UX를 제안할 팀원을 구합니다.'
FROM public.hackathons WHERE slug = 'toss-next-2026';

INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT 
    id, 
    'UI Masters', true, 1, 4, '{"Product Designer"}', '디자인 한계에 도전할 팀원 구해요.'
FROM public.hackathons WHERE slug = 'toss-next-2026';

INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT 
    id, 
    'Algorithm Gods', false, 4, 4, '{"None"}', '이미 완벽한 팀입니다. 정상을 향해 달립니다.'
FROM public.hackathons WHERE slug = 'toss-next-2026';

INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT 
    id, 
    'AI Innovators', true, 3, 5, '{"ML Engineer", "Backend"}', 'LLM을 활용한 자동 문서 요약 에이전트를 개발 중입니다.'
FROM public.hackathons WHERE slug = 'global-ai-2025';

INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT 
    id, 
    'GPT Rebels', true, 2, 4, '{"Prompt Engineer", "Frontend"}', '기존의 생각을 뛰어넘는 프롬프트 엔지니어링을 보여드립니다.'
FROM public.hackathons WHERE slug = 'global-ai-2025';

INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT 
    id, 
    'Eco Warriors', false, 4, 4, '{"None"}', '지구 살리기 프로젝트 진행 중입니다.'
FROM public.hackathons WHERE slug = 'eco-sustain-2025';

INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT 
    id, 
    'Solar Developers', true, 2, 5, '{"IoT Dev", "Data Scientist"}', '태양광 패널 데이터를 이용한 예측 모델링 팀입니다.'
FROM public.hackathons WHERE slug = 'eco-sustain-2025';

-- 추가 랜덤 팀 데이터
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Pixel Artists', true, 2, 4, '{"Unity Dev", "Pixel Artist"}', '레트로 감성 게임 만들어요!' FROM public.hackathons WHERE slug = 'game-on-mobile';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Hyper Casual Team', true, 1, 3, '{"Game Dev"}', '초간단 중독성 게임 챌린지.' FROM public.hackathons WHERE slug = 'game-on-mobile';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'ML Wizards', true, 3, 4, '{"ML Engineer"}', '구글 ML 잼에서 우승할 인재 찾음.' FROM public.hackathons WHERE slug = 'google-ml-jam';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Big Data Hunters', false, 4, 4, '{}', '데이터로 세상을 봅니다.' FROM public.hackathons WHERE slug = 'google-ml-jam';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Web3 Explorers', true, 2, 4, '{"Smart Contract Dev"}', '이더리움 생태계 확장 프로젝트.' FROM public.hackathons WHERE slug = 'blockchain-core-2025';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'DeFi Kings', true, 3, 5, '{"Backend"}', '탈중앙화 금융의 미래.' FROM public.hackathons WHERE slug = 'blockchain-core-2025';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Health Hackers', true, 2, 4, '{"Frontend", "Designer"}', '의료 정보 접근성을 개선해요.' FROM public.hackathons WHERE slug = 'healthcare-ai-future';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Red Teams', true, 2, 3, '{"Pentester"}', '가장 취약한 부분을 찾습니다.' FROM public.hackathons WHERE slug = 'security-capture-flag';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Blue Teams', false, 3, 3, '{}', '철벽 방어를 보여드립니다.' FROM public.hackathons WHERE slug = 'security-capture-flag';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Edu Spark', true, 1, 4, '{"Designer", "Product Manager"}', '교육을 놀이처럼.' FROM public.hackathons WHERE slug = 'edutech-smart-learning';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Metaverse Creators', true, 2, 4, '{"Unity Developer", "3D Modeler"}', '가상 공간을 설계합니다.' FROM public.hackathons WHERE slug = 'ar-vr-metaverse';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Forest Coders', false, 4, 4, '{}', '나무를 심듯 코딩합니다.' FROM public.hackathons WHERE slug = 'coding-for-nature';
INSERT INTO public.teams (hackathon_id, name, recruiting, member_count, max_members, looking_for, intro)
SELECT id, 'Open Money', true, 2, 4, '{"API Specialist"}', '오픈 뱅킹의 장점을 극대화합니다.' FROM public.hackathons WHERE slug = 'open-fin-tech-day';

-- ============================================================
-- 4. Mock Leaderboard (현실적인 순위 데이터)
-- ============================================================
INSERT INTO public.leaderboard (hackathon_id, team_id, rank, team_name, total_score, score_breakdown_json)
SELECT 
    h.id, t.id, 1, t.name, 98.5, 
    jsonb_build_object('creativity', 40, 'technical', 30, 'business', 28.5)
FROM public.hackathons h, public.teams t 
WHERE h.slug = 'eco-sustain-2025' AND t.name = 'Eco Warriors';

INSERT INTO public.leaderboard (hackathon_id, team_id, rank, team_name, total_score)
SELECT h.id, t.id, 1, t.name, 97.2
FROM public.hackathons h, public.teams t 
WHERE h.slug = 'toss-next-2026' AND t.name = 'Toss Mavericks';

INSERT INTO public.leaderboard (hackathon_id, team_id, rank, team_name, total_score)
SELECT h.id, t.id, 2, t.name, 95.8
FROM public.hackathons h, public.teams t 
WHERE h.slug = 'toss-next-2026' AND t.name = 'UI Masters';

INSERT INTO public.leaderboard (hackathon_id, team_id, rank, team_name, total_score)
SELECT h.id, t.id, 1, t.name, 99.0
FROM public.hackathons h, public.teams t 
WHERE h.slug = 'global-ai-2025' AND t.name = 'AI Innovators';

INSERT INTO public.leaderboard (hackathon_id, team_id, rank, team_name, total_score)
SELECT h.id, t.id, 2, t.name, 94.2
FROM public.hackathons h, public.teams t 
WHERE h.slug = 'global-ai-2025' AND t.name = 'GPT Rebels';

INSERT INTO public.leaderboard (hackathon_id, team_id, rank, team_name, total_score)
SELECT h.id, t.id, 1, t.name, 96.5
FROM public.hackathons h, public.teams t 
WHERE h.slug = 'blockchain-core-2025' AND t.name = 'DeFi Kings';

INSERT INTO public.leaderboard (hackathon_id, team_id, rank, team_name, total_score)
SELECT h.id, t.id, 1, t.name, 89.2
FROM public.hackathons h, public.teams t 
WHERE h.slug = 'coding-for-nature' AND t.name = 'Forest Coders';
