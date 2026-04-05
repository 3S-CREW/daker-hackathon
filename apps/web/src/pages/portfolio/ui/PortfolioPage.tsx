import { useState } from 'react'
import { supabase } from '@/shared/api/supabase'
import { useAuthStore } from '@/shared/store/authStore'

type Step = 'input' | 'loading' | 'preview'

export function PortfolioPage() {
  const { user } = useAuthStore()
  const [username, setUsername] = useState(
    user?.user_metadata?.user_name ?? ''
  )
  const [step, setStep] = useState<Step>('input')
  const [theme, setTheme] = useState<'light' | 'dark' | 'gradient'>('light')
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')

  const generate = async () => {
    const trimmed = username.trim()
    if (!trimmed) return

    setStep('loading')
    setError('')

    try {
      const { data, error: fnError } = await supabase.functions.invoke('portfolio', {
        body: { username: trimmed, theme },
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      })

      if (fnError || data?.error) {
        throw new Error(data?.error ?? fnError?.message)
      }

      setHtml(data.html)
      setStep('preview')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setStep('input')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${username}-portfolio.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pb-24">
      {/* 헤더 */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-[3rem] font-extrabold tracking-tight text-[#2c2f31] leading-tight mb-3">
          포트폴리오 빌더
        </h1>
        <p className="text-[#595c5e] text-lg font-semibold">
          GitHub README를 분석하여 나만의 포트폴리오를 자동 생성합니다.
        </p>
      </div>

      {/* 입력 카드 */}
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 mb-8"
        style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
        <label className="block text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-3">
          GitHub 유저명
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && step === 'input' && generate()}
            placeholder="예: torvalds"
            disabled={step === 'loading'}
            className="flex-1 px-5 py-4 bg-[#f5f7f9] rounded-2xl text-[#2c2f31] font-bold text-lg placeholder:text-[#9a9d9f] outline-none focus:ring-2 focus:ring-[#0064ff]/20 transition disabled:opacity-50"
          />
          <button
            onClick={generate}
            disabled={!username.trim() || step === 'loading'}
            className="px-8 py-4 bg-[#0064ff] disabled:bg-slate-200 text-white font-bold text-lg rounded-2xl hover:bg-[#0051d2] transition-colors active:scale-95 whitespace-nowrap"
          >
            생성하기
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm font-bold text-red-500 bg-red-50 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <div className="mt-8">
          <label className="block text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-4">
            테마 선택
          </label>
          <div className="flex gap-4">
            {(['light', 'dark', 'gradient'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                  theme === t
                    ? 'border-[#0064ff] bg-blue-50 text-[#0064ff]'
                    : 'border-transparent bg-[#f5f7f9] text-[#595c5e] hover:bg-[#eef1f3]'
                }`}
              >
                {t === 'light' ? 'Light' : t === 'dark' ? 'Dark' : 'Gradient'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100">
          <label className="block text-sm font-bold text-[#9a9d9f] uppercase tracking-wider mb-4">
            가이드 (샘플 클릭)
          </label>
          <div className="flex flex-wrap gap-3">
            {['torvalds', 'gaearon', 'tj'].map((name) => (
              <button
                key={name}
                onClick={() => setUsername(name)}
                className="px-4 py-2 text-sm font-bold text-[#595c5e] bg-[#f5f7f9] hover:bg-[#eef1f3] rounded-xl transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 로딩 */}
      {step === 'loading' && (
        <div className="bg-white rounded-[2.5rem] p-14 text-center"
          style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
          <div className="w-14 h-14 rounded-full border-4 border-[#eef1f3] border-t-[#0064ff] animate-spin mx-auto mb-6" />
          <p className="text-xl font-extrabold text-[#2c2f31] mb-2">포트폴리오 생성 중...</p>
          <p className="text-[#9a9d9f] font-semibold">GitHub README를 분석하고 있습니다.</p>
        </div>
      )}

      {/* 미리보기 */}
      {step === 'preview' && html && (
        <div className="bg-white rounded-[2.5rem] overflow-hidden"
          style={{ boxShadow: '0 20px 40px rgba(0, 81, 210, 0.04)' }}>
          {/* 미리보기 툴바 */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-sm font-bold text-[#9a9d9f]">{username}-portfolio.html</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setStep('input'); setHtml('') }}
                className="px-5 py-2.5 text-sm font-bold text-[#595c5e] bg-[#f5f7f9] hover:bg-[#eef1f3] rounded-xl transition-colors"
              >
                다시 생성
              </button>
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#0064ff] hover:bg-[#0051d2] rounded-xl transition-colors"
              >
                HTML 다운로드
              </button>
            </div>
          </div>

          {/* iframe 미리보기 */}
          <iframe
            srcDoc={html}
            title="포트폴리오 미리보기"
            className="w-full"
            style={{ height: '700px', border: 'none' }}
            sandbox="allow-same-origin"
          />
        </div>
      )}
    </div>
  )
}
