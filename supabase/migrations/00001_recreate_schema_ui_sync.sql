-- 1. 먼저 이전 스키마 테이블들을 깔끔하게 삭제합니다.
DROP TABLE IF EXISTS certificates, dashboard_records, leaderboard, leaderboard_entries, submissions, teams, hackathon_details, hackathons CASCADE;

-- 2. 프론트엔드 UI/Mock 데이터 구조에 정확히 맞춘 새 테이블들을 생성합니다.
CREATE TABLE public.hackathons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL, -- upcoming, ongoing, ended
    tags TEXT[],
    thumbnail_url TEXT,
    submission_deadline_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    timezone TEXT DEFAULT 'Asia/Seoul',
    description TEXT,
    team_size TEXT,
    total_prize TEXT
);

CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    recruiting BOOLEAN DEFAULT true,
    member_count INTEGER DEFAULT 1,
    max_members INTEGER DEFAULT 4,
    looking_for TEXT[],
    intro TEXT,
    contact_type TEXT,
    contact_url TEXT,
    created_by UUID -- auth.users(id)
);

CREATE TABLE public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    total_score NUMERIC
);

CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    payload_json JSONB NOT NULL,
    created_by UUID
);
