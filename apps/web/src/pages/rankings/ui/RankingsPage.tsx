import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchRankings } from "@/shared/api/queries"

export function RankingsPage() { 
  const [activeSegment, setActiveSegment] = useState('Global Ranking')
  
  const { data: rankings, isLoading } = useQuery({
    queryKey: ['rankings'],
    queryFn: fetchRankings
  })

  return (
    <div className="pb-24">
      <div className="mb-10">
        <h1 className="text-4xl md:text-[3rem] font-extrabold tracking-tight mb-8 text-[#2c2f31] leading-tight">
          현재 랭킹과 내 기록을<br />확인하세요
        </h1>
        
        {/* Segmented Controls */}
        <div className="inline-flex bg-[#eef1f3] rounded-2xl p-1.5 mb-10 w-full sm:w-auto">
          {['Global Ranking', 'Toss NEXT Hackathon'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSegment(tab)}
              className={`flex-1 sm:flex-none px-6 py-3 font-bold rounded-xl text-[15px] transition-all ${
                activeSegment === tab 
                  ? 'bg-white text-[#2c2f31] shadow-sm' 
                  : 'text-[#9a9d9f] hover:text-[#595c5e]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Personal Dashboard Card */}
        <div className="bg-gradient-to-br from-[#0051d2] to-[#7a9dff] rounded-[2.5rem] p-10 md:p-12 text-white shadow-[0_20px_40px_rgba(0,100,255,0.15)] relative overflow-hidden mb-12">
          {/* Decorative Circle */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
          
          <div className="flex flex-col md:flex-row gap-10 md:items-center justify-between relative z-10">
            <div>
              <p className="text-blue-100 font-semibold mb-2 text-lg">내 현재 순위</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">3</span>
                <span className="text-2xl font-bold text-blue-200">위</span>
              </div>
            </div>
            
            <div className="hidden md:block w-[1px] h-20 bg-blue-300/30" />
            
            <div>
              <p className="text-blue-100 font-semibold mb-2 text-lg">내 총 점수</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">92.3</span>
                <span className="text-2xl font-bold text-blue-200">점</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex-1 md:text-right">
              <button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 px-6 py-3 rounded-full font-bold transition-colors">
                상세 기록 보기
              </button>
            </div>
          </div>
        </div>

        {/* Global Rankings List */}
        <h3 className="text-2xl font-extrabold mb-6 text-[#2c2f31]">Top Teams</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rankings?.map((entry) => {
              const isTop3 = entry.rank <= 3;
              const rankColor = entry.rank === 1 ? 'text-[#e9b824]' : entry.rank === 2 ? 'text-[#8792a1]' : entry.rank === 3 ? 'text-[#cd7f32]' : 'text-[#9a9d9f]';
              
              return (
                <div 
                  key={entry.id} 
                  className="flex items-center p-6 sm:p-8 bg-white rounded-[2rem] border border-slate-100/60 hover:-translate-y-1 transition-transform"
                  style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}
                >
                  <div className={`w-12 sm:w-16 font-extrabold text-2xl sm:text-3xl ${rankColor}`}>
                    {entry.rank}
                  </div>
                  
                  <div className="flex-1 mr-4">
                    <h4 className={`text-lg sm:text-2xl font-bold ${isTop3 ? 'text-[#2c2f31]' : 'text-[#595c5e]'}`}>
                      {entry.team_name}
                    </h4>
                  </div>
                  
                  <div className="text-right flex items-center gap-6">
                    <div className="hidden sm:block">
                      <span className="text-sm font-semibold text-[#9a9d9f] block">Total Score</span>
                      <span className="text-xl font-bold text-[#0064ff]">{entry.total_score}</span>
                    </div>
                    <button className="px-5 py-2.5 font-bold text-sm bg-slate-50 text-[#595c5e] hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap">
                      제출물 보기
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  ) 
}
