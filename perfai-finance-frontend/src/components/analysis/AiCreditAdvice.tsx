'use client'

import { Brain, CircleAlert, Lightbulb, LoaderCircle } from 'lucide-react'
import { useState } from 'react'

type Advice = { summary: string; strengths: string[]; risks: string[]; questions: string[]; recommendation: string }
type Props = { payload: Record<string, unknown> }

export default function AiCreditAdvice({ payload }: Props) {
  const [advice, setAdvice] = useState<Advice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const generate = async () => {
    setLoading(true); setError(null)
    try {
      const response = await fetch('/api/ai/credit-advice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const body = await response.json() as { advice?: Advice; error?: string }
      if (!response.ok || !body.advice) throw new Error(body.error ?? 'Réponse IA indisponible.')
      setAdvice(body.advice)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Impossible de joindre l’assistant IA.') } finally { setLoading(false) }
  }
  return <article className="rounded-2xl border border-[#0B63C7]/25 bg-[#0B63C7]/[0.06] p-6"><div className="flex items-center gap-3"><Brain className="text-[#4A9FFF]" /><h2 className="text-lg font-semibold text-white">Avis Gemini</h2></div><p className="mt-3 text-sm leading-relaxed text-white/60">Avis explicable basé sur des données anonymisées. Il aide l’agent, mais ne remplace jamais la vérification humaine.</p>{!advice && <button onClick={() => void generate()} disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B63C7] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Lightbulb size={16} />}{loading ? 'Analyse IA…' : 'Obtenir un avis IA'}</button>}{error && <p className="mt-4 flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"><CircleAlert size={16} />{error}</p>}{advice && <div className="mt-5 space-y-4 text-sm"><p className="font-medium text-white">{advice.summary}</p><div><h3 className="text-xs font-semibold uppercase tracking-wide text-green-300">Points favorables</h3><ul className="mt-2 space-y-1 text-white/65">{advice.strengths.map((item, index) => <li key={index}>• {item}</li>)}</ul></div><div><h3 className="text-xs font-semibold uppercase tracking-wide text-amber-200">Risques et vérifications</h3><ul className="mt-2 space-y-1 text-white/65">{advice.risks.map((item, index) => <li key={index}>• {item}</li>)}</ul></div><div><h3 className="text-xs font-semibold uppercase tracking-wide text-[#8fc4ff]">Questions à poser</h3><ul className="mt-2 space-y-1 text-white/65">{advice.questions.map((item, index) => <li key={index}>• {item}</li>)}</ul></div><p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 font-semibold text-white">{advice.recommendation}</p></div>}</article>
}
