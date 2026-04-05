import { useEffect } from 'react'

interface ExternalLinkModalProps {
  open: boolean
  url: string
  onClose: () => void
}

export function ExternalLinkModal({ open, url, onClose }: ExternalLinkModalProps) {
  // ESC 키로 닫기 및 바디 스크롤 방지
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  const handleConfirm = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c2f31]/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-extrabold text-[#2c2f31] mb-3 text-center">외부 사이트로 이동합니다</h2>
        <p className="text-[#595c5e] mb-2 font-medium text-center break-all">
          {url}
        </p>
        <p className="text-sm text-[#9a9d9f] mb-8 text-center leading-relaxed">
          외부 링크는 Daker 서비스 외부의 사이트로 연결됩니다.<br/>
          신뢰할 수 있는 링크인지 확인 후 이동해 주세요.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-4 bg-[#f5f7f9] text-[#595c5e] font-bold rounded-full hover:bg-[#eef1f3] transition-all cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="py-4 bg-[#0064ff] text-white font-bold rounded-full hover:bg-[#0051d2] transition-all shadow-lg shadow-blue-200 cursor-pointer"
          >
            이동하기
          </button>
        </div>
      </div>
    </div>
  )
}
