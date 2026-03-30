import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AIChatModal } from "@/features/ai-chat"
import { fetchHackathonBySlug, fetchTeamsByHackathon, fetchRankingsByHackathon, fetchHackathonDetails, type Team, type RankingEntry } from "@/shared/api/queries"
import { SubmitForm } from "@/features/submit-hackathon"
import { CreateTeamModal } from "@/features/create-team"

const TABS = ['Overview', 'Info', 'Eval', 'Schedule', 'Prize', 'Teams', 'Submit', 'Leaderboard'] as const
type Tab = typeof TABS[number]

// ---- 탭별 컨텐츠 컴포넌트 ----

function ScheduleTab({ deadline, endAt }: { deadline: string; endAt: string }) {
  const fmt = (d: string) =>
    new Date(d).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-[#2c2f31]">대회 일정</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-6 p-6 bg-[#f5f7f9] rounded-2xl">
          <div className="w-3 h-3 rounded-full bg-[#0064ff] shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-1">제출 마감</p>
            <p className="text-xl font-bold text-[#2c2f31]">{fmt(deadline)}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 p-6 bg-[#f5f7f9] rounded-2xl">
          <div className="w-3 h-3 rounded-full bg-[#8d3a8a] shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-1">대회 종료</p>
            <p className="text-xl font-bold text-[#2c2f31]">{fmt(endAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrizeTab({ totalPrize, teamSize }: { totalPrize?: string; teamSize?: string }) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-[#2c2f31]">시상 정보</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-8 bg-gradient-to-br from-[#0051d2] to-[#7a9dff] rounded-[2rem] text-white">
          <p className="text-blue-200 font-semibold mb-2 text-sm uppercase tracking-wider">총 상금</p>
          <p className="text-3xl font-extrabold">{totalPrize || 'TBD'}</p>
        </div>
        <div className="p-8 bg-[#f5f7f9] rounded-[2rem]">
          <p className="text-[#9a9d9f] font-semibold mb-2 text-sm uppercase tracking-wider">팀 규모</p>
          <p className="text-3xl font-extrabold text-[#2c2f31]">{teamSize || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

function TeamsTab({ hackathonId }: { hackathonId: string }) {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams', hackathonId],
    queryFn: () => fetchTeamsByHackathon(hackathonId),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-[#2c2f31]">참가 팀</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-colors text-sm"
        >
          + 팀 만들기
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#f5f7f9] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-bold text-[#2c2f31] mb-2">아직 팀이 없습니다</p>
          <p className="text-[#595c5e] mb-6">첫 번째 팀을 만들어보세요!</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-8 py-4 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-colors"
          >
            팀 만들기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team: Team) => (
            <div key={team.id} className="flex items-center justify-between p-6 bg-[#f5f7f9] rounded-2xl">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-bold text-[#2c2f31]">{team.name}</span>
                  {team.recruiting && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full text-[#0064ff] bg-white">모집 중</span>
                  )}
                </div>
                <p className="text-[#595c5e] text-sm line-clamp-1">{team.intro}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {team.looking_for.map((role) => (
                    <span key={role} className="text-xs font-semibold text-[#595c5e] bg-white px-2.5 py-1 rounded-lg">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-6 text-right shrink-0">
                <p className="text-sm text-[#9a9d9f] font-semibold">{team.member_count}/{team.max_members}명</p>
                {team.contact_url && (
                  <a
                    href={team.contact_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-4 py-2 text-sm font-bold text-[#0064ff] bg-white rounded-xl hover:bg-[#eef1f3] transition-colors"
                  >
                    지원하기
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTeamModal
        hackathonId={hackathonId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

function LeaderboardTab({ hackathonId }: { hackathonId: string }) {
  const { data: rankings = [], isLoading } = useQuery({
    queryKey: ['rankings', hackathonId],
    queryFn: () => fetchRankingsByHackathon(hackathonId),
  })

  const rankColor = (rank: number) =>
    rank === 1 ? 'text-[#e9b824]' : rank === 2 ? 'text-[#8792a1]' : rank === 3 ? 'text-[#cd7f32]' : 'text-[#9a9d9f]'

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-[#2c2f31]">리더보드</h3>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-[#f5f7f9] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-bold text-[#2c2f31] mb-2">아직 순위가 없습니다</p>
          <p className="text-[#595c5e]">제출이 완료되면 순위가 표시됩니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.map((entry: RankingEntry) => (
            <div
              key={entry.id}
              className="flex items-center p-6 bg-[#f5f7f9] rounded-2xl"
            >
              <span className={`w-12 text-2xl font-extrabold ${rankColor(entry.rank)}`}>
                {entry.rank}
              </span>
              <span className="flex-1 text-lg font-bold text-[#2c2f31]">{entry.team_name}</span>
              <span className="text-xl font-extrabold text-[#0064ff]">{entry.total_score}점</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailContentTab({ title, content }: { title: string; content?: any }) {
  if (!content) return <ComingSoonTab tab={title} />

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">{title}</h3>
      <div className="text-[#595c5e] leading-relaxed text-lg whitespace-pre-wrap">
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </div>
    </div>
  )
}

function ComingSoonTab({ tab }: { tab: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-5xl font-extrabold text-[#eef1f3] mb-4">{tab}</p>
      <p className="text-[#595c5e] text-lg font-semibold">콘텐츠 준비 중입니다.</p>
    </div>
  )
}

// ---- 메인 페이지 ----

export function HackathonDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [chatOpen, setChatOpen] = useState(false)

  const { data: hackathon, isLoading: isHackathonLoading } = useQuery({
    queryKey: ['hackathon', slug],
    queryFn: () => fetchHackathonBySlug(slug!),
  })

  const { data: details, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['hackathonDetails', hackathon?.id],
    queryFn: () => fetchHackathonDetails(hackathon!.id),
    enabled: !!hackathon?.id,
  })

  if (isHackathonLoading) return <div className="animate-pulse h-[600px] w-full bg-white rounded-[3rem]" />
  if (!hackathon) return <div className="text-center py-20 text-2xl font-bold">Hackathon not found</div>

  const isUpcoming = hackathon.status === 'upcoming'
  const isOngoing = hackathon.status === 'ongoing'
  const statusColor = isUpcoming
    ? 'bg-[#eef1f3] text-[#0064ff]'
    : isOngoing
    ? 'bg-[#eef1f3] text-[#8d3a8a]'
    : 'bg-[#eef1f3] text-[#595c5e]'
  const statusLabels = { upcoming: '모집 예정', ongoing: '진행 중', ended: '종료됨' }

  return (
    <div className="pb-32 relative">
      {/* Hero */}
      <div className="bg-white rounded-[3rem] p-10 md:p-14 mb-10 overflow-hidden relative" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
        <div className="mb-6">
          <span className={`px-5 py-2 text-sm font-bold rounded-full tracking-wide inline-block ${statusColor}`}>
            {statusLabels[hackathon.status]}
          </span>
        </div>

        <h1 className="text-4xl md:text-[3.5rem] leading-tight font-extrabold tracking-tight mb-8 text-[#2c2f31]">
          {hackathon.title}
        </h1>

        <div className="flex flex-wrap gap-6 mb-10">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#9a9d9f] uppercase tracking-wider">팀 규모</span>
            <span className="text-xl font-bold text-[#2c2f31]">{hackathon.team_size || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#9a9d9f] uppercase tracking-wider">총 상금</span>
            <span className="text-xl font-bold text-[#0064ff]">{hackathon.total_prize || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#9a9d9f] uppercase tracking-wider">제출 마감</span>
            <span className="text-xl font-bold text-[#2c2f31]">
              {new Date(hackathon.submission_deadline_at).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {hackathon.tags.map((tag) => (
            <span key={tag} className="text-sm font-semibold text-[#595c5e] bg-[#f5f7f9] px-4 py-2 rounded-xl">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Tab Nav */}
      <div className="sticky top-16 z-40 bg-[#f5f7f9]/90 backdrop-blur-md pt-4 pb-0 mb-8 overflow-x-auto custom-scrollbar">
        <div className="flex gap-6 border-b-2 border-slate-200/50 text-[#595c5e] font-bold text-[15px] px-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-[#0064ff]' : 'hover:text-[#2c2f31]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-[#0064ff] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 min-h-[500px]" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
        {activeTab === 'Overview' && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">대회 소개</h3>
            <p className="text-[#595c5e] leading-relaxed text-lg">{hackathon.description}</p>
            {details?.overview_json && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <DetailContentTab title="추가 개요" content={details.overview_json} />
              </div>
            )}
          </div>
        )}
        {activeTab === 'Info' && <DetailContentTab title="공지/규칙" content={details?.info_json} />}
        {activeTab === 'Eval' && <DetailContentTab title="평가 기준" content={details?.eval_json} />}
        {activeTab === 'Schedule' && (
          <ScheduleTab
            deadline={hackathon.submission_deadline_at}
            endAt={hackathon.end_at}
          />
        )}
        {activeTab === 'Prize' && (
          <PrizeTab
            totalPrize={hackathon.total_prize}
            teamSize={hackathon.team_size}
          />
        )}
        {activeTab === 'Teams' && <TeamsTab hackathonId={hackathon.id} />}
        {activeTab === 'Submit' && (
          <SubmitForm
            hackathonId={hackathon.id}
            onSuccess={() => setActiveTab('Leaderboard')}
          />
        )}
        {activeTab === 'Leaderboard' && <LeaderboardTab hackathonId={hackathon.id} />}
      </div>

      {/* Floating CTA */}
      {hackathon.status !== 'ended' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
          <button
            onClick={() => setActiveTab('Submit')}
            className="w-full shadow-[0_20px_40px_rgba(0,100,255,0.3)] bg-gradient-to-r from-[#0051d2] to-[#7a9dff] text-white font-bold text-xl py-5 rounded-full hover:scale-[1.02] transition-transform active:scale-95"
          >
            대회 참가하기
          </button>
        </div>
      )}

      {/* AI 챗봇 플로팅 버튼 */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-[#0051d2] to-[#7a9dff] text-white font-extrabold text-lg shadow-[0_8px_30px_rgba(0,81,210,0.35)] hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
        aria-label="AI 도우미 열기"
      >
        AI
      </button>

      <AIChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        hackathonId={hackathon.id}
      />
    </div>
  )
}
