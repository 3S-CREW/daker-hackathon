import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTeam, fetchHackathons } from '@/shared/api/queries'
import { useAuthStore } from '@/shared/store/authStore'
import {
  createTeamSchema,
  type CreateTeamFormValues,
  ROLE_OPTIONS,
  CONTACT_OPTIONS,
} from '../model/schema'

interface CreateTeamModalProps {
  hackathonId?: string  // 미전달 시 모달 내부에서 선택
  open: boolean
  onClose: () => void
}

export function CreateTeamModal({ hackathonId, open, onClose }: CreateTeamModalProps) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: hackathons = [] } = useQuery({
    queryKey: ['hackathons'],
    queryFn: fetchHackathons,
    enabled: !hackathonId,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      recruiting: true,
      max_members: 4,
      looking_for: [],
      contact_type: 'kakao',
      hackathon_id: hackathonId ?? '',
    },
  })

  const lookingFor = watch('looking_for')

  const toggleRole = (role: string) => {
    const current = lookingFor ?? []
    if (current.includes(role)) {
      setValue('looking_for', current.filter((r) => r !== role), { shouldValidate: true })
    } else {
      setValue('looking_for', [...current, role], { shouldValidate: true })
    }
  }

  const mutation = useMutation({
    mutationFn: (values: CreateTeamFormValues) =>
      createTeam({
        hackathon_id: hackathonId ?? values.hackathon_id ?? '',
        name: values.name,
        recruiting: values.recruiting,
        max_members: values.max_members,
        looking_for: values.looking_for,
        intro: values.intro,
        contact_type: values.contact_type,
        contact_url: values.contact_url,
        created_by: user!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', hackathonId] })
      reset()
      onClose()
    },
  })

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  // 비로그인 상태
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full mx-4 text-center" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-extrabold text-[#2c2f31] mb-3">로그인이 필요합니다</h2>
          <p className="text-[#595c5e] mb-8">팀을 만들려면 GitHub 로그인이 필요합니다.</p>
          <button
            onClick={onClose}
            className="w-full py-4 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white rounded-t-[2rem] px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-2xl font-extrabold text-[#2c2f31]">새로운 팀 만들기</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f7f9] hover:bg-[#eef1f3] transition-colors text-[#595c5e]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="px-8 py-6 space-y-6">

          {/* 해커톤 선택 (hackathonId 미전달 시만 표시) */}
          {!hackathonId && (
            <div>
              <label className="block text-sm font-bold text-[#2c2f31] mb-2">참가 해커톤</label>
              <select
                {...register('hackathon_id')}
                className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
              >
                <option value="">해커톤을 선택하세요</option>
                {hackathons
                  .filter((h) => h.status !== 'ended')
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* 팀 이름 */}
          <div>
            <label className="block text-sm font-bold text-[#2c2f31] mb-2">팀 이름</label>
            <input
              {...register('name')}
              placeholder="팀 이름을 입력하세요"
              className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.name.message}</p>}
          </div>

          {/* 팀 소개 */}
          <div>
            <label className="block text-sm font-bold text-[#2c2f31] mb-2">팀 소개</label>
            <textarea
              {...register('intro')}
              rows={3}
              placeholder="팀의 목표나 아이디어를 간략히 소개해주세요"
              className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors resize-none"
            />
            {errors.intro && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.intro.message}</p>}
          </div>

          {/* 최대 인원 */}
          <div>
            <label className="block text-sm font-bold text-[#2c2f31] mb-2">최대 팀원 수</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue('max_members', n, { shouldValidate: true })}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-colors ${
                    watch('max_members') === n
                      ? 'bg-[#0064ff] text-white'
                      : 'bg-[#f5f7f9] text-[#595c5e] hover:bg-[#eef1f3]'
                  }`}
                >
                  {n}명
                </button>
              ))}
            </div>
          </div>

          {/* 모집 역할 */}
          <div>
            <label className="block text-sm font-bold text-[#2c2f31] mb-2">모집 역할</label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                    lookingFor?.includes(role)
                      ? 'bg-[#0064ff] text-white'
                      : 'bg-[#f5f7f9] text-[#595c5e] hover:bg-[#eef1f3]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            {errors.looking_for && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.looking_for.message}</p>}
          </div>

          {/* 연락 수단 */}
          <div>
            <label className="block text-sm font-bold text-[#2c2f31] mb-2">연락 수단</label>
            <div className="flex gap-2 mb-3">
              {CONTACT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('contact_type', opt.value, { shouldValidate: true })}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    watch('contact_type') === opt.value
                      ? 'bg-[#0064ff] text-white'
                      : 'bg-[#f5f7f9] text-[#595c5e] hover:bg-[#eef1f3]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              {...register('contact_url')}
              placeholder="오픈채팅 링크, 이메일, Discord 태그 등"
              className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
            />
            {errors.contact_url && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.contact_url.message}</p>}
          </div>

          {/* 모집 여부 토글 */}
          <div className="flex items-center justify-between p-4 bg-[#f5f7f9] rounded-2xl">
            <span className="font-bold text-[#2c2f31]">지금 바로 팀원 모집</span>
            <button
              type="button"
              onClick={() => setValue('recruiting', !watch('recruiting'))}
              className={`w-12 h-6 rounded-full transition-colors relative ${watch('recruiting') ? 'bg-[#0064ff]' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${watch('recruiting') ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* 에러 메시지 */}
          {mutation.isError && (
            <p className="text-sm text-red-500 font-semibold text-center">
              팀 생성에 실패했습니다. 다시 시도해주세요.
            </p>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="w-full py-4 bg-gradient-to-r from-[#0051d2] to-[#7a9dff] text-white font-bold text-lg rounded-full hover:scale-[1.01] active:scale-95 transition-transform shadow-[0_8px_24px_rgba(0,100,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? '생성 중...' : '팀 만들기'}
          </button>
        </form>
      </div>
    </div>
  )
}
