import { supabase } from './supabase'

export type Hackathon = {
  id: string
  slug: string
  title: string
  status: 'upcoming' | 'ongoing' | 'ended'
  tags: string[]
  thumbnail_url: string
  submission_deadline_at: string
  end_at: string
  timezone: string
  description?: string
  team_size?: string
  total_prize?: string
}

export type Team = {
  id: string
  hackathon_id: string
  name: string
  recruiting: boolean
  member_count: number
  max_members: number
  looking_for: string[]
  intro: string
}

export type RankingEntry = {
  id: string
  hackathon_id: string
  team_id: string
  rank: number
  total_score: number
  team_name?: string
}

export const fetchHackathons = async (): Promise<Hackathon[]> => {
  const { data, error } = await supabase.from('hackathons').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Fetch Hackathons Error:', error)
    return []
  }
  return data as Hackathon[]
}

export const fetchHackathonBySlug = async (slug: string): Promise<Hackathon | undefined> => {
  const { data, error } = await supabase.from('hackathons').select('*').eq('slug', slug).single()
  if (error) {
    console.error('Fetch Hackathon Error:', error)
    return undefined
  }
  return (data as Hackathon) || undefined
}

export const fetchTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase.from('teams').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Fetch Teams Error:', error)
    return []
  }
  return data as Team[]
}

export const fetchRankings = async (): Promise<RankingEntry[]> => {
  const { data, error } = await supabase.from('leaderboard').select('*, teams(name)').order('total_score', { ascending: false })
  if (error) {
    console.error('Fetch Rankings Error:', error)
    return []
  }
  
  return data.map((entry, index) => ({
    id: entry.id,
    hackathon_id: entry.hackathon_id,
    team_id: entry.team_id,
    rank: index + 1,
    total_score: entry.total_score,
    team_name: entry.teams?.name || 'Unknown Team'
  })) as RankingEntry[]
}
