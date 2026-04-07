import { Terminal } from "lucide-react";

import { supabase } from "@/shared/api/supabase";
import { useAuthStore } from "@/shared/store/authStore";
import { Link } from "react-router-dom";

export function Header() {
  const { user, isLoading } = useAuthStore();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { 
        // 로그인 후 /hackathons 로 직접 이동 → LandingPage phase 초기화 문제 방지
        // 배포 시에도 정확한 URL이 필요하므로 origin + /hackathons 사용
        redirectTo: `${window.location.origin}/hackathons`,
        queryParams: { prompt: 'select_account' }
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/hackathons"
          className="font-extrabold flex items-center gap-2 text-2xl text-[#0064ff] tracking-tight"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          DAKER
        </Link>
        <nav className="flex items-center gap-8 font-semibold text-[15px] text-[#595c5e]">
          <Link to="/hackathons" className="hover:text-[#0064ff] transition-colors cursor-pointer">해커톤</Link>
          <Link to="/camp" className="hover:text-[#0064ff] transition-colors cursor-pointer">팀원 모집</Link>
          <Link to="/rankings" className="hover:text-[#0064ff] transition-colors cursor-pointer">랭킹</Link>
          <Link to="/portfolio" className="hover:text-[#0064ff] transition-colors cursor-pointer">포트폴리오</Link>
          
          <div className="w-[1px] h-4 bg-slate-200 mx-2" />

          {!isLoading &&
            (user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-sm font-semibold text-[#2c2f31] hover:text-[#0064ff] transition-colors cursor-pointer">{user.user_metadata?.user_name || user.email}</Link>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-[#595c5e] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors active:scale-95 cursor-pointer">로그아웃</button>
              </div>
            ) : (
              <button 
                onClick={handleLogin} 
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#0064ff] hover:bg-[#0051d2] rounded-full transition-all shadow-md shadow-[#0064ff]/20 active:scale-95 cursor-pointer"
              >
                GitHub로 시작하기
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
}
