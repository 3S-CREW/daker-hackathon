import { Link } from "react-router-dom"
import { type Hackathon } from "@/shared/api/queries"

export function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const isUpcoming = hackathon.status === 'upcoming'
  const isOngoing = hackathon.status === 'ongoing'
  
  const statusColor = isUpcoming ? 'bg-[#eef1f3] text-[#0064ff]' : isOngoing ? 'bg-[#eef1f3] text-[#8d3a8a]' : 'bg-[#eef1f3] text-[#595c5e]'
  const statusLabels = { upcoming: '모집 예정', ongoing: '진행 중', ended: '종료됨' }

  return (
    <div className="flex flex-col bg-white rounded-[2rem] overflow-hidden hover:-translate-y-1 transition-transform border border-slate-100/50" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
      <div className="relative h-48 w-full bg-[#f5f7f9]">
        <img src={hackathon.thumbnail_url} alt={hackathon.title} className="w-full h-full object-cover" />
        <div className="absolute top-5 left-5">
          <span className={`px-4 py-1.5 text-xs font-bold rounded-full tracking-wide ${statusColor}`}>
            {statusLabels[hackathon.status]}
          </span>
        </div>
      </div>
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-3 leading-snug break-keep text-[#2c2f31]">{hackathon.title}</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {hackathon.tags.map(tag => (
            <span key={tag} className="text-xs font-semibold text-[#595c5e] bg-[#f5f7f9] px-3 py-1.5 rounded-xl">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <Link 
            to={`/hackathons/${hackathon.slug}`} 
            className="block w-full text-center py-3.5 bg-[#f5f7f9] text-[#0064ff] font-bold rounded-full hover:bg-[#eef1f3] transition-colors"
          >
            상세보기
          </Link>
        </div>
      </div>
    </div>
  )
}
