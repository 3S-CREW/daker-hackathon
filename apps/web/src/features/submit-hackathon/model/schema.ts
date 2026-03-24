import { z } from 'zod'

export const submitHackathonSchema = z.object({
  team_id: z.string().min(1, '팀을 선택해주세요'),
  project_url: z
    .string()
    .min(1, '프로젝트 URL을 입력해주세요')
    .url('올바른 URL 형식이 아닙니다'),
  demo_url: z
    .string()
    .url('올바른 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(20, '프로젝트 설명은 최소 20자 이상이어야 합니다')
    .max(500, '프로젝트 설명은 500자 이하여야 합니다'),
})

export type SubmitHackathonFormValues = z.infer<typeof submitHackathonSchema>
