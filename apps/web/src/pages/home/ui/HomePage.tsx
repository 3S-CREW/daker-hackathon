import { Link } from "react-router-dom"

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#2c2f31]">
        해커톤의 모든 것, Daker
      </h1>
      <p className="text-[1.125rem] text-[#595c5e] mb-10 max-w-xl leading-relaxed">
        대회 탐색부터 팀 빌딩, 제출, 그리고 화려한 포트폴리오 생성까지 단 한 곳에서 해결하세요.
      </p>
      {/* 3개의 메인 메뉴 카드 추가 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
        <Link
          to="/hackathons"
          className="group flex flex-col items-start p-8 bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_20px_40px_rgba(0,100,255,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,100,255,0.08)] transition-all cursor-pointer text-left"
        >
          <div className="w-14 h-14 bg-blue-50 text-[#0064ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h3 className="text-2xl font-extrabold text-[#2c2f31] mb-3">해커톤 보러가기</h3>
          <p className="text-[#595c5e] font-medium leading-relaxed">
            진행 중이거나 다가오는 해커톤을 찾아보고 새로운 도전을 시작하세요.
          </p>
        </Link>
        <Link
          to="/camp"
          className="group flex flex-col items-start p-8 bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_20px_40px_rgba(0,100,255,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,100,255,0.08)] transition-all cursor-pointer text-left"
        >
          <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 className="text-2xl font-extrabold text-[#2c2f31] mb-3">팀원 모집</h3>
          <p className="text-[#595c5e] font-medium leading-relaxed">
            나와 핏이 맞는 완벽한 팀원을 찾거나 흥미로운 프로젝트에 합류하세요.
          </p>
        </Link>
        <Link
          to="/rankings"
          className="group flex flex-col items-start p-8 bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_20px_40px_rgba(0,100,255,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,100,255,0.08)] transition-all cursor-pointer text-left"
        >
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
          <h3 className="text-2xl font-extrabold text-[#2c2f31] mb-3">랭킹 보기</h3>
          <p className="text-[#595c5e] font-medium leading-relaxed">
            영광의 리더보드를 확인하고 다른 팀들과 선의의 경쟁을 펼치세요.
          </p>
        </Link>
      </div>
    </div>
  )
}
