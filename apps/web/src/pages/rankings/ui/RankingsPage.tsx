import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { fetchRankings, fetchHackathons } from "@/shared/api/queries"
import { useAuthStore } from "@/shared/store/authStore"

export function RankingsPage() {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null)
  const { user } = useAuthStore()

  const { data: hackathons = [] } = useQuery({
    queryKey: ['hackathons'],
    queryFn: fetchHackathons,
  })

  const { data: rankings = [], isLoading } = useQuery({
    queryKey: ['rankings', selectedHackathonId],
    queryFn: () => fetchRankings(selectedHackathonId ?? undefined),
  })

  const myRanking = user
    ? rankings.find((r) => r.team_id === user.id)
    : null

  const rankColor = (rank: number) =>
    rank === 1 ? 'text-[#e9b824]' : rank === 2 ? 'text-[#8792a1]' : rank === 3 ? 'text-[#cd7f32]' : 'text-[#9a9d9f]'

  return (
    <div className="pb-24">
      <h1 className="text-4xl md:text-[3rem] font-extrabold tracking-tight mb-8 text-[#2c2f31] leading-tight">
        현재 랭킹과 내 기록을<br />확인하세요
      </h1>

      {/* 해커톤 필터 */}
      <div className="inline-flex bg-[#eef1f3] rounded-2xl p-1.5 mb-10 w-full sm:w-auto overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setSelectedHackathonId(null)}
          className={`flex-shrink-0 px-5 py-3 font-bold rounded-xl text-[14px] transition-all whitespace-nowrap ${
            selectedHackathonId === null
              ? 'bg-white text-[#2c2f31] shadow-sm'
              : 'text-[#9a9d9f] hover:text-[#595c5e]'
          }`}
        >
          전체
        </button>
        {hackathons.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHackathonId(h.id)}
            className={`flex-shrink-0 px-5 py-3 font-bold rounded-xl text-[14px] transition-all whitespace-nowrap ${
              selectedHackathonId === h.id
                ? 'bg-white text-[#2c2f31] shadow-sm'
                : 'text-[#9a9d9f] hover:text-[#595c5e]'
            }`}
          >
            {h.title.length > 20 ? h.title.slice(0, 20) + '…' : h.title}
          </button>
        ))}
      </div>

      {/* 개인 대시보드 카드 */}
      <div className="bg-gradient-to-br from-[#0051d2] to-[#7a9dff] rounded-[2.5rem] p-10 md:p-12 text-white shadow-[0_20px_40px_rgba(0,100,255,0.15)] relative overflow-hidden mb-12">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />

        {user ? (
          <div className="flex flex-col md:flex-row gap-10 md:items-center justify-between relative z-10">
            <div>
              <p className="text-blue-100 font-semibold mb-2 text-lg">내 현재 순위</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">
                  {myRanking ? myRanking.rank : '-'}
                </span>
                <span className="text-2xl font-bold text-blue-200">위</span>
              </div>
            </div>

            <div className="hidden md:block w-[1px] h-20 bg-blue-300/30" />

            <div>
              <p className="text-blue-100 font-semibold mb-2 text-lg">내 총 점수</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">
                  {myRanking ? myRanking.total_score : '-'}
                </span>
                <span className="text-2xl font-bold text-blue-200">점</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex-1 md:text-right relative z-10">
              <p className="text-blue-100 text-sm font-semibold">
                {user.user_metadata?.user_name || user.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 text-center py-2">
            <p className="text-blue-100 text-lg font-semibold mb-1">내 순위를 확인하려면</p>
            <p className="text-white text-xl font-extrabold">GitHub 로그인이 필요합니다</p>
          </div>
        )}
      </div>

      {/* 시각화 차트 */}
      {!isLoading && rankings.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* 순위 막대 차트 */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8"
            style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
            <h3 className="text-lg font-extrabold text-[#2c2f31] mb-6">Top {Math.min(rankings.length, 8)} 팀 점수</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={rankings.slice(0, 8)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f7f9" />
                <XAxis
                  dataKey="team_name"
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#9a9d9f' }}
                  tickFormatter={(v: string) => v.length > 6 ? v.slice(0, 6) + '…' : v}
                />
                <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#9a9d9f' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 8px 30px rgba(0,81,210,0.1)', fontWeight: 700 }}
                  formatter={(value: number) => [`${value}점`, '점수']}
                />
                <Bar dataKey="total_score" radius={[8, 8, 0, 0]}>
                  {rankings.slice(0, 8).map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? '#0064ff' : i === 1 ? '#7a9dff' : i === 2 ? '#a8c0ff' : '#eef1f3'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 점수 구성 도넛 차트 */}
          <div className="bg-white rounded-[2rem] p-8"
            style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
            <h3 className="text-lg font-extrabold text-[#2c2f31] mb-6">점수 구성</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: '심사위원', value: 70 },
                    { name: '참가자 투표', value: 30 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#0064ff" />
                  <Cell fill="#a8c0ff" />
                </Pie>
                <Legend
                  iconType="circle"
                  formatter={(value) => <span style={{ fontWeight: 700, fontSize: 12, color: '#595c5e' }}>{value}</span>}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 8px 30px rgba(0,81,210,0.1)', fontWeight: 700 }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs font-semibold text-[#9a9d9f] text-center mt-2">기본 배점 기준</p>
          </div>
        </div>
      )}

      {/* 랭킹 목록 */}
      <h3 className="text-2xl font-extrabold mb-6 text-[#2c2f31]">
        {selectedHackathonId
          ? hackathons.find((h) => h.id === selectedHackathonId)?.title ?? 'Top Teams'
          : 'Top Teams'}
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-bold text-[#2c2f31] mb-2">아직 순위가 없습니다</p>
          <p className="text-[#595c5e]">제출이 완료되면 순위가 표시됩니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center p-6 sm:p-8 bg-white rounded-[2rem] border border-slate-100/60 hover:-translate-y-1 transition-transform"
              style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}
            >
              <div className={`w-12 sm:w-16 font-extrabold text-2xl sm:text-3xl ${rankColor(entry.rank)}`}>
                {entry.rank}
              </div>

              <div className="flex-1 mr-4">
                <h4 className={`text-lg sm:text-2xl font-bold ${entry.rank <= 3 ? 'text-[#2c2f31]' : 'text-[#595c5e]'}`}>
                  {entry.team_name}
                </h4>
              </div>

              <div className="text-right flex items-center gap-4 sm:gap-6">
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold text-[#9a9d9f] block">Total Score</span>
                  <span className="text-xl font-bold text-[#0064ff]">{entry.total_score}</span>
                </div>
                {entry.hackathon_slug ? (
                  <Link
                    to={`/hackathons/${entry.hackathon_slug}`}
                    className="px-5 py-2.5 font-bold text-sm bg-slate-50 text-[#595c5e] hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap"
                  >
                    제출물 보기
                  </Link>
                ) : (
                  <button className="px-5 py-2.5 font-bold text-sm bg-slate-50 text-[#9a9d9f] rounded-xl whitespace-nowrap cursor-default">
                    제출물 보기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
