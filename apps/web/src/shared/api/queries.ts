import { supabase } from "./supabase";

export type Hackathon = {
  id: string;
  slug: string;
  title: string;
  status: "upcoming" | "ongoing" | "ended";
  tags: string[];
  thumbnail_url: string;
  submission_deadline_at: string;
  start_at: string;
  end_at: string;
  timezone: string;
  description?: string;
  team_size?: string;
  total_prize?: string;
  participants_count?: number;
};

export type Team = {
  id: string;
  hackathon_id: string;
  name: string;
  recruiting: boolean;
  member_count: number;
  max_members: number;
  looking_for: string[];
  intro: string;
  contact_type: string | null;
  contact_url: string | null;
  created_by: string | null;
  created_at?: string;
};

export type RankingEntry = {
  id: string;
  hackathon_id: string;
  hackathon_slug?: string;
  team_id: string;
  rank: number;
  total_score: number;
  team_name?: string;
  score_breakdown_json?: Record<string, unknown>;
};

export type SubmissionPayload = {
  project_url: string;
  demo_url?: string;
  description: string;
  memo?: string;
};

export type Submission = {
  id: string;
  hackathon_id: string;
  team_id: string;
  payload_json: SubmissionPayload;
  created_by: string;
  created_at?: string;
};

export type GlobalRankingEntry = {
  user_id: string;
  name: string;
  avatar_url: string;
  github_login: string;
  global_total_score: number;
  participated_count: number;
  global_rank: number;
};

export type DirectMessage = {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_at: string | null;
  sender?: {
    name: string;
    avatar_url: string;
    github_login: string;
  };
};

export const fetchHackathons = async (): Promise<Hackathon[]> => {
  const { data, error } = await supabase
    .from("hackathons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Fetch Hackathons Error:", error);
    return [];
  }
  return data as Hackathon[];
};

export const fetchHackathonBySlug = async (
  slug: string,
): Promise<Hackathon | undefined> => {
  const { data, error } = await supabase
    .from("hackathons")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    console.error("Fetch Hackathon Error:", error);
    return undefined;
  }
  return (data as Hackathon) || undefined;
};

export const fetchTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Fetch Teams Error:", error);
    return [];
  }
  return data as Team[];
};

export type CreateTeamInput = {
  hackathon_id: string;
  name: string;
  recruiting: boolean;
  max_members: number;
  looking_for: string[];
  intro: string;
  contact_type: string;
  contact_url: string;
  created_by: string;
};

export type CreateSubmissionInput = {
  hackathon_id: string;
  team_id: string;
  payload_json: SubmissionPayload;
  created_by: string;
};

export const createTeam = async (input: CreateTeamInput): Promise<Team> => {
  const { data, error } = await supabase
    .from("teams")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Team;
};

export const createSubmission = async (
  input: CreateSubmissionInput,
): Promise<Submission> => {
  const { data, error } = await supabase
    .from("submissions")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Submission;
};

export const updateTeam = async (
  id: string,
  input: Partial<CreateTeamInput>,
): Promise<void> => {
  const { error } = await supabase.from("teams").update(input).eq("id", id);
  if (error) throw error;
};

export const deleteTeam = async (id: string): Promise<void> => {
  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) throw error;
};

export const fetchTeamsByHackathon = async (
  hackathon_id: string,
): Promise<Team[]> => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("hackathon_id", hackathon_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Fetch Teams Error:", error);
    return [];
  }
  return data as Team[];
};

export const fetchMySubmissionsForHackathon = async (
  hackathon_id: string,
  team_ids: string[],
): Promise<Submission[]> => {
  if (team_ids.length === 0) return [];
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("hackathon_id", hackathon_id)
    .in("team_id", team_ids);

  if (error) {
    console.error("Fetch Submissions Error:", error);
    return [];
  }
  return (data ?? []) as Submission[];
};

export const fetchRankingsByHackathon = async (
  hackathon_id: string,
): Promise<RankingEntry[]> => {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*, teams(name)")
    .eq("hackathon_id", hackathon_id)
    .order("total_score", { ascending: false });
  if (error) {
    console.error("Fetch Rankings Error:", error);
    return [];
  }
  return data.map((entry, index) => ({
    id: entry.id,
    hackathon_id: entry.hackathon_id,
    team_id: entry.team_id,
    rank: index + 1,
    total_score: entry.total_score,
    score_breakdown_json: entry.score_breakdown_json,
    team_name: entry.teams?.name || "Unknown Team",
  })) as RankingEntry[];
};

