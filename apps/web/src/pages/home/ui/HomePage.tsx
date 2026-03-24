import { Link } from "react-router-dom"

export function HomePage() { 
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#2c2f31]">해커톤의 모든 것, Daker</h1>
      <p className="text-[1.125rem] text-[#595c5e] mb-10 max-w-xl leading-relaxed">
        대회 탐색부터 팀 빌딩, 제출, 그리고 화려한 포트폴리오 생성까지 단 한 곳에서 해결하세요.
      </p>
      <Link 
        to="/hackathons" 
        className="px-8 py-4 bg-[#0064ff] text-white rounded-full font-bold text-lg hover:bg-[#0051d2] transition shadow-lg shadow-[#0064ff]/20"
      >
        해커톤 둘러보기
      </Link>
    </div>
  ) 
}
