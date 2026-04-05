import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHackathons } from '@/shared/api/queries'
import { HackathonCard } from '@/entities/hackathon/ui/HackathonCard'

// 커스텀 드롭다운 - 항상 아래로 열림
function TagDropdown({ tags, value, onChange }: { tags: string[]; value: string | null; onChange: (v: string | null) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = tags.filter(t => t.toLowerCase().includes(search.toLowerCase()))
  const displayLabel = value ? `#${value}` : '모든 태그'

  return (
    <div ref={ref} className="relative w-60">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full h-11 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#2c2f31] focus:outline-none focus:ring-2 focus:ring-[#0064ff]/20 focus:border-[#0064ff] transition-all flex items-center justify-between cursor-pointer hover:border-slate-300"
      >
        <span className={value ? 'text-[#0064ff]' : 'text-[#9a9d9f]'}>{displayLabel}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`text-[#9a9d9f] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
          {/* 검색 */}
          <div className="p-3 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="태그 검색..."
              className="w-full px-3 py-2 text-sm bg-[#f5f7f9] rounded-xl border-none outline-none font-semibold text-[#2c2f31] placeholder:text-[#9a9d9f]"
            />
          </div>

          {/* 옵션 목록 */}
          <div className="max-h-52 overflow-y-auto custom-scrollbar py-2">
            <button
              type="button"
              onClick={() => { onChange(null); setSearch(''); setOpen(false) }}
              className={`w-full px-4 py-2.5 text-left text-sm font-bold transition-colors cursor-pointer ${!value ? 'text-[#0064ff] bg-blue-50' : 'text-[#595c5e] hover:bg-[#f5f7f9]'}`}
            >
              모든 태그
            </button>
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#9a9d9f] text-center font-medium">검색 결과 없음</p>
            ) : (
              filtered.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { onChange(tag); setSearch(''); setOpen(false) }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-bold transition-colors cursor-pointer ${value === tag ? 'text-[#0064ff] bg-blue-50' : 'text-[#595c5e] hover:bg-[#f5f7f9]'}`}
                >
                  #{tag}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

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
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
          <TagDropdown
            tags={availableTags}
            value={tagFilter}
            onChange={setTagFilter}
          />
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
