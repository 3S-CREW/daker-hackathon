-- migration for Phase 3 features (Fixes public.users relation error and adds profiles)

-- 1. Create a profiles table to sync with auth.users for public generic joins
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    github_login TEXT
);

-- 백필(Backfill): 기존 auth.users 에 있던 유저들을 profiles 로 복사
INSERT INTO public.profiles (id, name, avatar_url, github_login)
SELECT 
    id, 
    raw_user_meta_data->>'user_name', 
    raw_user_meta_data->>'avatar_url',
    raw_user_meta_data->>'preferred_username'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 향후 회원가입 시 자동으로 public.profiles에 생성되도록 트리거 추가(옵션, MVP에서는 백필로 커버)

-- 2. Add score_breakdown_json to leaderboard
ALTER TABLE public.leaderboard
ADD COLUMN IF NOT EXISTS score_breakdown_json JSONB;

-- 3. Create direct_messages table
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMPTZ
);

-- Enable RLS on direct_messages
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their sent direct messages"
ON public.direct_messages FOR SELECT
USING (auth.uid() = sender_id);

CREATE POLICY "Users can view their received direct messages"
ON public.direct_messages FOR SELECT
USING (auth.uid() = receiver_id);

CREATE POLICY "Users can send direct messages"
ON public.direct_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received direct messages"
ON public.direct_messages FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- 4. Create Global User Rankings View
-- 사용자 프로필(public.profiles) -> 팀(public.teams) -> 리더보드(public.leaderboard) 조인
-- (참고: 현재 시스템에는 "팀 멤버" 가입 기능이 없어, 사용자가 개설한(created_by) 팀을 대상으로 계산합니다)
CREATE OR REPLACE VIEW public.global_user_rankings AS
SELECT 
    p.id AS user_id,
    p.name,
    p.avatar_url,
    p.github_login,
    -- 만약 상금(prize) 필드가 있다면 SUM을 하겠지만, 현재는 total_score만 있으므로 점수 합계 렌더링
    COALESCE(SUM(l.total_score), 0) AS global_total_score,
    COUNT(l.id) AS participated_count,
    RANK() OVER (ORDER BY COALESCE(SUM(l.total_score), 0) DESC) AS global_rank
FROM 
    public.profiles p
JOIN 
    public.teams t ON p.id = t.created_by
JOIN 
    public.leaderboard l ON t.id = l.team_id
GROUP BY 
    p.id, p.name, p.avatar_url, p.github_login;
