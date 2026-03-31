import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHackathons } from '@/shared/api/queries'
import { HackathonCard } from '@/entities/hackathon/ui/HackathonCard'

export function HackathonListPage() { 
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all')
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const { data: hackathons, isLoading } = useQuery({
    queryKey: ['hackathons'],
    queryFn: fetchHackathons
  })

  // 모든 해커톤에서 유일한 태그 목록 추출
  const availableTags = Array.from(new Set(hackathons?.flatMap(h => h.tags) || []))

  // 필터 적용
  const filteredHackathons = hackathons?.filter(h => {
    const matchStatus = statusFilter === 'all' || h.status === statusFilter
    const matchTag = !tagFilter || h.tags.includes(tagFilter)
    return matchStatus && matchTag
  })

  return (
    <div className="pb-10">
      <h1 className="text-3xl md:text-[3rem] leading-tight font-extrabold mb-10 tracking-tight text-[#2c2f31]">
        모든 해커톤을<br />한 곳에서 모아보세요
      </h1>

      {/* 필터 영역 */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="flex bg-[#eef1f3] p-1.5 rounded-2xl w-max">
          {(['all', 'upcoming', 'ongoing', 'ended'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                statusFilter === status 
                  ? 'bg-white text-[#2c2f31] shadow-sm' 
                  : 'text-[#9a9d9f] hover:text-[#595c5e]'
              }`}
            >
              {status === 'all' ? '전체' : status === 'upcoming' ? '모집 예정' : status === 'ongoing' ? '진행 중' : '종료됨'}
            </button>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setTagFilter(null)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                tagFilter === null 
                  ? 'bg-[#2c2f31] text-white border-[#2c2f31]' 
                  : 'bg-white text-[#595c5e] border-slate-200 hover:bg-[#f5f7f9]'
              }`}
            >
              All Tags
            </button>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                  tagFilter === tag 
                    ? 'bg-[#0064ff] text-white border-[#0064ff]' 
                    : 'bg-white text-[#595c5e] border-slate-200 hover:bg-[#f5f7f9]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-96 bg-white rounded-[2rem] animate-pulse border border-slate-100" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHackathons?.map(h => (
            <HackathonCard key={h.slug} hackathon={h} />
          ))}
          {filteredHackathons?.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#9a9d9f] font-semibold">조건에 맞는 해커톤이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  ) 
}