// ---- My Teams (참가 이력용) ----

export const fetchMyTeams = async (
  user_id: string,
): Promise<
  (Team & {
    hackathons: { title: string; slug: string; status: string } | null;
  })[]
> => {
  const { data, error } = await supabase
    .from("teams")
    .select("*, hackathons(title, slug, status)")
    .eq("created_by", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Fetch MyTeams Error:", error);
    return [];
  }
  return data as (Team & {
    hackathons: { title: string; slug: string; status: string } | null;
  })[];
};

// ---- HackathonDetails ----

export type HackathonDetails = {
  hackathon_id: string;
  overview_json: Record<string, unknown> | null;
  info_json: Record<string, unknown> | null;
  eval_json: Record<string, unknown> | null;
  schedule_json: Record<string, unknown> | null;
  prize_json: Record<string, unknown> | null;
  submit_json: Record<string, unknown> | null;
};

export const fetchHackathonDetails = async (
  hackathon_id: string,
): Promise<HackathonDetails | null> => {
  const { data, error } = await supabase
    .from("hackathon_details")
    .select("*")
    .eq("hackathon_id", hackathon_id)
    .single();
  if (error) return null;
  return data as HackathonDetails;
};

// ---- DashboardRecord ----

export type DashboardRecord = {
  id: string;
  user_id: string;
  hackathon_id: string;
  memo: string | null;
  outcome_json: Record<string, unknown> | null;
  created_at: string;
};

export type CreateDashboardRecordInput = {
  user_id: string;
  hackathon_id: string;
  memo?: string;
  outcome_json?: Record<string, unknown>;
};

export const fetchMyDashboardRecords = async (
  user_id: string,
): Promise<DashboardRecord[]> => {
  const { data, error } = await supabase
    .from("dashboard_records")
    .select("*, hackathons(title, slug, status)")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Fetch DashboardRecords Error:", error);
    return [];
  }
  return data as DashboardRecord[];
};

export const upsertDashboardRecord = async (
  input: CreateDashboardRecordInput,
): Promise<void> => {
  const { error } = await supabase
    .from("dashboard_records")
    .upsert(input, { onConflict: "user_id,hackathon_id" });
  if (error) throw error;
};

// ---- Certificate ----

export type Certificate = {
  id: string;
  user_id: string;
  hackathon_id: string;
  file_url: string | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
};

export type CreateCertificateInput = {
  user_id: string;
  hackathon_id: string;
  file_url?: string;
  metadata_json?: Record<string, unknown>;
};

export const fetchMyCertificates = async (
  user_id: string,
): Promise<Certificate[]> => {
  const { data, error } = await supabase
    .from("certificates")
    .select("*, hackathons(title, slug)")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Fetch Certificates Error:", error);
    return [];
  }
  return data as Certificate[];
};

export const createCertificate = async (
  input: CreateCertificateInput,
): Promise<void> => {
  const { error } = await supabase.from("certificates").insert(input);
  if (error) throw error;
};

// ---- Rankings ----

export const fetchRankings = async (
  hackathon_id?: string,
): Promise<RankingEntry[]> => {
  let query = supabase
    .from("leaderboard")
    .select("*, teams(name), hackathons(slug)")
    .order("total_score", { ascending: false });

  if (hackathon_id) {
    query = query.eq("hackathon_id", hackathon_id);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Fetch Rankings Error:", error);
    return [];
  }

  return data.map((entry, index) => ({
    id: entry.id,
    hackathon_id: entry.hackathon_id,
    hackathon_slug: entry.hackathons?.slug,
    team_id: entry.team_id,
    rank: index + 1,
    total_score: entry.total_score,
    score_breakdown_json: entry.score_breakdown_json,
    team_name: entry.teams?.name || "Unknown Team",
  })) as RankingEntry[];
};

// ---- Global Rankings ----
export interface GlobalRanking {
  user_id: string;
  name: string;
  avatar_url: string;
  github_login: string;
  global_total_score: number;
  participated_count: number;
  global_rank: number;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_prize_money: number;
}

