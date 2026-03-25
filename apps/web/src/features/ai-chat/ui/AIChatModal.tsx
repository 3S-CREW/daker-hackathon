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

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 현재 메시지 제외한 이전 대화 히스토리 전달 (최근 8턴)
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:justify-end sm:p-6 sm:pb-24">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm sm:hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:w-[400px] h-[70vh] sm:h-[560px] bg-white rounded-t-[2rem] sm:rounded-[2rem] flex flex-col overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(0, 81, 210, 0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0051d2] to-[#7a9dff] flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">AI</span>
            </div>
            <div>
              <p className="font-extrabold text-[#2c2f31] text-[15px]">Daker AI 도우미</p>
              <p className="text-xs font-semibold text-[#9a9d9f]">해커톤 Q&A</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages([INITIAL_MESSAGE])}
              title="대화 초기화"
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-[#9a9d9f] text-xs font-bold"
            >
              reset
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-[#9a9d9f] font-bold text-lg"
            >
              x
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-[14px] font-semibold leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#0064ff] text-white rounded-br-md'
                    : 'bg-[#f5f7f9] text-[#2c2f31] rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#f5f7f9] px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-[#9a9d9f] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#9a9d9f] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#9a9d9f] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2 bg-[#f5f7f9] rounded-2xl px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="질문을 입력하세요..."
              className="flex-1 bg-transparent text-[14px] font-semibold text-[#2c2f31] placeholder:text-[#9a9d9f] outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-[#0064ff] disabled:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] text-[#9a9d9f] font-semibold mt-2">Enter로 전송</p>
        </div>
      </div>
    </div>
  )
}
