'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!isOpen) return null

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-4 sm:py-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Glow effect */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B63C7]/20 blur-[100px] pointer-events-none" />

      {/* Modal */}
      <div
        className={`
          relative z-10 w-full ${sizeClass}
          rounded-3xl
          border border-[#0B63C7]/30
          bg-[#020617]
          shadow-2xl shadow-[#0B63C7]/20
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl border border-white/10 bg-white/5
              text-white/50 transition
              hover:border-[#0B63C7]/40 hover:bg-[#0B63C7]/10 hover:text-white
              cursor-pointer
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-8 sm:py-6">{children}</div>
      </div>
    </div>
  )
}