// 랭킹 더미 데이터 (DB에 데이터 없을 때 fallback)
const DUMMY_RANKINGS: GlobalRanking[] = [
  {
    user_id: "dummy-1",
    name: "Kim Daker",
    avatar_url: "https://i.pravatar.cc/150?img=1",
    github_login: "kimdaker",
    global_total_score: 285,
    participated_count: 5,
    global_rank: 1,
    gold_medals: 3,
    silver_medals: 1,
    bronze_medals: 0,
    total_prize_money: 1500000,
  },
  {
    user_id: "dummy-2",
    name: "Lee Hackster",
    avatar_url: "https://i.pravatar.cc/150?img=2",
    github_login: "leehackster",
    global_total_score: 240,
    participated_count: 4,
    global_rank: 2,
    gold_medals: 2,
    silver_medals: 2,
    bronze_medals: 0,
    total_prize_money: 800000,
  },
  {
    user_id: "dummy-3",
    name: "Park Builder",
    avatar_url: "https://i.pravatar.cc/150?img=3",
    github_login: "parkbuilder",
    global_total_score: 210,
    participated_count: 4,
    global_rank: 3,
    gold_medals: 1,
    silver_medals: 2,
    bronze_medals: 1,
    total_prize_money: 500000,
  },
  {
    user_id: "dummy-4",
    name: "Choi Maker",
    avatar_url: "https://i.pravatar.cc/150?img=4",
    github_login: "choimaker",
    global_total_score: 190,
    participated_count: 3,
    global_rank: 4,
    gold_medals: 0,
    silver_medals: 2,
    bronze_medals: 2,
    total_prize_money: 300000,
  },
  {
    user_id: "dummy-5",
    name: "Jung Creator",
    avatar_url: "https://i.pravatar.cc/150?img=5",
    github_login: "jungcreator",
    global_total_score: 160,
    participated_count: 3,
    global_rank: 5,
    gold_medals: 0,
    silver_medals: 1,
    bronze_medals: 2,
    total_prize_money: 100000,
  },
  {
    user_id: "dummy-6",
    name: "Oh Coder",
    avatar_url: "https://i.pravatar.cc/150?img=6",
    github_login: "ohcoder",
    global_total_score: 130,
    participated_count: 2,
    global_rank: 6,
    gold_medals: 0,
    silver_medals: 0,
    bronze_medals: 1,
    total_prize_money: 50000,
  },
];

export const fetchGlobalRankings = async (
  period: "all" | "monthly" | "weekly" = "all",
): Promise<GlobalRanking[]> => {
  console.log("Fetching rankings for period:", period);
  try {
    const { data, error } = await supabase.rpc("get_global_rankings");
    const rows = (data ?? []) as Array<Partial<GlobalRanking>>;
    if (error || rows.length === 0) {
      // RPC 없거나 데이터 없으면 더미 데이터 반환
      return DUMMY_RANKINGS;
    }
    return rows.map((r, i) => ({
      user_id: r.user_id ?? `unknown-${i + 1}`,
      name: r.name ?? `User ${i + 1}`,
      avatar_url: r.avatar_url ?? "https://github.com/ghost.png",
      github_login: r.github_login ?? `unknown${i + 1}`,
      global_total_score: r.global_total_score ?? 0,
      participated_count: r.participated_count ?? 0,
      global_rank: r.global_rank ?? i + 1,
      gold_medals: r.gold_medals ?? (i === 0 ? 2 : i === 1 ? 1 : 0),
      silver_medals: r.silver_medals ?? (i === 1 ? 2 : i === 2 ? 1 : 0),
      bronze_medals: r.bronze_medals ?? (i === 2 ? 2 : i === 3 ? 1 : 0),
      total_prize_money: (r as any).total_prize_money ?? 0,
    }));
  } catch {
    return DUMMY_RANKINGS;
  }
};

// ---- Direct Messages ----
export const fetchDirectMessages = async (
  userId: string,
): Promise<DirectMessage[]> => {
  const { data, error } = await supabase
    .from("direct_messages")
    .select(
      "*, sender:profiles!direct_messages_sender_id_fkey(name, avatar_url, github_login)",
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch DMs Error:", error);
    return [];
  }

  // To get user details, we manually join since wrapper users aren't fully exposed unless joined manually if needed.
  // Wait, direct_messages references public.users. So we can do:
  // .select('*, sender:users!direct_messages_sender_id_fkey(name, avatar_url, github_login), receiver:users!direct_messages_receiver_id_fkey(name, avatar_url, github_login)')

  return data as DirectMessage[];
};

export const sendDirectMessage = async (input: {
  sender_id: string;
  receiver_id: string;
  content: string;
}): Promise<void> => {
  const { error } = await supabase.from("direct_messages").insert(input);
  if (error) throw error;
};
