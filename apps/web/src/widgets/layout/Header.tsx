import { Link } from "react-router-dom"
import { supabase } from "@/shared/api/supabase"
import { useAuthStore } from "@/shared/store/authStore"

export function Header() {
  const { user, isLoading } = useAuthStore()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { redirectTo: window.location.origin }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl text-[#0064ff] tracking-tight">Daker Hackathon</Link>
        <nav className="flex items-center gap-8 font-semibold text-[15px] text-[#595c5e]">
          <Link to="/hackathons" className="hover:text-[#0064ff] transition-colors">Hackathons</Link>
          <Link to="/camp" className="hover:text-[#0064ff] transition-colors">Camp</Link>
          <Link to="/rankings" className="hover:text-[#0064ff] transition-colors">Rankings</Link>
          
          <div className="w-[1px] h-4 bg-slate-200 mx-2" />
          
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#2c2f31]">{user.user_metadata?.user_name || user.email}</span>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-[#595c5e] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors active:scale-95">로그아웃</button>
              </div>
            ) : (
              <button 
                onClick={handleLogin} 
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#0064ff] hover:bg-[#0051d2] rounded-full transition-all shadow-md shadow-[#0064ff]/20 active:scale-95"
              >
                GitHub로 시작하기
              </button>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
