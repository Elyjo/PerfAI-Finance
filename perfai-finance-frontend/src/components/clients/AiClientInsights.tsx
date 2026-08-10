'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react'
import { getAllClients } from '@/services/clientService'
import { getAllCreditRequests } from '@/services/creditService'
import { getAllRiskAnalyses } from '@/services/riskService'
import { getRequestErrorMessage } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'

type Insight = {
  icon: typeof AlertTriangle
  title: string
  description: string
  iconStyle: string
  cardStyle: string
}

export default function AiClientInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadInsights = useCallback(async () => {
    setError(null)
    try {
      const [clients, requests, analyses] = await Promise.all([
        getAllClients(),
        getAllCreditRequests(),
        getAllRiskAnalyses(),
      ])
      const requestsById = new Map(requests.map(request => [request.id, request]))
      const latestAnalysisByClient = new Map<string, typeof analyses[number]>()

      for (const analysis of [...analyses].sort((first, second) => new Date(second.created_at).getTime() - new Date(first.created_at).getTime())) {
        const clientId = requestsById.get(analysis.request_id)?.client_id
        if (clientId && !latestAnalysisByClient.has(clientId)) latestAnalysisByClient.set(clientId, analysis)
      }

      const highRiskCount = [...latestAnalysisByClient.values()].filter(analysis => analysis.risk_level === 'Élevé').length
      const followUpCount = [...latestAnalysisByClient.values()].filter(analysis => analysis.score < 60).length
      const now = new Date()
      const currentMonth = clients.filter(client => {
        const createdAt = new Date(client.created_at)
        return createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth()
      }).length
      const previousMonth = clients.filter(client => {
        const createdAt = new Date(client.created_at)
        const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        return createdAt.getFullYear() === previous.getFullYear() && createdAt.getMonth() === previous.getMonth()
      }).length
      const growth = previousMonth > 0 ? Math.round(((currentMonth - previousMonth) / previousMonth) * 100) : null

      setInsights([
        {
          icon: AlertTriangle,
          title: `${highRiskCount} client${highRiskCount > 1 ? 's' : ''} présente${highRiskCount > 1 ? 'nt' : ''} un risque élevé`,
          description: highRiskCount ? 'Analysez leur capacité de remboursement avant tout nouveau financement.' : 'Aucun profil analysé ne présente actuellement un risque élevé.',
          iconStyle: 'bg-yellow-400/10 text-yellow-400',
          cardStyle: 'bg-yellow-400/5',
        },
        {
          icon: TrendingUp,
          title: growth === null ? `${currentMonth} nouveau${currentMonth > 1 ? 'x' : ''} client${currentMonth > 1 ? 's' : ''} ce mois-ci` : `Portefeuille : ${growth >= 0 ? '+' : ''}${growth}% ce mois-ci`,
          description: previousMonth > 0 ? `${currentMonth} client${currentMonth > 1 ? 's' : ''} ajouté${currentMonth > 1 ? 's' : ''}, contre ${previousMonth} le mois précédent.` : 'La comparaison sera disponible après le premier mois d’activité.',
          iconStyle: 'bg-green-400/10 text-green-400',
          cardStyle: 'bg-green-400/5',
        },
        {
          icon: ArrowRight,
          title: `${followUpCount} client${followUpCount > 1 ? 's' : ''} à suivre`,
          description: followUpCount ? 'Ces profils ont un score IA inférieur à 60/100 et nécessitent un suivi renforcé.' : 'Aucun profil analysé n’a un score IA inférieur à 60/100.',
          iconStyle: 'bg-[#0B63C7]/10 text-[#0B63C7]',
          cardStyle: 'bg-[#0B63C7]/5',
        },
      ])
    } catch (error) {
      setError(getRequestErrorMessage(error))
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(loadInsights)
  }, [loadInsights])

  return (
    <div className="h-fit rounded-2xl border border-white/10 bg-white/3 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0B63C7]/30 hover:shadow-xl hover:shadow-[#0B63C7]/20">
      <h3 className="text-lg font-semibold text-white">Analyse intelligente</h3>
      {error ? <RequestError message={error} onRetry={loadInsights} /> : (
        <div className="mt-6 flex flex-col gap-4">
          {insights.map(item => {
            const Icon = item.icon
            return <div key={item.title} className={`flex gap-4 rounded-xl p-4 ${item.cardStyle}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}><Icon size={20} /></div>
              <div><p className="text-sm font-medium leading-relaxed text-white">{item.title}</p><p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p></div>
            </div>
          })}
        </div>
      )}
    </div>
  )
}
