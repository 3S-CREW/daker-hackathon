import { Link } from "react-router-dom"
import { type Hackathon } from "@/shared/api/queries"

export function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const isUpcoming = hackathon.status === 'upcoming'
  const isOngoing = hackathon.status === 'ongoing'
  
  const statusColor = isUpcoming ? 'bg-[#eef1f3] text-[#0064ff]' : isOngoing ? 'bg-[#eef1f3] text-[#8d3a8a]' : 'bg-[#eef1f3] text-[#595c5e]'
  const statusLabels = { upcoming: '모집 예정', ongoing: '진행 중', ended: '종료됨' }

  return (
    <Link 
      to={`/hackathons/${hackathon.slug}`}
      className="group flex flex-col bg-white rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,100,255,0.08)] transition-all cursor-pointer border border-slate-100/50" 
      style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}
    >
      <div className="relative h-[200px] w-full bg-[#f5f7f9] overflow-hidden">
        <img 
          src={hackathon.thumbnail_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'} 
          alt={hackathon.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute bottom-4 left-5">
          <span className={`px-4 py-1.5 text-[13px] font-extrabold rounded-full tracking-wide shadow-sm ${statusColor}`}>
            {statusLabels[hackathon.status]}
          </span>
        </div>
      </div>
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-3 leading-snug break-keep text-[#2c2f31] group-hover:text-[#0064ff] transition-colors">
          {hackathon.title}
        </h3>
        
        <div className="flex flex-col gap-1.5 mb-6 text-sm text-[#595c5e] font-medium">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{new Date(hackathon.start_at || hackathon.submission_deadline_at).toLocaleDateString('ko-KR')} ~ {new Date(hackathon.end_at).toLocaleDateString('ko-KR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>현재 참가자 수: {hackathon.participants_count || Math.floor(Math.random() * 50) + 10}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {hackathon.tags.map(tag => (
            <span key={tag} className="text-[13px] font-bold text-[#9a9d9f] bg-[#f5f7f9] px-3 py-1.5 rounded-xl">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

