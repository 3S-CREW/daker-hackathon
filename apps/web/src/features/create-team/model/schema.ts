import { z } from "zod";

export const createTeamSchema = z.object({
  hackathon_id: z.string().optional(),
  name: z
    .string()
    .min(2, "팀 이름은 최소 2자 이상이어야 합니다")
    .max(30, "팀 이름은 30자 이하여야 합니다"),
  intro: z
    .string()
    .min(10, "팀 소개는 최소 10자 이상이어야 합니다")
    .max(200, "팀 소개는 200자 이하여야 합니다"),
  max_members: z.number().min(2).max(10),
  looking_for: z.array(z.string()).min(1, "모집 역할을 최소 1개 선택해주세요"),
  recruiting: z.boolean(),
  contact_type: z.enum(
    ["kakao", "discord", "email", "github"],
    "연락 수단을 선택해주세요",
  ),
  contact_url: z.string().min(1, "연락처를 입력해주세요"),
});

export type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export const ROLE_OPTIONS = [
  "Frontend",
  "Backend",
  "Designer",
  "PM",
  "ML Engineer",
  "DevOps",
  "iOS",
  "Android",
];
export const CONTACT_OPTIONS = [
  { value: "kakao", label: "카카오톡" },
  { value: "discord", label: "Discord" },
  { value: "email", label: "이메일" },
  { value: "github", label: "GitHub" },
] as const;
