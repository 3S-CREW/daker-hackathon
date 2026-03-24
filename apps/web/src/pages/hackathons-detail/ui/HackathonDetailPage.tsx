import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchHackathonBySlug } from "@/shared/api/queries"

export function HackathonDetailPage() { 
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState('Overview')
  
  const { data: hackathon, isLoading } = useQuery({
    queryKey: ['hackathon', slug],
    queryFn: () => fetchHackathonBySlug(slug!)
  })

  if (isLoading) return <div className="animate-pulse h-[600px] w-full bg-white rounded-[3rem]" />
  if (!hackathon) return <div className="text-center py-20 text-2xl font-bold">Hackathon not found</div>

  const isUpcoming = hackathon.status === 'upcoming'
  const isOngoing = hackathon.status === 'ongoing'
  
  const statusColor = isUpcoming ? 'bg-[#eef1f3] text-[#0064ff]' : isOngoing ? 'bg-[#eef1f3] text-[#8d3a8a]' : 'bg-[#eef1f3] text-[#595c5e]'
  const statusLabels = { upcoming: '모집 예정', ongoing: '진행 중', ended: '종료됨' }

  return (
    <div className="pb-24 relative">
      {/* Hero Section */}
      <div className="bg-white rounded-[3rem] p-10 md:p-14 mb-10 overflow-hidden relative" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
        <div className="mb-6 flex items-start justify-between">
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
            <span className="text-sm font-semibold text-[#9a9d9f] uppercase tracking-wider">일정</span>
            <span className="text-xl font-bold text-[#2c2f31]">
              {new Date(hackathon.submission_deadline_at).toLocaleDateString()} 마감
            </span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {hackathon.tags.map(tag => (
            <span key={tag} className="text-sm font-semibold text-[#595c5e] bg-[#f5f7f9] px-4 py-2 rounded-xl">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Sticky Tab Navigation */}
      <div className="sticky top-16 z-40 bg-[#f5f7f9]/90 backdrop-blur-md pt-4 pb-0 mb-8 overflow-x-auto custom-scrollbar">
        <div className="flex gap-8 border-b-2 border-slate-200/50 text-[#595c5e] font-bold text-lg px-2">
          {['Overview', 'Schedule', 'Rules', 'Leaderboard', 'Submit'].map((tab) => (
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
      
      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 min-h-[500px]" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
        {activeTab === 'Overview' && (
          <div className="prose prose-lg prose-slate max-w-none">
            <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">대회 소개</h3>
            <p className="text-[#595c5e] leading-relaxed text-lg">
              {hackathon.description}
            </p>
            <div className="mt-12 p-8 bg-[#f5f7f9] rounded-3xl">
              {/* The content that was mistakenly identified as a "dummy tabs block" but is actually part of the Overview tab.
                  Based on the instruction's "Code Edit" snippet, this block is to be removed. */}
            </div>
          </div>
        )}
        {activeTab !== 'Overview' && (
          <div className="text-[#595c5e] text-lg font-medium text-center py-20 flex flex-col items-center justify-center">
            <span className="text-4xl mb-4">🚧</span>
            <p>{activeTab} 콘텐츠가 준비 중입니다.</p>
          </div>
        )}
      </div>

      {/* Floating CTA Button (Toss Style) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
        <button 
          className="w-full shadow-[0_20px_40px_rgba(0,100,255,0.3)] bg-gradient-to-r from-[#0051d2] to-[#7a9dff] text-white font-bold text-xl py-5 rounded-full hover:scale-[1.02] transition-transform active:scale-95"
        >
          대회 참가하기
        </button>
      </div>
    </div>
  ) 
}
