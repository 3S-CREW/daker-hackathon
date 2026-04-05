import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSubmission, fetchTeamsByHackathon, fetchMySubmissionsForHackathon } from '@/shared/api/queries'
import { useAuthStore } from '@/shared/store/authStore'
import { submitHackathonSchema, type SubmitHackathonFormValues } from '../model/schema'

interface SubmitFormProps {
  hackathonId: string
  onSuccess?: () => void
}

export function SubmitForm({ hackathonId, onSuccess }: SubmitFormProps) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [inputType, setInputType] = useState<'url' | 'file'>('url')

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams', hackathonId],
    queryFn: () => fetchTeamsByHackathon(hackathonId),
    enabled: !!hackathonId,
  })

  const { data: existingSubmissions = [], isLoading: submissionLoading } = useQuery({
    queryKey: ['submissions', hackathonId, user?.id],
    queryFn: () => fetchMySubmissionsForHackathon(hackathonId, teams.map(t => t.id)),
    enabled: !!hackathonId && teams.length > 0 && !!user,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SubmitHackathonFormValues>({
    resolver: zodResolver(submitHackathonSchema),
  })

  const mutation = useMutation({
    mutationFn: (values: SubmitHackathonFormValues) =>
      createSubmission({
        hackathon_id: hackathonId,
        team_id: values.team_id,
        payload_json: {
          project_url: values.project_url,
          demo_url: values.demo_url || undefined,
          description: values.description,
          memo: values.memo || undefined,
        },
        created_by: user!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankings', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['submissions', hackathonId, user?.id] })
      reset()
      onSuccess?.()
    },
  })

  // 로딩 상태
  if (teamsLoading || submissionLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0064ff]" />
      </div>
    )
  }

  // 비로그인 상태
  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-bold text-[#2c2f31] mb-3">로그인이 필요합니다</p>
        <p className="text-[#595c5e]">GitHub 로그인 후 제출할 수 있습니다.</p>
      </div>
    )
  }

  // 제출 완료 상태 ( mutation.isSuccess || existingSubmissions.length > 0)
  if (mutation.isSuccess || existingSubmissions.length > 0) {
    const sub = existingSubmissions[0] || (mutation.data as any)
    const payload = sub?.payload_json || {}

    return (
      <div className="max-w-2xl mx-auto text-center py-10">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-extrabold text-[#2c2f31] mb-4">제출이 완료되었습니다!</h3>
        <p className="text-[#595c5e] mb-10 text-lg">결과는 리더보드에서 확인하실 수 있습니다.</p>
        
        <div className="bg-[#f5f7f9] p-8 rounded-[2rem] text-left border border-slate-100 shadow-sm">
          <div className="grid gap-6">
            <div>
              <p className="text-xs font-bold text-[#9a9d9f] uppercase tracking-widest mb-2">프로젝트 링크</p>
              <a href={payload.project_url} target="_blank" rel="noreferrer" className="text-[#0064ff] font-bold text-lg hover:underline break-all">
                {payload.project_url}
              </a>
            </div>
            {payload.demo_url && (
              <div>
                <p className="text-xs font-bold text-[#9a9d9f] uppercase tracking-widest mb-2">데모 링크</p>
                <a href={payload.demo_url} target="_blank" rel="noreferrer" className="text-[#0064ff] font-bold hover:underline">
                  {payload.demo_url}
                </a>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-[#9a9d9f] uppercase tracking-widest mb-2">프젝트 요약</p>
              <p className="text-[#2c2f31] font-medium leading-relaxed bg-white p-5 rounded-2xl border border-slate-100">
                {payload.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-10 max-w-2xl mx-auto">
      <div>
        <h3 className="text-2xl font-bold text-[#2c2f31] mb-2">결과물 제출</h3>
        <p className="text-[#595c5e]">팀 프로젝트 링크와 설명을 입력해주세요.</p>
      </div>

      {/* 제출 가이드라인 */}
      <div className="bg-[#f5f7f9] p-5 rounded-2xl border border-[#eef1f3]">
        <h4 className="font-bold text-[#2c2f31] flex items-center gap-2 mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0064ff]"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          제출 가이드라인
        </h4>
        <ul className="space-y-2 text-sm text-[#595c5e] font-medium">
          <li className="flex gap-2"><span className="text-[#9a9d9f]">•</span> 데모 영상 링크는 가가급적 3분 이내로 제작을 권장합니다.</li>
          <li className="flex gap-2"><span className="text-[#9a9d9f]">•</span> Github 저장소를 제출하실 경우 반드시 Public 상태인지 확인해주세요.</li>
          <li className="flex gap-2"><span className="text-[#9a9d9f]">•</span> 여러 개의 파일은 ZIP으로 압축하거나 구글 드라이브 링크로 제출하세요.</li>
        </ul>
      </div>

      {/* 팀 선택 */}
      <div>
        <label className="block text-sm font-bold text-[#2c2f31] mb-2">팀 선택</label>
        {teamsLoading ? (
          <div className="h-12 bg-[#f5f7f9] rounded-2xl animate-pulse" />
        ) : teams.length === 0 ? (
          <p className="text-sm text-[#595c5e] bg-[#f5f7f9] px-4 py-3 rounded-2xl">
            이 해커톤에 소속된 팀이 없습니다. 먼저 팀을 만들어주세요.
          </p>
        ) : (
          <select
            {...register('team_id')}
            className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
          >
            <option value="">팀을 선택하세요</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        )}
        {errors.team_id && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.team_id.message}</p>}
      </div>

      {/* 프로젝트 제출물 (URL or File) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-[#2c2f31]">
            제출물 <span className="text-red-400">*</span>
          </label>
          <div className="flex bg-[#eef1f3] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setInputType('url')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                inputType === 'url' ? 'bg-white text-[#0064ff] shadow-sm' : 'text-[#9a9d9f]'
              }`}
            >
              🔗 링크 (URL)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputType('file')
                setValue('project_url', '') // reset to empty when switching
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                inputType === 'file' ? 'bg-white text-[#0064ff] shadow-sm' : 'text-[#9a9d9f]'
              }`}
            >
              📁 파일 (ZIP, PDF 등)
            </button>
          </div>
        </div>
        
        {inputType === 'url' ? (
          <input
            {...register('project_url')}
            placeholder="https://github.com/your-team/project"
            className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
          />
        ) : (
          <div className="relative w-full">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // MVP에서는 실제 파일 업로드 대신 [File] 가짜 URL 텍스트를 저장합니다.
                  setValue('project_url', `[File] ${file.name}`)
                } else {
                  setValue('project_url', '')
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full px-4 py-8 rounded-2xl bg-white border-2 border-dashed border-[#cbd5e1] hover:border-[#0064ff] hover:bg-[#f5f7f9] focus:outline-none text-[#595c5e] font-semibold transition-colors flex flex-col items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#9a9d9f]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>클릭하거나 파일을 여기로 드래그하세요</span>
            </div>
            {/* hidden input for validation */}
            <input type="hidden" {...register('project_url')} />
          </div>
        )}
        {errors.project_url && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.project_url.message}</p>}
      </div>

      {/* 데모 URL */}
      <div>
        <label className="block text-sm font-bold text-[#2c2f31] mb-2">
          데모 URL <span className="text-[#9a9d9f] font-normal">(선택)</span>
        </label>
        <input
          {...register('demo_url')}
          placeholder="https://your-demo.vercel.app"
          className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
        />
        {errors.demo_url && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.demo_url.message}</p>}
      </div>

      {/* 프로젝트 설명 */}
      <div>
        <label className="block text-sm font-bold text-[#2c2f31] mb-2">
          프로젝트 요약 설명 <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="프로젝트의 핵심 기능, 기술 스택, 차별점을 설명해주세요."
          className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors resize-none"
        />
        {errors.description && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.description.message}</p>}
      </div>

      {/* 추가 메모 (선택) */}
      <div>
        <label className="block text-sm font-bold text-[#2c2f31] mb-2">
          팀 회고 및 추가 메모 <span className="text-[#9a9d9f] font-normal">(선택)</span>
        </label>
        <textarea
          {...register('memo')}
          rows={3}
          placeholder="어떤 점이 아쉬웠나요? 혹은 심사위원에게 전하고 싶은 말이 있나요?"
          className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors resize-none"
        />
        {errors.memo && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.memo.message}</p>}
      </div>

      {/* 에러 */}
      {mutation.isError && (
        <p className="text-sm text-red-500 font-semibold">제출에 실패했습니다. 다시 시도해주세요.</p>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-4 bg-gradient-to-r from-[#0051d2] to-[#7a9dff] text-white font-bold text-lg rounded-full hover:scale-[1.01] active:scale-95 transition-transform shadow-[0_8px_24px_rgba(0,100,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? '제출 중...' : '대회 결과물 제출하기'}
      </button>
    </form>
  )
}
