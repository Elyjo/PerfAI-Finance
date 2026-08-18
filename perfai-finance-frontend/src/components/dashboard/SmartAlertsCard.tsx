'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { getAllAlerts } from '@/services/alertService'
import { Alert } from '@/types/alert'
import { formatRelativeTime } from '@/utils/formatters'
import { getRequestErrorMessage } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'
import AiAlertTriage from './AiAlertTriage'

const styles = {
  critical: 'bg-red-500/5 text-red-400',
  warning: 'bg-yellow-400/5 text-yellow-400',
  info: 'bg-[#0B63C7]/10 text-[#4A9FFF]',
}

export default function SmartAlertsCard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadAlerts = useCallback(() => {
    setError(null)
    getAllAlerts().then(data => setAlerts(data.slice(0, 3))).catch(error => setError(getRequestErrorMessage(error)))
  }, [])

  useEffect(() => { void Promise.resolve().then(loadAlerts) }, [loadAlerts])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#0B63C7]/30">
      <h3 className="text-lg font-semibold text-white">Alertes intelligentes</h3>
      {error ? <RequestError message={error} onRetry={loadAlerts} /> :
      <>
      <div className="mt-6 flex flex-col gap-4">
        {alerts.length === 0 ? (
          <p className="rounded-xl bg-white/5 p-4 text-sm text-white/50">Aucune alerte récente.</p>
        ) : alerts.map(alert => (
          <div key={alert.id} className={`flex gap-4 rounded-xl p-4 ${styles[alert.severity]}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10"><AlertCircle size={20} /></div>
            <div><p className="text-sm font-medium leading-relaxed text-white">{alert.message}</p><p className="mt-2 text-xs text-white/40">{formatRelativeTime(alert.created_at)}</p></div>
          </div>
        ))}
      </div>
      <AiAlertTriage alerts={alerts} />
      </>
      }
    </div>
  )
}
