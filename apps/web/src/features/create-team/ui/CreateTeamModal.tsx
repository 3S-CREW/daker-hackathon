import {
  createTeam,
  fetchHackathons,
  updateTeam,
  type Team,
} from "@/shared/api/queries";
import { useAuthStore } from "@/shared/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  CONTACT_OPTIONS,
  createTeamSchema,
  ROLE_OPTIONS,
  type CreateTeamFormValues,
} from "../model/schema";

const DEFAULT_CONTACT_TYPE: CreateTeamFormValues["contact_type"] = "kakao";

function resolveContactType(
  value: string | null | undefined,
): CreateTeamFormValues["contact_type"] {
  return CONTACT_OPTIONS.some((option) => option.value === value)
    ? (value as CreateTeamFormValues["contact_type"])
    : DEFAULT_CONTACT_TYPE;
}

interface CreateTeamModalProps {
  hackathonId?: string; // 미전달 시 모달 내부에서 선택
  initialData?: Team; // 수정 모드 시 데이터
  open: boolean;
  onClose: () => void;
}

export function CreateTeamModal({
  hackathonId,
  initialData,
  open,
  onClose,
}: CreateTeamModalProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const { data: hackathons = [] } = useQuery({
    queryKey: ["hackathons"],
    queryFn: fetchHackathons,
    enabled: !hackathonId,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      recruiting: initialData?.recruiting ?? true,
      max_members: initialData?.max_members ?? 4,
      looking_for: initialData?.looking_for ?? [],
      contact_type: resolveContactType(initialData?.contact_type),
      contact_url: initialData?.contact_url ?? "",
      name: initialData?.name ?? "",
      intro: initialData?.intro ?? "",
      hackathon_id: hackathonId ?? initialData?.hackathon_id ?? "",
    },
  });

  // initialData 변경 시 폼 리셋
  useEffect(() => {
    if (open) {
      reset({
        recruiting: initialData?.recruiting ?? true,
        max_members: initialData?.max_members ?? 4,
        looking_for: initialData?.looking_for ?? [],
        contact_type: resolveContactType(initialData?.contact_type),
        contact_url: initialData?.contact_url ?? "",
        name: initialData?.name ?? "",
        intro: initialData?.intro ?? "",
        hackathon_id: hackathonId ?? initialData?.hackathon_id ?? "",
      });
    }
  }, [initialData, open, reset, hackathonId]);

  const lookingFor = useWatch({ control, name: "looking_for" }) ?? [];
  const maxMembers = useWatch({ control, name: "max_members" }) ?? 4;
  const contactType =
    useWatch({ control, name: "contact_type" }) ?? DEFAULT_CONTACT_TYPE;
  const recruiting = useWatch({ control, name: "recruiting" }) ?? true;

  const toggleRole = (role: string) => {
    const current = lookingFor ?? [];
    if (current.includes(role)) {
      setValue(
        "looking_for",
        current.filter((r) => r !== role),
        { shouldValidate: true },
      );
    } else {
      setValue("looking_for", [...current, role], { shouldValidate: true });
    }
  };

  const mutation = useMutation({
    mutationFn: async (values: CreateTeamFormValues) => {
      const input = {
        hackathon_id: hackathonId ?? values.hackathon_id ?? "",
        name: values.name,
        recruiting: values.recruiting,
        max_members: values.max_members,
        looking_for: values.looking_for,
        intro: values.intro,
        contact_type: values.contact_type,
        contact_url: values.contact_url,
        created_by: user!.id,
      };
      if (isEditMode) {
        await updateTeam(initialData!.id, input);
      } else {
        await createTeam(input);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      if (hackathonId)
        queryClient.invalidateQueries({ queryKey: ["teams", hackathonId] });
      reset();
      onClose();
    },
  });

  // ESC 키로 닫기 및 바디 스크롤 방지
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  // 비로그인 상태
  if (!user) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c2f31]/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-[#2c2f31] mb-3">
            로그인이 필요합니다
          </h2>
          <p className="text-[#595c5e] mb-8 font-medium">
            참가 신청을 위해 GitHub 로그인이 필요합니다.
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-all cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c2f31]/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2.5rem] w-full max-w-xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{ maxHeight: "min(90vh, 700px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="shrink-0 px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-100 rounded-t-[2.5rem]">
          <div>
            <h2 className="text-[26px] font-extrabold text-[#2c2f31] tracking-tight">
              {isEditMode ? "팀 정보 수정하기" : "새로운 팀 만들기"}
            </h2>
            <p className="text-sm font-semibold text-[#9a9d9f] mt-0.5">
              {isEditMode
                ? "팀원들에게 보여질 정보를 업데이트하세요"
                : "대회에 빛나는 아이디어를 실현할 팀을 구성하세요"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f7f9] hover:bg-[#eef1f3] transition-colors text-[#595c5e] cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 폼 - 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 폼 */}
          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="px-8 py-6 space-y-6"
          >
            {/* 팀장 유의사항 안내 영역 */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              <h4 className="flex items-center gap-2 text-[#0051d2] font-extrabold text-[15px] mb-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                팀장(개설자) 확인 사항
              </h4>
              <ul className="text-sm text-[#595c5e] font-semibold space-y-2 leading-relaxed tracking-tight">
                <li className="flex gap-2">
                  <span className="text-[#0064ff]">•</span> 팀 대표로서 대회
                  전반적인 팀원 관리 및 최종 결과물 등록의 책임을 집니다.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0064ff]">•</span> 팀 연락처 정보는
                  지원자가 언제든 열람할 수 있도록 퍼블릭 링크로 공개됩니다.
                </li>
              </ul>
            </div>

            {/* 해커톤 선택 (hackathonId 미전달 시만 표시) */}
            {!hackathonId && (
              <div>
                <label className="block text-sm font-bold text-[#2c2f31] mb-2">
                  참가 해커톤
                </label>
                <select
                  {...register("hackathon_id")}
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
                >
                  <option value="">해커톤을 선택하세요</option>
                  {hackathons
                    .filter((h) => h.status !== "ended")
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
              <label className="block text-sm font-bold text-[#2c2f31] mb-2">
                팀 이름
              </label>
              <input
                {...register("name")}
                placeholder="팀 이름을 입력하세요"
                className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500 font-semibold">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 팀 소개 */}
            <div>
              <label className="block text-sm font-bold text-[#2c2f31] mb-2">
                팀 소개
              </label>
              <textarea
                {...register("intro")}
                rows={3}
                placeholder="팀의 목표나 아이디어를 간략히 소개해주세요"
                className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors resize-none"
              />
              {errors.intro && (
                <p className="mt-1.5 text-sm text-red-500 font-semibold">
                  {errors.intro.message}
                </p>
              )}
            </div>

            {/* 최대 인원 */}
            <div>
              <label className="block text-sm font-bold text-[#2c2f31] mb-2">
                최대 팀원 수
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() =>
                      setValue("max_members", n, { shouldValidate: true })
                    }
                    className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-colors ${
                      maxMembers === n
                        ? "bg-[#0064ff] text-white"
                        : "bg-[#f5f7f9] text-[#595c5e] hover:bg-[#eef1f3]"
                    }`}
                  >
                    {n}명
                  </button>
                ))}
              </div>
            </div>

            {/* 모집 역할 */}
            <div>
              <label className="block text-sm font-bold text-[#2c2f31] mb-2">
                모집 역할
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                      lookingFor?.includes(role)
                        ? "bg-[#0064ff] text-white"
                        : "bg-[#f5f7f9] text-[#595c5e] hover:bg-[#eef1f3]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {errors.looking_for && (
                <p className="mt-1.5 text-sm text-red-500 font-semibold">
                  {errors.looking_for.message}
                </p>
              )}
            </div>

            {/* 연락 수단 */}
            <div>
              <label className="block text-sm font-bold text-[#2c2f31] mb-2">
                연락 수단
              </label>
              <div className="flex gap-2 mb-3">
                {CONTACT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setValue("contact_type", opt.value, {
                        shouldValidate: true,
                      })
                    }
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      contactType === opt.value
                        ? "bg-[#0064ff] text-white"
                        : "bg-[#f5f7f9] text-[#595c5e] hover:bg-[#eef1f3]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <input
                {...register("contact_url")}
                placeholder="오픈채팅 링크, 이메일, Discord 태그 등"
                className="w-full px-4 py-3 rounded-2xl bg-[#f5f7f9] border border-transparent focus:border-[#0064ff] focus:outline-none text-[#2c2f31] font-semibold transition-colors"
              />
              {errors.contact_url && (
                <p className="mt-1.5 text-sm text-red-500 font-semibold">
                  {errors.contact_url.message}
                </p>
              )}
            </div>

            {/* 모집 여부 토글 */}
            <div className="flex items-center justify-between p-4 bg-[#f5f7f9] rounded-2xl">
              <span className="font-bold text-[#2c2f31]">
                지금 바로 팀원 모집
              </span>
              <button
                type="button"
                onClick={() => setValue("recruiting", !recruiting)}
                className={`w-12 h-6 rounded-full transition-colors relative ${recruiting ? "bg-[#0064ff]" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${recruiting ? "translate-x-6" : "translate-x-0.5"}`}
                />
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
              className="w-full py-4 bg-gradient-to-r from-[#0051d2] to-[#7a9dff] text-white font-bold text-lg rounded-full hover:scale-[1.01] active:scale-95 transition-transform shadow-[0_8px_24px_rgba(0,100,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {mutation.isPending
                ? "생성 중..."
                : isEditMode
                  ? "수정 완료"
                  : "팀 만들기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
