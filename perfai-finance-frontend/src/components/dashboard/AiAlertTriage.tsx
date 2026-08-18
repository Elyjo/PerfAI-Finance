'use client'

import { Brain, CircleAlert, ListChecks, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import type { Alert } from '@/types/alert'

type Triage = { priority: 'critique' | 'haute' | 'normale'; summary: string; actions: string[]; anomalies: string[] }

export default function AiAlertTriage({ alerts }: { alerts: Alert[] }) {
  const [triage, setTriage] = useState<Triage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const run = async () => {
    setLoading(true); setError(null)
    try {
      const response = await fetch('/api/ai/alert-triage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alerts: alerts.map(({ type, severity, message, created_at: createdAt }) => ({ type, severity, message, createdAt })) }) })
      const body = await response.json() as { triage?: Triage; error?: string }
      if (!response.ok || !body.triage) throw new Error(body.error ?? 'Triage indisponible.')
      setTriage(body.triage)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Impossible de trier les alertes.') } finally { setLoading(false) }
  }
  if (!alerts.length) return null
  return <div className="mt-5 border-t border-white/10 pt-5"><button onClick={() => void run()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#0B63C7]/30 bg-[#0B63C7]/10 px-3 py-2 text-sm font-medium text-[#8fc4ff] transition hover:bg-[#0B63C7]/20 disabled:opacity-50">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Brain size={16} />}{loading ? 'Triage IA…' : 'Prioriser avec IA'}</button>{error && <p className="mt-3 flex gap-2 text-sm text-red-300"><CircleAlert size={16} />{error}</p>}{triage && <div className="mt-4 rounded-xl border border-[#0B63C7]/20 bg-[#0B63C7]/[0.06] p-4 text-sm"><p className="font-semibold text-[#8fc4ff]">Priorité {triage.priority}</p><p className="mt-2 text-white/70">{triage.summary}</p><div className="mt-3"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/50"><ListChecks size={14} />Actions proposées</p><ul className="mt-2 space-y-1 text-white/65">{triage.actions.map((action, index) => <li key={index}>• {action}</li>)}</ul></div>{triage.anomalies.length > 0 && <p className="mt-3 text-amber-200">Points inhabituels : {triage.anomalies.join(' · ')}</p>}</div>}</div>
}
