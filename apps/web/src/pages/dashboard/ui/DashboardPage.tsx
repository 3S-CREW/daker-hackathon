import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/shared/store/authStore'
import {
  fetchMyTeams,
  fetchMyDashboardRecords,
  fetchMyCertificates,
  upsertDashboardRecord,
  createCertificate,
  type DashboardRecord,
  type Certificate,
} from '@/shared/api/queries'

type Tab = 'overview' | 'records' | 'certificates'

const statusLabel: Record<string, string> = {
  upcoming: '모집 예정',
  ongoing: '진행 중',
  ended: '종료됨',
}
const statusColor: Record<string, string> = {
  upcoming: 'text-[#0064ff] bg-[#eef1f3]',
  ongoing: 'text-[#8d3a8a] bg-[#eef1f3]',
  ended: 'text-[#9a9d9f] bg-[#f5f7f9]',
}

export function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [memoHackathonId, setMemoHackathonId] = useState<string | null>(null)
  const [memoText, setMemoText] = useState('')
  const [certUrl, setCertUrl] = useState('')
  const [certHackathonId, setCertHackathonId] = useState('')
  const queryClient = useQueryClient()

  if (authLoading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 rounded-full border-4 border-[#eef1f3] border-t-[#0064ff] animate-spin" /></div>
  if (!user) return <Navigate to="/" replace />

  const { data: myTeams = [] } = useQuery({
    queryKey: ['myTeams', user.id],
    queryFn: () => fetchMyTeams(user.id),
  })

  const { data: records = [] } = useQuery({
    queryKey: ['dashboardRecords', user.id],
    queryFn: () => fetchMyDashboardRecords(user.id),
  })

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates', user.id],
    queryFn: () => fetchMyCertificates(user.id),
  })

  const saveMemoMutation = useMutation({
    mutationFn: upsertDashboardRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardRecords', user.id] })
      setMemoHackathonId(null)
      setMemoText('')
    },
  })

  const saveCertMutation = useMutation({
    mutationFn: createCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', user.id] })
      setCertUrl('')
      setCertHackathonId('')
    },
  })

  const openMemo = (hackathonId: string, existing?: DashboardRecord) => {
    setMemoHackathonId(hackathonId)
    setMemoText(existing?.memo ?? '')
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: '참가 이력' },
    { id: 'records', label: '회고 메모' },
    { id: 'certificates', label: '수료증' },
  ]

  return (
    <div className="pb-24">
      {/* 프로필 헤더 */}
      <div className="bg-gradient-to-br from-[#0051d2] to-[#7a9dff] rounded-[2.5rem] p-10 md:p-12 text-white mb-10 relative overflow-hidden"
        style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.15)' }}>
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-6">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="프로필"
              className="w-20 h-20 rounded-3xl border-4 border-white/30 object-cover"
            />
          )}
          <div>
            <p className="text-blue-200 font-semibold text-sm mb-1">내 대시보드</p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {user.user_metadata?.user_name || user.user_metadata?.full_name || user.email}
            </h1>
            <p className="text-blue-200 text-sm mt-1">{user.email}</p>
          </div>
        </div>
        <div className="relative z-10 flex gap-10 mt-8">
          <div>
            <p className="text-blue-200 font-semibold text-xs uppercase tracking-wider mb-1">참가 대회</p>
            <p className="text-3xl font-extrabold">{myTeams.length}</p>
          </div>
          <div>
            <p className="text-blue-200 font-semibold text-xs uppercase tracking-wider mb-1">회고 메모</p>
            <p className="text-3xl font-extrabold">{records.length}</p>
          </div>
          <div>
            <p className="text-blue-200 font-semibold text-xs uppercase tracking-wider mb-1">수료증</p>
            <p className="text-3xl font-extrabold">{certificates.length}</p>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-8 bg-[#eef1f3] p-1.5 rounded-2xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-6 py-3 font-bold rounded-xl text-[14px] transition-all ${
              activeTab === t.id ? 'bg-white text-[#2c2f31] shadow-sm' : 'text-[#9a9d9f] hover:text-[#595c5e]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 참가 이력 탭 */}
      {activeTab === 'overview' && (
        <div>
          {myTeams.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-14 text-center" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
              <p className="text-xl font-extrabold text-[#2c2f31] mb-2">아직 참가한 대회가 없습니다</p>
              <p className="text-[#595c5e] mb-6">해커톤에 참가해 팀을 만들어보세요!</p>
              <Link to="/hackathons" className="px-8 py-4 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-colors">
                해커톤 둘러보기
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myTeams.map((team) => {
                const hackathon = team.hackathons
                const record = records.find((r) => r.hackathon_id === team.hackathon_id)
                return (
                  <div key={team.id} className="bg-white rounded-[2rem] p-8 flex items-center justify-between"
                    style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
                    <div className="flex-1">
                      {hackathon && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block ${statusColor[hackathon.status]}`}>
                          {statusLabel[hackathon.status]}
                        </span>
                      )}
                      <h3 className="text-xl font-extrabold text-[#2c2f31] mb-1">
                        {hackathon?.title ?? '해커톤 정보 없음'}
                      </h3>
                      <p className="text-[#595c5e] text-sm font-semibold">팀명: {team.name}</p>
                    </div>
                    <div className="flex gap-3 ml-6">
                      {hackathon?.slug && (
                        <Link
                          to={`/hackathons/${hackathon.slug}`}
                          className="px-4 py-2 text-sm font-bold text-[#595c5e] bg-[#f5f7f9] hover:bg-[#eef1f3] rounded-xl transition-colors"
                        >
                          대회 보기
                        </Link>
                      )}
                      <button
                        onClick={() => openMemo(team.hackathon_id, record)}
                        className="px-4 py-2 text-sm font-bold text-[#0064ff] bg-[#eef1f3] hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        {record ? '메모 수정' : '메모 작성'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 회고 메모 탭 */}
      {activeTab === 'records' && (
        <div>
          {records.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-14 text-center" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
              <p className="text-xl font-extrabold text-[#2c2f31] mb-2">아직 작성한 회고가 없습니다</p>
              <p className="text-[#595c5e]">참가 이력 탭에서 대회별 메모를 작성할 수 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record: DashboardRecord & { hackathons?: { title: string; slug: string } }) => (
                <div key={record.id} className="bg-white rounded-[2rem] p-8"
                  style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
                  <p className="text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-2">
                    {(record as Record<string, unknown> & { hackathons?: { title: string } }).hackathons?.title ?? '해커톤'}
                  </p>
                  <p className="text-[#2c2f31] text-lg font-semibold leading-relaxed whitespace-pre-wrap">
                    {record.memo || '(내용 없음)'}
                  </p>
                  <p className="text-xs text-[#9a9d9f] font-semibold mt-4">
                    {new Date(record.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 수료증 탭 */}
      {activeTab === 'certificates' && (
        <div>
          {/* 수료증 등록 폼 */}
          <div className="bg-white rounded-[2rem] p-8 mb-6" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
            <h3 className="text-lg font-extrabold text-[#2c2f31] mb-4">수료증 등록</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={certHackathonId}
                onChange={(e) => setCertHackathonId(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#f5f7f9] rounded-2xl font-semibold text-[#2c2f31] outline-none"
              >
                <option value="">대회 선택</option>
                {myTeams.map((t) => (
                  <option key={t.hackathon_id} value={t.hackathon_id}>
                    {t.hackathons?.title ?? t.hackathon_id}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={certUrl}
                onChange={(e) => setCertUrl(e.target.value)}
                placeholder="수료증 URL 입력"
                className="flex-[2] px-4 py-3 bg-[#f5f7f9] rounded-2xl font-semibold text-[#2c2f31] placeholder:text-[#9a9d9f] outline-none"
              />
              <button
                onClick={() => {
                  if (!certUrl || !certHackathonId) return
                  saveCertMutation.mutate({ user_id: user.id, hackathon_id: certHackathonId, file_url: certUrl })
                }}
                disabled={!certUrl || !certHackathonId || saveCertMutation.isPending}
                className="px-6 py-3 bg-[#0064ff] disabled:bg-slate-200 text-white font-bold rounded-2xl transition-colors whitespace-nowrap"
              >
                등록
              </button>
            </div>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-14 text-center" style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
              <p className="text-xl font-extrabold text-[#2c2f31] mb-2">등록된 수료증이 없습니다</p>
              <p className="text-[#595c5e]">위 폼에서 수료증 URL을 등록해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert: Certificate & { hackathons?: { title: string } }) => (
                <div key={cert.id} className="bg-white rounded-[2rem] p-8 flex flex-col gap-4"
                  style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
                  <p className="text-sm font-bold text-[#9a9d9f] uppercase tracking-wider">
                    {(cert as Record<string, unknown> & { hackathons?: { title: string } }).hackathons?.title ?? '해커톤'}
                  </p>
                  <p className="text-[#2c2f31] font-bold text-2xl">수료증</p>
                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-[#0064ff] text-white font-bold rounded-2xl text-center hover:bg-[#0051d2] transition-colors"
                    >
                      수료증 열기
                    </a>
                  )}
                  <p className="text-xs text-[#9a9d9f] font-semibold">
                    {new Date(cert.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 메모 모달 */}
      {memoHackathonId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg" style={{ boxShadow: '0 20px 60px rgba(0,81,210,0.15)' }}>
            <h3 className="text-xl font-extrabold text-[#2c2f31] mb-4">회고 메모 작성</h3>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="이번 대회에서 배운 점, 아쉬운 점 등을 자유롭게 작성하세요."
              rows={6}
              className="w-full px-4 py-3 bg-[#f5f7f9] rounded-2xl font-semibold text-[#2c2f31] placeholder:text-[#9a9d9f] outline-none resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setMemoHackathonId(null); setMemoText('') }}
                className="flex-1 py-3 font-bold text-[#595c5e] bg-[#f5f7f9] rounded-2xl hover:bg-[#eef1f3] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => saveMemoMutation.mutate({ user_id: user.id, hackathon_id: memoHackathonId, memo: memoText })}
                disabled={saveMemoMutation.isPending}
                className="flex-1 py-3 font-bold text-white bg-[#0064ff] rounded-2xl hover:bg-[#0051d2] transition-colors disabled:bg-slate-200"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
