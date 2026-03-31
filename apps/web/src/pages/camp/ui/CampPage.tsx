import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchTeams, fetchHackathons, type Team, fetchDirectMessages, sendDirectMessage } from "@/shared/api/queries"
import { supabase } from "@/shared/api/supabase"
import { useAuthStore } from "@/shared/store/authStore"
import { CreateTeamModal } from "@/features/create-team"

// ---- DM Modal Component ----
function DirectMessageModal({ 
  open, 
  onClose, 
  receiverId, 
  receiverName 
}: { 
  open: boolean; 
  onClose: () => void;
  receiverId: string;
  receiverName: string;
}) {
  const { user } = useAuthStore()
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)

  if (!open) return null

  const handleSend = async () => {
    if (!content.trim() || !user) return
    setIsSending(true)
    try {
      await sendDirectMessage({
        sender_id: user.id,
        receiver_id: receiverId,
        content
      })
      setContent('')
      onClose()
      alert('쪽지를 성공적으로 보냈습니다!')
    } catch (e) {
      alert('쪽지 전송 실패.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-[#2c2f31] mb-2">쪽지 보내기</h3>
        <p className="text-[#595c5e] text-sm mb-6">수신자: <span className="font-bold text-[#0064ff]">{receiverName}</span></p>
        
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="함께 참여하고 싶습니다! 인사말을 남겨주세요."
          rows={5}
          className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors resize-none mb-4 custom-scrollbar"
        />
        
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-[#eef1f3] text-[#595c5e] font-bold rounded-xl hover:bg-slate-200">
            취소
          </button>
          <button 
            onClick={handleSend}
            disabled={isSending || !content.trim()}
            className="flex-1 py-3 bg-[#0064ff] text-white font-bold rounded-xl hover:bg-[#0051d2] disabled:opacity-50"
          >
            {isSending ? '전송 중...' : '보내기'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Inbox Component ----
function Inbox() {
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)
  
  const { data: messages = [] } = useQuery({
    queryKey: ['direct_messages', user?.id],
    queryFn: () => user ? fetchDirectMessages(user.id) : Promise.resolve([]),
    enabled: !!user,
    refetchInterval: 10000,
  })

  if (!user) return null

  // Sender or Receiver logic mapping
  // Since our query fetches all DMs for the user, we just display them simply.
  const inboxMessages = messages.filter(m => m.receiver_id === user.id)

  return (
    <>
      <div className="fixed bottom-10 left-10 z-40">
        <button
          onClick={() => setOpen(!open)}
          className="bg-white border-2 border-[#eef1f3] shadow-lg text-[#2c2f31] w-14 h-14 rounded-full hover:scale-105 transition-transform flex items-center justify-center relative"
        >
          <svg className="w-6 h-6 text-[#595c5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {inboxMessages.length > 0 && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {open && (
        <div className="fixed bottom-28 left-10 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex flex-col max-h-[60vh]">
          <div className="bg-[#f5f7f9] p-4 flex justify-between items-center border-b border-slate-200">
            <h3 className="font-extrabold text-[#2c2f31] flex items-center gap-2">
              받은 쪽지함 <span className="px-2 py-0.5 bg-[#0064ff] text-white text-xs rounded-full">{inboxMessages.length}</span>
            </h3>
            <button onClick={() => setOpen(false)} className="text-[#9a9d9f] hover:text-[#2c2f31]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-1">
            {inboxMessages.length === 0 ? (
              <p className="text-center text-sm text-[#9a9d9f] py-10 font-medium">받은 쪽지가 없습니다.</p>
            ) : (
              inboxMessages.map(m => (
                <div key={m.id} className="bg-[#f5f7f9] p-4 rounded-2xl relative">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={m.sender?.avatar_url || 'https://github.com/ghost.png'} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-[#2c2f31]">{m.sender?.name || 'Unknown'}</span>
                    <span className="text-[10px] text-[#9a9d9f] ml-auto">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-[#595c5e] break-words whitespace-pre-wrap">{m.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ---- Main Page ----
export function CampPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  
  const [filterMode, setFilterMode] = useState<'all' | 'recruiting'>('all')
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // DM State
  const [dmModalInfo, setDmModalInfo] = useState<{ open: boolean; receiverId: string; receiverName: string }>({
    open: false, receiverId: '', receiverName: ''
  })

  const { data: hackathons = [] } = useQuery({ queryKey: ['hackathons'], queryFn: fetchHackathons })
  const { data: teams = [], isLoading } = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })

  // 모집 토글 뮤테이션
  const toggleRecruitMutation = useMutation({
    mutationFn: async ({ teamId, current }: { teamId: string, current: boolean }) => {
      const { error } = await supabase.from('teams').update({ recruiting: !current }).eq('id', teamId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    }
  })

  // 필터 적용
  const filteredTeams = teams.filter((t) => {
    if (filterMode === 'recruiting' && !t.recruiting) return false
    if (selectedHackathonId && t.hackathon_id !== selectedHackathonId) return false
    return true
  })

  return (
    <div className="pb-32 relative">
      <div className="mb-10">
        <h1 className="text-4xl md:text-[3rem] font-extrabold tracking-tight mb-4 text-[#2c2f31] leading-tight flex items-center gap-3">
          팀 빌딩 캠프 🏕️
        </h1>
        <p className="text-[#595c5e] text-lg font-medium">새로운 도전을 함께할 최고의 팀을 찾거나 모집해보세요.</p>
      </div>

      {/* 해커톤 별 필터 */}
      <div className="inline-flex bg-[#eef1f3] rounded-2xl p-1.5 mb-6 w-full sm:w-auto overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setSelectedHackathonId(null)}
          className={`flex-shrink-0 px-5 py-2.5 font-bold rounded-xl text-[14px] transition-all whitespace-nowrap ${
            selectedHackathonId === null ? 'bg-white text-[#2c2f31] shadow-sm' : 'text-[#9a9d9f] hover:text-[#595c5e]'
          }`}
        >
          모든 해커톤
        </button>
        {hackathons.filter(h => h.status !== 'ended').map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHackathonId(h.id)}
            className={`flex-shrink-0 px-5 py-2.5 font-bold rounded-xl text-[14px] transition-all whitespace-nowrap ${
              selectedHackathonId === h.id ? 'bg-white text-[#2c2f31] shadow-sm' : 'text-[#9a9d9f] hover:text-[#595c5e]'
            }`}
          >
            {h.title.length > 20 ? h.title.slice(0, 20) + '…' : h.title}
          </button>
        ))}
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setFilterMode('all')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold shadow-sm transition-colors text-sm ${
            filterMode === 'all' ? 'text-white bg-[#2c2f31]' : 'text-[#595c5e] bg-white border border-slate-200 hover:bg-[#f5f7f9]'
          }`}
        >
          전체 보기
        </button>
        <button
          onClick={() => setFilterMode('recruiting')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold transition-colors text-sm ${
            filterMode === 'recruiting' ? 'text-white bg-[#0064ff] shadow-sm' : 'text-[#595c5e] bg-white border border-slate-200 hover:bg-[#f5f7f9]'
          }`}
        >
          ✅ 모집 중만 보기
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-72 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)]" />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100">
          <p className="text-xl font-bold text-[#2c2f31] mb-2">조건에 맞는 팀이 없습니다</p>
          <p className="text-[#595c5e] font-medium mb-6">원하는 포지션이 없다면 직접 팀을 만들어보세요!</p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#0064ff] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0051d2] transition-colors shadow-md"
          >
            팀 개설하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => {
            const isMyTeam = user?.id && team.created_by === user.id;
            
            return (
              <div key={team.id} className="flex flex-col bg-white rounded-[2rem] p-6 border border-slate-100 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,81,210,0.08)] transition-all duration-300 relative shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-extrabold text-[#2c2f31] truncate pr-2">{team.name}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {team.recruiting ? (
                      <span className="px-3 py-1 text-[11px] font-black rounded-full text-[#0064ff] bg-blue-50/80 border border-blue-100 uppercase tracking-widest">
                        On
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full text-[#9a9d9f] bg-slate-100 border border-slate-200 uppercase tracking-widest">
                        Off
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[#595c5e] text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {team.intro}
                </p>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[#595c5e] font-bold text-sm bg-[#f5f7f9] px-3 py-2 rounded-xl w-fit">
                    <svg className="w-4 h-4 text-[#9a9d9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {team.member_count} <span className="text-[#9a9d9f] font-medium text-xs">/ {team.max_members}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {team.looking_for.map(role => (
                      <span key={role} className="text-[11px] font-bold text-[#2c2f31] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50 shadow-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {isMyTeam ? (
                  <button 
                    onClick={() => toggleRecruitMutation.mutate({ teamId: team.id, current: team.recruiting })}
                    className={`w-full py-3.5 font-extrabold rounded-2xl transition-all border-2 flex items-center justify-center gap-2 ${
                      team.recruiting 
                      ? 'border-[#eef1f3] text-[#595c5e] bg-white hover:bg-slate-50' 
                      : 'border-transparent text-white bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {team.recruiting ? '모집 마감하기' : '다시 모집하기'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {team.contact_url && (
                      <a
                        href={team.contact_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3.5 text-center text-[#0064ff] bg-blue-50/50 hover:bg-blue-100 font-extrabold rounded-2xl transition-colors border border-blue-100"
                      >
                        지원하기
                      </a>
                    )}
                    <button 
                      onClick={() => setDmModalInfo({ open: true, receiverId: team.created_by!, receiverName: team.name })}
                      className="px-4 py-3.5 text-white bg-[#0064ff] hover:bg-[#0051d2] font-extrabold rounded-2xl transition-transform shadow-[0_8px_20px_rgba(0,100,255,0.25)] hover:-translate-y-0.5"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* FAB - 새로운 팀 만들기 (하단 우측) */}
      <div className="fixed bottom-10 right-10 z-40 hidden md:block">
        <button
          onClick={() => setModalOpen(true)}
          className="shadow-[0_20px_40px_rgba(0,100,255,0.3)] bg-gradient-to-r from-[#0051d2] to-[#7a9dff] text-white font-extrabold text-lg px-8 py-5 rounded-full hover:scale-105 transition-transform active:scale-95 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          우리 팀 만들기
        </button>
      </div>

      <CreateTeamModal open={modalOpen} onClose={() => setModalOpen(false)} />
      
      {/* DM 전송 모달 */}
      <DirectMessageModal 
        open={dmModalInfo.open} 
        onClose={() => setDmModalInfo(prev => ({ ...prev, open: false }))} 
        receiverId={dmModalInfo.receiverId}
        receiverName={dmModalInfo.receiverName}
      />

      {/* 받은 쪽지함 좌측 하단 플로팅 */}
      <Inbox />
    </div>
  )
}
