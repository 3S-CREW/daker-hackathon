import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { AIChatModal } from "@/features/ai-chat"

export function Layout() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9] text-[#2c2f31] font-sans">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
      <Footer />

      {/* AI 챗봇 플로팅 버튼 */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#0051d2] to-[#7a9dff] text-white font-extrabold text-lg shadow-[0_8px_30px_rgba(0,81,210,0.35)] hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
        aria-label="AI 도우미 열기"
      >
        AI
      </button>

      <AIChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  )
}
