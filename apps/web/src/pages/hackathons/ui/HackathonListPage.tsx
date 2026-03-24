import { useQuery } from '@tanstack/react-query'
import { fetchHackathons } from '@/shared/api/queries'
import { HackathonCard } from '@/entities/hackathon/ui/HackathonCard'

export function HackathonListPage() { 
  const { data: hackathons, isLoading } = useQuery({
    queryKey: ['hackathons'],
    queryFn: fetchHackathons
  })

  return (
    <div className="pb-10">
      <h1 className="text-3xl md:text-[2.5rem] leading-tight font-extrabold mb-10 tracking-tight text-[#2c2f31]">
        모든 해커톤을<br />한 곳에서 모아보세요
      </h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-96 bg-white rounded-[2rem] animate-pulse border border-slate-100" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons?.map(h => (
            <HackathonCard key={h.slug} hackathon={h} />
          ))}
        </div>
      )}
    </div>
  ) 
}
