import { AIChatModal } from "@/features/ai-chat";
import { CreateTeamModal } from "@/features/create-team";
import { SubmitForm } from "@/features/submit-hackathon";
import {
  fetchHackathonBySlug,
  fetchHackathonDetails,
  fetchRankingsByHackathon,
  fetchTeamsByHackathon,
  type RankingEntry,
  type Team,
} from "@/shared/api/queries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const TABS = [
  { id: "Overview", label: "개요" },
  { id: "Info", label: "공지/규칙" },
  { id: "Eval", label: "평가 기준" },
  { id: "Schedule", label: "일정" },
  { id: "Prize", label: "상금" },
  { id: "Teams", label: "참가 팀" },
  { id: "Submit", label: "제출" },
  { id: "Leaderboard", label: "리더보드" },
] as const;
type Tab = (typeof TABS)[number]["id"];

// ---- 탭별 컨텐츠 컴포넌트 ----

function ScheduleTab({ deadline, endAt }: { deadline: string; endAt: string }) {
  const fmt = (d: string) =>
    new Date(d).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-[#2c2f31]">대회 일정</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-6 p-6 bg-[#f5f7f9] rounded-2xl">
          <div className="w-3 h-3 rounded-full bg-[#0064ff] shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-1">
              제출 마감
            </p>
            <p className="text-xl font-bold text-[#2c2f31]">{fmt(deadline)}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 p-6 bg-[#f5f7f9] rounded-2xl">
          <div className="w-3 h-3 rounded-full bg-[#8d3a8a] shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-1">
              대회 종료
            </p>
            <p className="text-xl font-bold text-[#2c2f31]">{fmt(endAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrizeTab({
  totalPrize,
  teamSize,
}: {
  totalPrize?: string;
  teamSize?: string;
}) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-[#2c2f31]">시상 정보</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-8 bg-gradient-to-br from-[#0051d2] to-[#7a9dff] rounded-[2rem] text-white">
          <p className="text-blue-200 font-semibold mb-2 text-sm uppercase tracking-wider">
            총 상금
          </p>
          <p className="text-3xl font-extrabold">{totalPrize || "TBD"}</p>
        </div>
        <div className="p-8 bg-[#f5f7f9] rounded-[2rem]">
          <p className="text-[#9a9d9f] font-semibold mb-2 text-sm uppercase tracking-wider">
            팀 규모
          </p>
          <p className="text-3xl font-extrabold text-[#2c2f31]">
            {teamSize || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

import { ExternalLinkModal } from "@/shared/ui/ExternalLinkModal";

function TeamsTab({ hackathonId }: { hackathonId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [externalModalOpen, setExternalModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");

  const handleExternalClick = (url: string) => {
    setTargetUrl(url);
    setExternalModalOpen(true);
  };

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams", hackathonId],
    queryFn: () => fetchTeamsByHackathon(hackathonId),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-[#2c2f31]">참가 팀</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-colors text-sm cursor-pointer"
        >
          + 팀 만들기
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#f5f7f9] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-bold text-[#2c2f31] mb-2">
            아직 팀이 없습니다
          </p>
          <p className="text-[#595c5e] mb-6">첫 번째 팀을 만들어보세요!</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-8 py-4 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-colors cursor-pointer"
          >
            팀 만들기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team: Team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-6 bg-[#f5f7f9] rounded-2xl"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-bold text-[#2c2f31]">
                    {team.name}
                  </span>
                  {team.recruiting && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full text-[#0064ff] bg-white">
                      모집 중
                    </span>
                  )}
                </div>
                <p className="text-[#595c5e] text-sm line-clamp-1">
                  {team.intro}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {team.looking_for.map((role) => (
                    <span
                      key={role}
                      className="text-xs font-semibold text-[#595c5e] bg-white px-2.5 py-1 rounded-lg"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-6 text-right shrink-0">
                <p className="text-sm text-[#9a9d9f] font-semibold">
                  {team.member_count}/{team.max_members}명
                </p>
                {team.contact_url && (
                  <button
                    onClick={() => handleExternalClick(team.contact_url!)}
                    className="mt-2 inline-block px-4 py-2 text-sm font-bold text-[#0064ff] bg-white rounded-xl hover:bg-[#eef1f3] transition-colors cursor-pointer"
                  >
                    지원하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTeamModal
        hackathonId={hackathonId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <ExternalLinkModal
        open={externalModalOpen}
        url={targetUrl}
        onClose={() => setExternalModalOpen(false)}
      />
    </div>
  );
}

function LeaderboardTab({ hackathonId }: { hackathonId: string }) {
  const { data: rankings = [], isLoading } = useQuery({
    queryKey: ["rankings", hackathonId],
    queryFn: () => fetchRankingsByHackathon(hackathonId),
  });

  const rankColor = (rank: number) =>
    rank === 1
      ? "text-[#e9b824]"
      : rank === 2
        ? "text-[#8792a1]"
        : rank === 3
          ? "text-[#cd7f32]"
          : "text-[#9a9d9f]";

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-[#2c2f31]">리더보드</h3>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-20 bg-[#f5f7f9] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-bold text-[#2c2f31] mb-2">
            아직 순위가 없습니다
          </p>
          <p className="text-[#595c5e]">제출이 완료되면 순위가 표시됩니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.map((entry: RankingEntry) => (
            <div
              key={entry.id}
              className="flex items-center p-6 bg-[#f5f7f9] rounded-2xl group transition-all"
            >
              <span
                className={`w-12 text-2xl font-extrabold ${rankColor(entry.rank)}`}
              >
                {entry.total_score ? entry.rank : "-"}
              </span>
              <span className="flex-1 text-lg font-bold text-[#2c2f31]">
                {entry.team_name}
              </span>
              <div className="relative group/tooltip">
                <span
                  className={`text-xl font-extrabold ${entry.total_score ? "text-[#0064ff] cursor-help" : "text-[#9a9d9f]"}`}
                >
                  {entry.total_score ? `${entry.total_score}점` : "미제출"}
                </span>

                {entry.score_breakdown_json && entry.total_score && (
                  <div className="absolute right-0 bottom-full mb-3 w-56 p-4 bg-[#2c2f31] text-white text-sm rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 shadow-2xl">
                    <p className="font-bold text-[#9a9d9f] uppercase tracking-wider mb-2 pb-2 border-b border-gray-600 text-[11px]">
                      세부 평가 점수
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {Object.entries(entry.score_breakdown_json).map(
                        ([k, v]) => (
                          <div key={k} className="flex justify-between gap-4">
                            <span className="capitalize">
                              {k === "creativity"
                                ? "창의성"
                                : k === "technical"
                                  ? "기술력"
                                  : k === "business"
                                    ? "사업성"
                                    : k}
                            </span>
                            <span className="font-bold text-blue-300">
                              {v as string} / 30
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="absolute top-full right-4 w-3 h-3 bg-[#2c2f31] rotate-45 -mt-1.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 공지/규칙 기본 더미 데이터
const DEFAULT_INFO = {
  rules: [
    "모든 참가자는 대회 기간 내에 결과물을 제출해야 합니다.",
    "외부 라이브러리 및 오픈소스는 라이선스 정책을 준수하여 사용 가능합니다.",
    "팀원은 최소 1명에서 최대 6명까지 구성할 수 있습니다.",
    "제출물은 반드시 대회 기간 내에 개발된 신규 프로젝트여야 합니다.",
    "표절 및 타인 결과물 무단 사용 시 즉시 실격 처리됩니다.",
  ],
  notice: "제출 후에는 내용 수정이 불가합니다. 최종 제출 전 반드시 확인하세요.",
};

// 평가 기준 기본 더미 데이터
const DEFAULT_EVAL = {
  criteria: [
    {
      item: "창의성",
      weight: "30%",
      desc: "아이디어의 독창성, 문제 접근 방식의 혁신성을 평가합니다.",
    },
    {
      item: "기술력",
      weight: "30%",
      desc: "구현 완성도, 코드 품질, 기술 스택의 적절성을 평가합니다.",
    },
    {
      item: "사업성",
      weight: "25%",
      desc: "시장성, 비즈니스 모델의 실현 가능성, 확장성을 평가합니다.",
    },
    {
      item: "발표력",
      weight: "15%",
      desc: "발표 구성, 시연의 명확성, 질의응답 능력을 평가합니다.",
    },
  ],
};

type InfoContent = {
  rules?: string[];
  notice?: string;
};

type EvalCriterion = {
  item: string;
  weight: string;
  desc: string;
};

type EvalContent = {
  criteria?: EvalCriterion[];
};

type DetailTabContent =
  | string
  | InfoContent
  | EvalContent
  | Record<string, unknown>
  | null
  | undefined;

function DetailContentTab({
  title,
  content,
}: {
  title: string;
  content?: DetailTabContent;
}) {
  // 콘텐츠 없을 때 탭별 기본 데이터 사용
  const effectiveContent =
    content ||
    (title === "공지/규칙"
      ? DEFAULT_INFO
      : title === "평가 기준"
        ? DEFAULT_EVAL
        : null);

  if (!effectiveContent) return <ComingSoonTab tab={title} />;

  const resolved = effectiveContent;

  // 공지/규칙 (Info) 특화 렌더링
  if (resolved.rules || resolved.notice) {
    return (
      <div className="space-y-10">
        {resolved.rules && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">
              🔥 참가 규정
            </h3>
            <ul className="space-y-3">
              {resolved.rules.map((r: string, i: number) => (
                <li
                  key={i}
                  className="flex gap-4 text-[#595c5e] font-medium leading-relaxed bg-[#f5f7f9] p-5 rounded-2xl items-center"
                >
                  <span className="w-6 h-6 rounded-full bg-white text-[#0064ff] font-black flex items-center justify-center text-sm shadow-sm shrink-0">
                    {i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {resolved.notice && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">
              📢 주의 사항
            </h3>
            <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl">
              <p className="text-red-500 font-bold leading-relaxed flex gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
                {resolved.notice}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 평가 기준 (Eval) 특화 렌더링
  if (typeof resolved === "object" && resolved && "criteria" in resolved) {
    const evalContent = resolved as EvalContent;
    return (
      <div>
        <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">
          📊 세부 평가 기준
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {evalContent.criteria?.map((c, i) => (
            <div
              key={i}
              className="p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,100,255,0.02)] bg-white rounded-[2rem] flex flex-col hover:-translate-y-1 transition-transform cursor-default"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-extrabold text-[#2c2f31] text-xl">
                  {c.item}
                </span>
                <span className="bg-blue-50 text-[#0064ff] font-extrabold px-4 py-1.5 rounded-full text-sm">
                  {c.weight}
                </span>
              </div>
              <p className="text-[#595c5e] text-[15px] leading-relaxed font-medium">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">{title}</h3>
      <div className="text-[#595c5e] leading-relaxed text-lg whitespace-pre-wrap">
        {typeof content === "string"
          ? content
          : JSON.stringify(content, null, 2)}
      </div>
    </div>
  );
}

function ComingSoonTab({ tab }: { tab: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-5xl font-extrabold text-[#eef1f3] mb-4">{tab}</p>
      <p className="text-[#595c5e] text-lg font-semibold">
        콘텐츠 준비 중입니다.
      </p>
    </div>
  );
}

// ---- 메인 페이지 ----

export function HackathonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [chatOpen, setChatOpen] = useState(false);

  const { data: hackathon, isLoading: isHackathonLoading } = useQuery({
    queryKey: ["hackathon", slug],
    queryFn: () => fetchHackathonBySlug(slug!),
  });

  const { data: details, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["hackathonDetails", hackathon?.id],
    queryFn: () => fetchHackathonDetails(hackathon!.id),
    enabled: !!hackathon?.id,
  });

  if (isHackathonLoading)
    return (
      <div className="animate-pulse h-[600px] w-full bg-white rounded-[3rem]" />
    );
  if (!hackathon)
    return (
      <div className="text-center py-20 text-2xl font-bold">
        Hackathon not found
      </div>
    );

  const isUpcoming = hackathon.status === "upcoming";
  const isOngoing = hackathon.status === "ongoing";
  const statusColor = isUpcoming
    ? "bg-[#eef1f3] text-[#0064ff]"
    : isOngoing
      ? "bg-[#eef1f3] text-[#8d3a8a]"
      : "bg-[#eef1f3] text-[#595c5e]";
  const statusLabels = {
    upcoming: "모집 예정",
    ongoing: "진행 중",
    ended: "종료됨",
  };

  return (
    <div className="pb-32 relative">
      {/* Hero */}
      <div
        className="bg-white rounded-[3rem] p-10 md:p-14 mb-10 overflow-hidden relative"
        style={{ boxShadow: "0 20px 40px rgba(0, 81, 210, 0.04)" }}
      >
        <div className="mb-6">
          <span
            className={`px-5 py-2 text-sm font-bold rounded-full tracking-wide inline-block ${statusColor}`}
          >
            {statusLabels[hackathon.status]}
          </span>
        </div>

        <h1 className="text-4xl md:text-[3.5rem] leading-tight font-extrabold tracking-tight mb-8 text-[#2c2f31]">
          {hackathon.title}
        </h1>

        <div className="flex flex-wrap gap-6 mb-10">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#9a9d9f] uppercase tracking-wider">
              팀 규모
            </span>
            <span className="text-xl font-bold text-[#2c2f31]">
              {hackathon.team_size || "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#9a9d9f] uppercase tracking-wider">
              총 상금
            </span>
            <span className="text-xl font-bold text-[#0064ff]">
              {hackathon.total_prize || "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#9a9d9f] uppercase tracking-wider">
              제출 마감
            </span>
            <span className="text-xl font-bold text-[#2c2f31]">
              {new Date(hackathon.submission_deadline_at).toLocaleDateString(
                "ko-KR",
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {hackathon.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm font-semibold text-[#595c5e] bg-[#f5f7f9] px-4 py-2 rounded-xl"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Tab Nav */}
      <div className="sticky top-16 z-40 bg-[#f5f7f9]/90 backdrop-blur-md pt-4 pb-0 mb-8 overflow-x-auto custom-scrollbar">
        <div className="flex gap-6 border-b-2 border-slate-200/50 text-[#595c5e] font-bold text-[15px] px-2 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 transition-colors relative cursor-pointer ${
                activeTab === tab.id
                  ? "text-[#0064ff] pointer-events-none"
                  : "hover:text-[#2c2f31]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-[#0064ff] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        className="bg-white rounded-[2.5rem] p-10 md:p-14 min-h-[500px]"
        style={{ boxShadow: "0 20px 40px rgba(0, 81, 210, 0.04)" }}
      >
        {activeTab === "Overview" && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#2c2f31]">
              대회 소개
            </h3>
            <p className="text-[#595c5e] leading-relaxed text-lg line-clamp-4">
              {hackathon.description}
            </p>
            {isDetailsLoading ? (
              <div className="mt-8 pt-8 border-t border-slate-100 animate-pulse space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                <div className="h-20 bg-slate-100 rounded w-full"></div>
              </div>
            ) : details?.overview_json ? (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <DetailContentTab
                  title="추가 개요"
                  content={details.overview_json}
                />
              </div>
            ) : null}
          </div>
        )}
        {activeTab === "Info" &&
          (isDetailsLoading ? (
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ) : (
            <DetailContentTab title="공지/규칙" content={details?.info_json} />
          ))}
        {activeTab === "Eval" &&
          (isDetailsLoading ? (
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ) : (
            <DetailContentTab title="평가 기준" content={details?.eval_json} />
          ))}
        {activeTab === "Schedule" && (
          <ScheduleTab
            deadline={hackathon.submission_deadline_at}
            endAt={hackathon.end_at}
          />
        )}
        {activeTab === "Prize" && (
          <PrizeTab
            totalPrize={hackathon.total_prize}
            teamSize={hackathon.team_size}
          />
        )}
        {activeTab === "Teams" && <TeamsTab hackathonId={hackathon.id} />}
        {activeTab === "Submit" && (
          <SubmitForm
            hackathonId={hackathon.id}
            onSuccess={() => setActiveTab("Leaderboard")}
          />
        )}
        {activeTab === "Leaderboard" && (
          <LeaderboardTab hackathonId={hackathon.id} />
        )}
      </div>

      {/* Floating CTA - 우하단 소형 버튼 */}
      {hackathon.status !== "ended" && activeTab !== "Submit" && (
        <button
          onClick={() => {
            setActiveTab("Submit");
            window.scrollTo({ top: 300, behavior: "smooth" });
          }}
          className="fixed bottom-24 right-8 z-40 shadow-[0_8px_24px_rgba(0,100,255,0.3)] bg-[#0064ff] hover:bg-[#0051d2] text-white font-bold text-sm px-5 py-3 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10,17 15,12 10,7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          대회 참가하기
        </button>
      )}

      {/* AI 챗봇 플로팅 버튼 */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-[#0051d2] to-[#7a9dff] text-white font-extrabold text-lg shadow-[0_8px_30px_rgba(0,81,210,0.35)] hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
        aria-label="AI 도우미 토글"
      >
        AI
      </button>

      <AIChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        hackathonId={hackathon.id}
      />
    </div>
  );
}
