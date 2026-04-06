import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchGlobalRankings } from "@/shared/api/queries"
import { useAuthStore } from "@/shared/store/authStore"

export function RankingsPage() {
  const { user } = useAuthStore()
  const [period, setPeriod] = useState<'all' | 'monthly' | 'weekly'>('all')
  const [rankingType, setRankingType] = useState<'points' | 'participation' | 'medals' | 'prize'>('points')

  const { data: rawRankings = [], isLoading } = useQuery({
    queryKey: ['global_rankings', period],
    queryFn: () => fetchGlobalRankings(period),
  })

  // 정렬 로직
  const rankings = [...rawRankings].sort((a, b) => {
    if (rankingType === 'medals') {
      if (b.gold_medals !== a.gold_medals) return b.gold_medals - a.gold_medals
      if (b.silver_medals !== a.silver_medals) return b.silver_medals - a.silver_medals
      if (b.bronze_medals !== a.bronze_medals) return b.bronze_medals - a.bronze_medals
      return b.global_total_score - a.global_total_score
    } else if (rankingType === 'participation') {
      return b.participated_count - a.participated_count
    } else if (rankingType === 'prize') {
      return b.total_prize_money - a.total_prize_money
    } else {
      // points (default)
      return b.global_total_score - a.global_total_score
    }
  }).map((r, idx) => ({ ...r, display_rank: idx + 1 }))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
      .format(price)
      .replace('₩', '') + '원';
  }

  const getMetricValue = (entry: any) => {
    switch(rankingType) {
      case 'participation': return `${entry.participated_count}회`
      case 'prize': return formatPrice(entry.total_prize_money)
      case 'medals': return `${entry.gold_medals}🥇`
      default: return `${entry.global_total_score}pts`
    }
  }

  const myRanking = user
    ? rankings.find((r) => r.user_id === user.id)
    : null

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-[#e9b824] bg-[#fffcf3] border-[#fde8a1]'
      case 2: return 'text-[#8792a1] bg-[#f5f7f9] border-[#e2e8f0]'
      case 3: return 'text-[#cd7f32] bg-[#fff7ef] border-[#f5d0b5]'
      default: return 'text-[#9a9d9f] bg-white border-slate-100'
    }
  }

  const top3 = rankings.slice(0, 3)
  const others = rankings.slice(3)

  return (
    <div className="pb-24">
      <div className="text-center mb-10 mt-8">
        <h1 className="text-4xl md:text-[3.5rem] font-extrabold tracking-tight mb-4 text-[#2c2f31] leading-tight">
          랭킹 🏆
        </h1>
        <p className="text-xl text-[#595c5e] font-medium mb-10">금메달 순 올림픽 방식으로 정렬됩니다</p>
        
        {/* 기간 필터 */}
        <div className="inline-flex bg-[#eef1f3] rounded-2xl p-1.5 mb-2 shadow-sm border border-slate-200/50">
          {(['all', 'monthly', 'weekly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                period === p 
                ? 'bg-white text-[#2c2f31] shadow-md scale-[1.02]' 
                : 'text-[#9a9d9f] hover:text-[#595c5e]'
              }`}
            >
              {p === 'all' ? '전체 기간' : p === 'monthly' ? '이번 달' : '이번 주'}
            </button>
          ))}
        </div>

        {/* 랭킹 기준 필터 */}
        <div className="flex justify-center gap-3 mt-4">
          {(['points', 'participation', 'medals', 'prize'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setRankingType(type)}
              className={`px-5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer border ${
                rankingType === type
                ? 'bg-[#0064ff] text-white border-[#0064ff] shadow-md'
                : 'bg-white text-[#595c5e] border-slate-200 hover:border-slate-300'
              }`}
            >
              {type === 'points' ? '종합 점수' : type === 'participation' ? '참여 횟수' : type === 'medals' ? '메달 기록' : '총 상금'}
            </button>
          ))}
        </div>
      </div>

      {/* 개인 대시보드 카드 */}
      <div className="bg-gradient-to-br from-[#1a1c29] to-[#2c2f42] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-20 max-w-5xl mx-auto">
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] mix-blend-screen" />

        {user ? (
          <div className="flex flex-col md:flex-row gap-10 md:items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <img 
                src={user.user_metadata?.avatar_url || 'https://github.com/ghost.png'} 
                alt="My Avatar" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white/10 shadow-xl"
              />
              <div>
                <p className="text-blue-200 font-bold mb-1 text-sm tracking-wider uppercase">My Rank</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
                    {myRanking ? myRanking.display_rank : '-'}
                  </span>
                  <span className="text-2xl font-bold text-blue-300">위</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block w-[1px] h-20 bg-white/10" />

            <div>
               <p className="text-blue-200 font-bold mb-1 text-sm tracking-wider uppercase">Total Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#80bfff] to-[#ffffff]">
                  {myRanking ? myRanking.global_total_score : '-'}
                </span>
                <span className="text-xl md:text-2xl font-bold text-blue-300">PTS</span>
              </div>
              {myRanking && (
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-lg">🥇</span>
                    <span className="font-bold text-white">{myRanking.gold_medals}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-lg">🥈</span>
                    <span className="font-bold text-white">{myRanking.silver_medals}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-lg">🥉</span>
                    <span className="font-bold text-white">{myRanking.bronze_medals}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex flex-col items-end">
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-blue-200 mb-3">
                Team Leader
              </span>
              <p className="text-white text-lg font-bold">
                {user.user_metadata?.user_name || user.email}
              </p>
              <p className="text-blue-200/60 text-sm font-medium">@{user.user_metadata?.preferred_username || 'user'}</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 text-center py-8">
            <p className="text-blue-200 text-lg font-bold mb-2">내 랭킹과 누적 상금을 확인하려면</p>
            <p className="text-white text-3xl font-extrabold tracking-tight">GitHub 로그인이 필요합니다</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-12 h-12 border-4 border-[#0064ff] border-t-transparent rounded-full" />
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100">
          <p className="text-xl font-bold text-[#2c2f31] mb-2">아직 집계된 랭킹이 없습니다</p>
          <p className="text-[#595c5e] font-medium">첫 번째 해커톤 결과를 기다리는 중입니다.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium (데스크탑에서만 제대로 보이고 모바일은 리스트처럼) */}
          {top3.length > 0 && (
            <div className="flex flex-col md:flex-row justify-center items-end gap-6 lg:gap-10 mb-20 max-w-5xl mx-auto px-4">
              {/* 2위 */}
              {top3[1] && (
                <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center group">
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-[#e2e8f0] bg-white shadow-xl relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                    <img src={top3[1].avatar_url} alt="2nd" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gradient-to-t from-[#f5f7f9] to-white border border-[#e2e8f0] rounded-t-3xl pt-8 pb-6 px-4 text-center shadow-lg relative -top-10 h-48 md:h-56 flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-[#2c2f31] truncate w-full">{top3[1].name}</h3>
                    <p className="text-sm font-semibold text-[#8792a1] mb-4">@{top3[1].github_login}</p>
                    <div className="text-3xl font-extrabold text-[#8792a1] tracking-tighter">
                      {rankingType === 'prize' ? formatPrice(top3[1].total_prize_money) : rankingType === 'participation' ? `${top3[1].participated_count}회` : `${top3[1].global_total_score} pts`}
                    </div>
                  </div>
                </div>
              )}

              {/* 1위 */}
              {top3[0] && (
                <div className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center group relative z-20">
                  <div className="absolute -top-10 text-4xl mb-4 animate-bounce">👑</div>
                  <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-[#e9b824] bg-white shadow-2xl relative z-10 group-hover:-translate-y-3 transition-transform duration-300">
                    <img src={top3[0].avatar_url} alt="1st" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gradient-to-t from-[#fffcf3] to-white border-2 border-[#fde8a1] rounded-t-3xl pt-8 pb-8 px-4 text-center shadow-2xl relative -top-10 h-56 md:h-72 flex flex-col justify-end">
                    <h3 className="text-2xl font-black text-[#2c2f31] truncate w-full">{top3[0].name}</h3>
                    <p className="text-sm font-bold text-[#cd9018] mb-5">@{top3[0].github_login}</p>
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <span>🥇</span><span className="font-bold text-[#e9b824]">{top3[0].gold_medals}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#8792a1]">
                        <span>🥈</span><span className="font-bold">{top3[0].silver_medals}</span>
                      </div>
                    </div>
                    <div className="text-4xl font-extrabold text-[#e9b824] tracking-tighter">
                      {rankingType === 'prize' ? formatPrice(top3[0].total_prize_money) : rankingType === 'participation' ? `${top3[0].participated_count}회` : `${top3[0].global_total_score} pts`}
                    </div>
                  </div>
                </div>
              )}

              {/* 3위 */}
              {top3[2] && (
                <div className="w-full md:w-1/3 order-3 flex flex-col items-center group">
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-[#f5d0b5] bg-white shadow-xl relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                    <img src={top3[2].avatar_url} alt="3rd" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gradient-to-t from-[#fff7ef] to-white border border-[#f5d0b5] rounded-t-3xl pt-8 pb-6 px-4 text-center shadow-lg relative -top-10 h-44 md:h-48 flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-[#2c2f31] truncate w-full">{top3[2].name}</h3>
                    <p className="text-sm font-semibold text-[#cd7f32] mb-3">@{top3[2].github_login}</p>
                    <div className="text-2xl font-extrabold text-[#cd7f32] tracking-tighter">
                      {rankingType === 'prize' ? formatPrice(top3[2].total_prize_money) : rankingType === 'participation' ? `${top3[2].participated_count}회` : `${top3[2].global_total_score} pts`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 그 외 랭킹 리스트 */}
          {others.length > 0 && (
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              {others.map((entry) => (
                <div 
                  key={entry.user_id}
                  className="flex items-center p-4 sm:p-6 bg-white rounded-[2rem] border border-slate-100/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  style={{ boxShadow: '0 10px 30px rgba(0, 81, 210, 0.03)' }}
                >
                  <div className={`w-16 font-extrabold text-2xl text-center ${getRankColor(entry.display_rank).split(' ')[0]}`}>
                    {entry.display_rank}
                  </div>

                  <img 
                    src={entry.avatar_url} 
                    alt={entry.name} 
                    className="w-14 h-14 rounded-full object-cover bg-slate-100 mr-5"
                  />

                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-lg sm:text-xl font-bold text-[#2c2f31] truncate">
                      {entry.name}
                    </h4>
                    <div className="flex gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-xs font-bold text-[#e9b824]">
                        🥇 {entry.gold_medals}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#8792a1]">
                        🥈 {entry.silver_medals}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#cd7f32]">
                        🥉 {entry.bronze_medals}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-1">
                      {rankingType === 'prize' ? 'Prize' : rankingType === 'participation' ? 'Count' : 'Score'}
                    </div>
                    <div className={`text-xl sm:text-2xl font-extrabold tracking-tighter ${rankingType === 'prize' ? 'text-[#e9b824]' : 'text-[#0064ff]'}`}>
                      {getMetricValue(entry)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
