'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Brain } from 'lucide-react'
import { getAllRiskAnalyses } from '@/services/riskService'
import { RiskAnalysis } from '@/types/analysis'
import { getRequestErrorMessage } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'

export default function AiCreditInsights() {
  const [analyses, setAnalyses] = useState<RiskAnalysis[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadAnalyses = useCallback(() => {
    setError(null)
    getAllRiskAnalyses().then(setAnalyses).catch(error => setError(getRequestErrorMessage(error)))
  }, [])

  useEffect(() => { loadAnalyses() }, [loadAnalyses])

  const highRisk = analyses.filter(item => item.risk_level === 'Élevé').length
  const average = analyses.length ? Math.round(analyses.reduce((sum, item) => sum + item.score, 0) / analyses.length) : null
  const items = analyses.length === 0
    ? [{ icon: Brain, title: 'Aucune analyse disponible', description: 'Lancez une analyse de risque sur une demande pour obtenir des recommandations.', color: 'text-[#4A9FFF]' }]
    : [
      { icon: highRisk ? AlertTriangle : CheckCircle2, title: highRisk ? `${highRisk} dossier${highRisk > 1 ? 's' : ''} à risque élevé` : 'Aucun dossier à risque élevé', description: highRisk ? 'Une vérification approfondie est recommandée avant validation.' : 'Les analyses enregistrées ne signalent pas de risque élevé.', color: highRisk ? 'text-yellow-400' : 'text-green-400' },
      { icon: Brain, title: `Score moyen : ${average}/100`, description: `${analyses.length} analyse${analyses.length > 1 ? 's' : ''} de risque enregistrée${analyses.length > 1 ? 's' : ''}.`, color: 'text-[#4A9FFF]' },
    ]

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#0B63C7]/30">
      <h3 className="text-lg font-semibold text-white">Analyse intelligente</h3>
      {error ? <RequestError message={error} onRetry={loadAnalyses} /> :
      <div className="mt-6 flex flex-col gap-4">
        {items.map(item => { const Icon = item.icon; return <div key={item.title} className="flex gap-4 rounded-xl bg-white/5 p-4"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10 ${item.color}`}><Icon size={20} /></div><div><p className="text-sm font-medium text-white">{item.title}</p><p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p></div></div> })}
      </div>
      }
    </div>
  )
}
