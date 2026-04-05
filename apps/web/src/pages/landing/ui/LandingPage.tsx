import { ArrowRight, Calendar, Code2, Rocket, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type LandingPhase = "landing" | "home";

const homeCards = [
  {
    to: "/hackathons",
    iconBg: "bg-blue-50",
    iconText: "text-[#0064ff]",
    title: "해커톤 탐색",
    description:
      "진행 중이거나 다가오는 해커톤을 찾아보고 새로운 도전을 시작하세요.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    to: "/camp",
    iconBg: "bg-orange-50",
    iconText: "text-orange-500",
    title: "팀 찾기",
    description:
      "나와 핏이 맞는 완벽한 팀원을 찾거나 흥미로운 프로젝트에 합류하세요.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/rankings",
    iconBg: "bg-purple-50",
    iconText: "text-purple-500",
    title: "랭킹 확인",
    description:
      "영광의 리더보드를 확인하고 다른 팀들과 선의의 경쟁을 펼치세요.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
];

function Navbar({
  phase,
  onBrandClick,
}: {
  phase: LandingPhase;
  onBrandClick: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-indigo-200/10 bg-[#0b1020]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={onBrandClick}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-indigo-50">
            DAKER
          </span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "home" && (
          <motion.div
            key="nav-visible"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute top-0 right-0 h-20 hidden md:flex items-center gap-8 text-sm font-medium text-indigo-100/70 pr-6"
          >
            <Link
              to="/hackathons"
              className="hover:text-indigo-50 transition-colors"
            >
              해커톤
            </Link>
            <Link to="/camp" className="hover:text-indigo-50 transition-colors">
              팀 찾기
            </Link>
            <Link
              to="/rankings"
              className="hover:text-indigo-50 transition-colors"
            >
              랭킹
            </Link>
            <Link
              to="/portfolio"
              className="hover:text-indigo-50 transition-colors"
            >
              포트폴리오
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LandingHero({ onEnterHome }: { onEnterHome: () => void }) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleServiceClick = () => {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);
    window.setTimeout(() => {
      onEnterHome();
    }, 180);
  };

  return (
    <motion.section
      key="landing"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, scale: 0.985 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 pb-16 md:pt-40 md:pb-24 px-6 max-w-7xl mx-auto min-h-[85vh] flex items-center"
    >
      <div className="grid lg:grid-cols-1 gap-10 items-center w-full">
        <motion.div
          layout
          animate={
            isLeaving
              ? { opacity: 0.86, scale: 0.985, y: 8 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[960px] aspect-[16/10] lg:aspect-[16/9] rounded-[2rem] overflow-hidden border border-indigo-200/15 bg-[#0b1020]/70 shadow-xl shadow-indigo-500/20 backdrop-blur-md"
        >
          <iframe
            src="https://my.spline.design/distortingtypography-jbEFZIuE8RR3xEJOvsYT8Agq/"
            width="100%"
            height="100%"
            loading="eager"
            className="block h-full w-full transform-gpu"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          ></iframe>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-6">
            <button
              type="button"
              onClick={handleServiceClick}
              aria-busy={isLeaving}
              className="pointer-events-auto cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-500 text-indigo-50 px-8 py-4 rounded-full font-semibold tracking-tight flex items-center justify-center gap-2 transition-[filter,box-shadow,transform] duration-200 hover:brightness-110 active:brightness-95 active:translate-y-[1px] shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_36px_rgba(99,102,241,0.45)]"
            >
              서비스 이용하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[2rem] ring-1 ring-inset ring-white/10"></div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-indigo-500/12 via-transparent to-blue-500/10"></div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function HomeReveal() {
  return (
    <motion.section
      key="home"
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pt-28 pb-16 md:pt-40 md:pb-24 px-6 max-w-7xl mx-auto min-h-[85vh] flex items-center"
    >
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto w-full max-w-6xl rounded-[2.5rem] bg-[#0a0e1f]/90 border border-indigo-200/10 shadow-[0_30px_80px_rgba(99,102,241,0.16)] backdrop-blur-sm px-6 py-10 md:px-10 md:py-12"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-indigo-50">
              해커톤의 모든 것, Daker
            </h1>
            <p className="text-[1.125rem] text-indigo-100/70 leading-relaxed">
              대회 탐색부터 팀 빌딩, 제출, 그리고 화려한 포트폴리오 생성까지 단
              한 곳에서 해결하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {homeCards.map((card, index) => (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.08 + index * 0.08 }}
              >
                <Link
                  to={card.to}
                  className="group flex h-full flex-col items-start p-8 bg-[#0a0f1f]/85 rounded-[2rem] border border-indigo-200/10 shadow-[0_20px_40px_rgba(99,102,241,0.08)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] transition-all cursor-pointer text-left"
                >
                  <div
                    className={`w-14 h-14 ${card.iconBg} ${card.iconText} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold text-indigo-100 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-indigo-200/65 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Features() {
  const features = [
    {
      icon: <Code2 className="w-6 h-6 text-indigo-300" />,
      title: "다양한 해커톤 정보",
      description:
        "다양한 해커톤 정보를 찾아보고 내가 원하는 해커톤을 직접 신청해보세요.",
    },
    {
      icon: <Rocket className="w-6 h-6 text-indigo-300" />,
      title: "빠른 성장 가속",
      description: "사용자들과 랭킹 경쟁을 통해 성장을 해보세요.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-indigo-300" />,
      title: "나에게 맞는 팀",
      description: "나에게 맞는 팀을 찾거나 직접 팀원을 구할 수 있어요.",
    },
  ];

  return (
    <section id="about" className="py-32 relative">
      <div className="absolute inset-0 bg-[#0d1428]/55 border-y border-indigo-200/10"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-indigo-50">
            실력을 결과로 증명하세요.
          </h2>
          <p className="text-indigo-100/70 text-lg leading-relaxed">
            DAKER는 단순한 해커톤 정보 사이트가 아니에요.
            <br />
            나에게 맞는 팀을 찾고 사용자님의 실력을 결과로 보여주세요.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#0c1326]/70 border border-indigo-200/10 p-8 rounded-3xl hover:bg-[#111b34]/85 transition-colors group"
            >
              <div className="w-14 h-14 bg-indigo-400/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-200/15 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 font-display text-indigo-50">
                {feature.title}
              </h3>
              <p className="text-indigo-100/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a0f1f] py-8 border-t border-indigo-200/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-indigo-50 tracking-tight">
            DAKER
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-indigo-100/65">
          <span>curated by</span>
          <span className="font-display font-bold text-indigo-100 text-lg tracking-tight">
            Mobbin
          </span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  const [phase, setPhase] = useState<LandingPhase>("landing");
  const navigate = useNavigate();

  const handleBrandClick = () => {
    setPhase("landing");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-[#090e1d] via-[#0b1325] to-[#090e1b] text-indigo-50">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-700/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-700/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex-1">
        <Navbar phase={phase} onBrandClick={handleBrandClick} />
        <main>
          <AnimatePresence mode="wait" initial={false}>
            {phase === "landing" ? (
              <LandingHero key="landing" onEnterHome={() => setPhase("home")} />
            ) : (
              <HomeReveal key="home" />
            )}
          </AnimatePresence>
          <Features />
        </main>
        <Footer />
      </div>
    </div>
  );
}
