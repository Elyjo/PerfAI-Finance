'use client'

import { useCallback, useEffect, useState } from 'react'
import { getAllAlerts } from '@/services/alertService'
import { getAllClients } from '@/services/clientService'
import { getAllCreditRequests } from '@/services/creditService'
import { getAllRiskAnalyses } from '@/services/riskService'
import { formatRelativeTime, getRequestErrorMessage } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'

type Activity = { id: string; title: string; createdAt: string; color: string }
const alertColors = { critical: 'bg-red-500', warning: 'bg-yellow-400', info: 'bg-[#0B63C7]' }

export default function RecentClientActivityCard() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadActivities = useCallback(async () => {
    setError(null)
    try {
      const [clients, requests, analyses, alerts] = await Promise.all([getAllClients(), getAllCreditRequests(), getAllRiskAnalyses(), getAllAlerts()])
      const clientsById = new Map(clients.map(client => [client.id, client.full_name]))
      const requestsById = new Map(requests.map(request => [request.id, request]))
      const clientActivities = clients.map(client => ({ id: `client-${client.id}`, title: `${client.full_name} a été ajouté au portefeuille`, createdAt: client.created_at, color: 'bg-[#0B63C7]' }))
      const analysisActivities = analyses.map(analysis => {
        const request = requestsById.get(analysis.request_id)
        return { id: `analysis-${analysis.id}`, title: `Analyse IA terminée pour ${request ? clientsById.get(request.client_id) ?? 'client inconnu' : 'client inconnu'}`, createdAt: analysis.created_at, color: analysis.risk_level === 'Élevé' ? 'bg-red-500' : analysis.risk_level === 'Moyen' ? 'bg-yellow-400' : 'bg-green-400' }
      })
      const alertActivities = alerts.map(alert => ({ id: `alert-${alert.id}`, title: alert.message, createdAt: alert.created_at, color: alertColors[alert.severity] }))
      setActivities([...clientActivities, ...analysisActivities, ...alertActivities].sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()).slice(0, 5))
    } catch (error) {
      setError(getRequestErrorMessage(error))
    }
  }, [])

  useEffect(() => { void Promise.resolve().then(loadActivities) }, [loadActivities])

  return (
    <div className="h-fit rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl shadow-lg shadow-[#0B63C7]/10 transition duration-300 hover:-translate-y-1 hover:border-[#0B63C7]/30 hover:shadow-xl hover:shadow-[#0B63C7]/20">
      <h3 className="text-lg font-semibold text-white">Activité récente</h3>
      {error ? <RequestError message={error} onRetry={loadActivities} /> : <div className="mt-6 flex flex-col gap-5">
        {activities.length === 0 ? <p className="rounded-xl bg-white/5 p-4 text-sm text-white/50">Aucune activité récente.</p> : activities.map(activity => <div key={activity.id} className="flex items-start gap-4"><span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${activity.color}`} /><div className="min-w-0"><p className="break-words text-sm font-medium leading-relaxed text-white">{activity.title}</p><p className="mt-1 text-xs text-white/50">{formatRelativeTime(activity.createdAt)}</p></div></div>)}
      </div>}
    </div>
  )
}
