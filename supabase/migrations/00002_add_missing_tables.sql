-- ============================================================
-- 00002: 누락 테이블 추가 및 leaderboard 컬럼 보완
-- ============================================================

-- 1. hackathon_details 테이블
CREATE TABLE IF NOT EXISTS public.hackathon_details (
    hackathon_id UUID PRIMARY KEY REFERENCES public.hackathons(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    overview_json    JSONB,
    info_json        JSONB,
    eval_json        JSONB,
    schedule_json    JSONB,
    prize_json       JSONB,
    teams_json       JSONB,
    submit_json      JSONB,
    leaderboard_json JSONB
);

-- 2. leaderboard 테이블 컬럼 보완
ALTER TABLE public.leaderboard
    ADD COLUMN IF NOT EXISTS rank              INTEGER,
    ADD COLUMN IF NOT EXISTS team_name         TEXT,
    ADD COLUMN IF NOT EXISTS score             NUMERIC,
    ADD COLUMN IF NOT EXISTS score_breakdown_json JSONB,
    ADD COLUMN IF NOT EXISTS artifacts_json    JSONB,
    ADD COLUMN IF NOT EXISTS submitted_at      TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS updated_at        TIMESTAMPTZ DEFAULT NOW();

-- 3. dashboard_records 테이블
CREATE TABLE IF NOT EXISTS public.dashboard_records (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    user_id        UUID NOT NULL,
    hackathon_id   UUID REFERENCES public.hackathons(id) ON DELETE SET NULL,
    memo           TEXT,
    outcome_json   JSONB
);

-- 4. certificates 테이블
CREATE TABLE IF NOT EXISTS public.certificates (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    user_id        UUID NOT NULL,
    hackathon_id   UUID REFERENCES public.hackathons(id) ON DELETE SET NULL,
    file_url       TEXT,
    metadata_json  JSONB
);

-- ============================================================
-- RLS 활성화
-- ============================================================

ALTER TABLE public.hackathon_details  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates       ENABLE ROW LEVEL SECURITY;

-- hackathon_details: 공개 조회
CREATE POLICY "hackathon_details_select_public"
    ON public.hackathon_details FOR SELECT
    USING (true);

CREATE POLICY "hackathon_details_insert_admin"
    ON public.hackathon_details FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- dashboard_records: 본인 행만 접근
CREATE POLICY "dashboard_records_own"
    ON public.dashboard_records FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- certificates: 본인 행만 접근
CREATE POLICY "certificates_own"
    ON public.certificates FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 인덱스
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_dashboard_records_user
    ON public.dashboard_records (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_certificates_user
    ON public.certificates (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rank
    ON public.leaderboard (hackathon_id, rank);
