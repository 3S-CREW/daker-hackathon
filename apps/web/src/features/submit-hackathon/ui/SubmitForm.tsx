import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSubmission, fetchTeamsByHackathon } from '@/shared/api/queries'
import { useAuthStore } from '@/shared/store/authStore'
import { submitHackathonSchema, type SubmitHackathonFormValues } from '../model/schema'

interface SubmitFormProps {
  hackathonId: string
  onSuccess?: () => void
}

export function SubmitForm({ hackathonId, onSuccess }: SubmitFormProps) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams', hackathonId],
    queryFn: () => fetchTeamsByHackathon(hackathonId),
    enabled: !!hackathonId,
  })

  const {
    register,
    handleSubmit,
    reset,
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
        },
        created_by: user!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankings', hackathonId] })
      reset()
      onSuccess?.()
    },
  })

  // 비로그인 상태
  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-bold text-[#2c2f31] mb-3">로그인이 필요합니다</p>
        <p className="text-[#595c5e]">GitHub 로그인 후 제출할 수 있습니다.</p>
      </div>
    )
  }

  // 제출 완료 상태
  if (mutation.isSuccess) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-[#eef1f3] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#0064ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-2xl font-extrabold text-[#2c2f31] mb-2">제출 완료!</p>
        <p className="text-[#595c5e]">결과는 리더보드에서 확인하세요.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-2xl font-bold text-[#2c2f31] mb-2">결과물 제출</h3>
        <p className="text-[#595c5e]">팀 프로젝트 링크와 설명을 입력해주세요.</p>
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

      {/* 프로젝트 URL */}
      <div>
        <label className="block text-sm font-bold text-[#2c2f31] mb-2">
          프로젝트 URL <span className="text-red-400">*</span>
        </label>
        <input
          {...register('project_url')}
          placeholder="https://github.com/your-team/project"
          className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
        />
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
          프로젝트 설명 <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={5}
          placeholder="프로젝트의 핵심 기능, 기술 스택, 차별점을 설명해주세요."
          className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors resize-none"
        />
        {errors.description && <p className="mt-1.5 text-sm text-red-500 font-semibold">{errors.description.message}</p>}
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
