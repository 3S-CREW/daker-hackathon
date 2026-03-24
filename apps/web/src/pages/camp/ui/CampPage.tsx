import { useQuery } from "@tanstack/react-query"
import { fetchTeams, type Team } from "@/shared/api/queries"

function TeamCard({ team }: { team: Team }) {
  return (
    <div className="flex flex-col bg-white rounded-[2rem] p-8 border border-slate-100 hover:-translate-y-1 transition-transform relative" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-[#2c2f31]">{team.name}</h3>
        {team.recruiting && (
          <span className="px-4 py-1.5 text-xs font-bold rounded-full text-[#0064ff] bg-[#eef1f3]">
            모집 중
          </span>
        )}
      </div>
      
      <p className="text-[#595c5e] text-[15px] leading-relaxed mb-8 flex-1">
        {team.intro}
      </p>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-[#595c5e] font-semibold text-sm">
          <svg className="w-5 h-5 text-[#9a9d9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {team.member_count} / {team.max_members}명
        </div>
        <div className="w-[1px] h-4 bg-slate-200" />
        <div className="flex gap-2 flex-wrap">
          {team.looking_for.map(role => (
            <span key={role} className="text-xs font-semibold text-[#595c5e] bg-[#f5f7f9] px-3 py-1.5 rounded-xl">
              {role}
            </span>
          ))}
        </div>
      </div>
      
      <button className="w-full py-4 text-[#0064ff] font-bold rounded-full bg-[#f5f7f9] hover:bg-[#eef1f3] transition-colors relative active:scale-[0.98]">
        지원하기
      </button>
    </div>
  )
}

export function CampPage() {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams
  })

  return (
    <div className="pb-24 relative">
      <div className="mb-12">
        <h1 className="text-4xl md:text-[3rem] font-extrabold tracking-tight mb-4 text-[#2c2f31] leading-tight">
          함께할 기획/개발/디자인<br />팀원을 찾아보세요
        </h1>
        <p className="text-[#595c5e] text-lg">새로운 도전을 함께할 최고의 팀 빌딩 캠프</p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar">
        <button className="whitespace-nowrap px-6 py-3 rounded-full font-bold text-white bg-[#2c2f31] shadow-md">
          전체 보기
        </button>
        <button className="whitespace-nowrap px-6 py-3 rounded-full font-bold text-[#595c5e] bg-white border border-slate-200 hover:bg-[#f5f7f9] transition-colors">
          모집 중만 보기
        </button>
        <button className="whitespace-nowrap px-6 py-3 rounded-full font-bold text-[#595c5e] bg-white border border-slate-200 hover:bg-[#f5f7f9] transition-colors">
          프론트엔드 구함
        </button>
        <button className="whitespace-nowrap px-6 py-3 rounded-full font-bold text-[#595c5e] bg-white border border-slate-200 hover:bg-[#f5f7f9] transition-colors">
          디자이너 구함
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-80 bg-white rounded-[2rem] animate-pulse border border-slate-100" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams?.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="shadow-[0_20px_40px_rgba(0,100,255,0.3)] bg-gradient-to-r from-[#0051d2] to-[#7a9dff] text-white font-bold text-lg px-8 py-5 rounded-full hover:scale-[1.05] transition-transform active:scale-95 flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          새로운 팀 만들기
        </button>
      </div>
    </div>
  ) 
}
