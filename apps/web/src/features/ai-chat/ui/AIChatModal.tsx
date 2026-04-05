import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/shared/api/supabase'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatModalProps {
  open: boolean
  onClose: () => void
  hackathonId?: string
}

export function AIChatModal({ open, onClose, hackathonId }: AIChatModalProps) {
  const INITIAL_MESSAGE: Message = { role: 'assistant', content: '안녕하세요! Daker Hackathon AI 도우미입니다. 대회 규칙, 팀 구성, 제출 방법 등 무엇이든 질문해 주세요.' }
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 애니메이션을 위한 상태
  const [shouldRender, setShouldRender] = useState(open)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        setIsVisible(true)
        inputRef.current?.focus()
      }, 10)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (isVisible) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isVisible])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const history = messages.slice(1).slice(-8)

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: trimmed, hackathonId, history },
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      })

      if (error) throw error

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply ?? '답변을 가져올 수 없습니다.' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!shouldRender) return null

  return (
    <div className={`fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:justify-end sm:p-6 sm:pb-24 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] sm:hidden"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full sm:w-[420px] h-[75vh] sm:h-[620px] bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_30px_90px_rgba(0,81,210,0.25)] transition-all duration-500 ease-out border border-slate-100 ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-slate-50 bg-gradient-to-r from-white to-[#f8faff]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0051d2] to-[#7a9dff] flex items-center justify-center shadow-lg shadow-blue-100 ring-2 ring-blue-50">
              <span className="text-white font-black text-sm tracking-tighter">AI</span>
            </div>
            <div>
              <p className="font-extrabold text-[#2c2f31] text-[16px] tracking-tight">Daker AI 도우미 🤖</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[11px] font-bold text-[#9a9d9f] uppercase tracking-wider">Ready to assist</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { if(confirm('대화 내용을 초기화할까요?')) setMessages([INITIAL_MESSAGE])}}
              title="대화 초기화"
              className="p-2 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-[#9a9d9f] hover:text-[#595c5e] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors text-[#9a9d9f] hover:text-red-500 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar bg-[#fcfdfe]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] px-5 py-3.5 rounded-[1.5rem] text-[14px] font-semibold leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#0064ff] text-white rounded-br-md shadow-[0_8px_20px_rgba(0,100,255,0.2)]'
                    : 'bg-white text-[#2c2f31] rounded-bl-md border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 px-5 py-4 rounded-[1.5rem] rounded-bl-md flex gap-2 items-center shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0064ff] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0064ff] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0064ff] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3 bg-[#f5f7f9] rounded-[1.5rem] px-5 py-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-transparent focus-within:border-blue-200">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="질문을 입력하세요..."
              className="flex-1 bg-transparent text-[14px] font-bold text-[#2c2f31] placeholder:text-[#9a9d9f] outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-[#0064ff] text-white disabled:bg-slate-200 flex items-center justify-center transition-all shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-[#9a9d9f] font-bold mt-3 tracking-widest uppercase opacity-70">
            Powered by Daker Engine
          </p>
        </div>
      </div>
    </div>
  )
}
