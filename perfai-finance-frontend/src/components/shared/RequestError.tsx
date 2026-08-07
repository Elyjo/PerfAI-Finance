'use client'

import { RefreshCw, WifiOff } from 'lucide-react'

export default function RequestError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-4 px-5 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 text-red-300"><WifiOff size={22} /></div>
      <div><p className="font-medium text-white">Impossible de charger les données</p><p className="mt-1 max-w-sm text-sm text-white/55">{message}</p></div>
      {onRetry && <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"><RefreshCw size={15} />Réessayer</button>}
    </div>
  )
}
