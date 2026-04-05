-- Initial Schema

CREATE TABLE public.hackathons (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL, -- upcoming, ongoing, ended
    tags TEXT[],
    thumbnail_url TEXT,
    submission_deadline_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    timezone TEXT DEFAULT 'Asia/Seoul'
);

CREATE TABLE public.hackathon_details (
    hackathon_slug TEXT PRIMARY KEY REFERENCES public.hackathons(slug) ON DELETE CASCADE,
    overview_json JSONB,
    info_json JSONB,
    eval_json JSONB,
    schedule_json JSONB,
    prize_json JSONB,
    teams_json JSONB,
    submit_json JSONB,
    leaderboard_json JSONB
);

CREATE TABLE public.teams (
    team_code TEXT PRIMARY KEY,
    hackathon_slug TEXT REFERENCES public.hackathons(slug) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_open BOOLEAN DEFAULT true,
    member_count INTEGER DEFAULT 1,
    looking_for TEXT[],
    intro TEXT,
    contact_type TEXT,
    contact_url TEXT,
    created_by UUID, -- Should reference auth.users(id) in a real supabase instance
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hackathon_slug TEXT REFERENCES public.hackathons(slug) ON DELETE CASCADE,
    team_code TEXT REFERENCES public.teams(team_code) ON DELETE CASCADE,
    payload_json JSONB NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE TABLE public.leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hackathon_slug TEXT REFERENCES public.hackathons(slug) ON DELETE CASCADE,
    rank INTEGER,
    team_name TEXT,
    score INTEGER,
    score_breakdown_json JSONB,
    artifacts_json JSONB,
    submitted_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.dashboard_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    hackathon_slug TEXT REFERENCES public.hackathons(slug) ON DELETE CASCADE,
    memo TEXT,
    outcome_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    hackathon_slug TEXT REFERENCES public.hackathons(slug),
    file_url TEXT,
    metadata_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
