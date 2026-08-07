'use client'

import { useEffect, useState } from 'react'
import { Brain, FileSearch, Play, ShieldCheck } from 'lucide-react'
import RiskScore from '@/components/analysis/RiskScore'
import Loading from '@/components/shared/Loading'
import { useCreditRequests } from '@/hooks/useCreditRequest'
import { useClients } from '@/hooks/useClients'
import { useRiskAnalysis } from '@/hooks/useRiskAnalysis'
import { formatCurrency, formatDate } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'

export default function RiskAnalysisPage() {
  const { requests, loading: requestsLoading, error: requestsError, refresh: refreshRequests } = useCreditRequests()
  const { clients, loading: clientsLoading, error: clientsError, refresh: refreshClients } = useClients()
  const { analysis, loading, error, analyze, fetchAnalysis } = useRiskAnalysis()
  const [requestId, setRequestId] = useState('')

  const selectedRequest = requests.find(request => request.id === requestId)
  const selectedClient = clients.find(client => client.id === selectedRequest?.client_id)

  useEffect(() => {
    if (requestId) void fetchAnalysis(requestId)
  }, [fetchAnalysis, requestId])

  const runAnalysis = async () => {
    if (!selectedRequest) return
    await analyze(selectedRequest.id, selectedRequest.client_id)
  }

  return (
    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
      <div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Analyse des risques</h1>
        <p className="mt-3 text-white/60">Sélectionnez une demande pour générer et conserver une recommandation explicable.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-xl sm:p-6">
          <label htmlFor="credit-request" className="text-sm font-medium text-white">Demande de crédit</label>
          {requestsLoading || clientsLoading ? (
            <Loading text="Chargement des demandes…" />
          ) : requestsError || clientsError ? (
            <RequestError message={requestsError ?? clientsError ?? 'Erreur de connexion. Vérifiez votre connexion internet, puis réessayez.'} onRetry={() => { void refreshRequests(); void refreshClients() }} />
          ) : requests.length === 0 ? (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              Aucune demande disponible. Créez d’abord une demande de crédit.
            </p>
          ) : (
            <>
              <select
                id="credit-request"
                value={requestId}
                onChange={event => setRequestId(event.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-[#0B63C7]/60"
              >
                <option value="">Sélectionner une demande</option>
                {requests.map(request => {
                  const client = clients.find(item => item.id === request.client_id)
                  return <option key={request.id} value={request.id}>{client?.full_name ?? 'Client inconnu'} — {formatCurrency(request.amount)}</option>
                })}
              </select>

              {selectedRequest && selectedClient && (
                <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <p><span className="text-white/40">Client :</span> {selectedClient.full_name}</p>
                  <p className="mt-2"><span className="text-white/40">Montant :</span> {formatCurrency(selectedRequest.amount)}</p>
                  <p className="mt-2"><span className="text-white/40">Durée :</span> {selectedRequest.duration_months ? `${selectedRequest.duration_months} mois` : 'Non renseignée'}</p>
                  <button onClick={runAnalysis} disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B63C7] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0954a8] disabled:opacity-50">
                    <Play size={16} /> {loading ? 'Analyse en cours…' : analysis ? 'Relancer l’analyse' : 'Lancer l’analyse'}
                  </button>
                </div>
              )}
            </>
          )}

          {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
        </div>

        {analysis ? (
          <RiskScore score={analysis.score} level={analysis.risk_level} />
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
            <Brain size={28} className="text-[#0B63C7]" />
            <p className="mt-3 font-medium text-white/70">Résultat de l’analyse</p>
            <p className="mt-1 text-sm text-white/40">Choisissez une demande pour afficher son score.</p>
          </div>
        )}
      </div>

      {analysis && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3"><ShieldCheck className="text-[#0B63C7]" /><h2 className="text-lg font-semibold text-white">Recommandation</h2></div>
            <p className="mt-5 text-xl font-semibold text-white">{analysis.recommendation ?? 'Analyse disponible'}</p>
            <p className="mt-3 leading-relaxed text-white/60">{analysis.explanation ?? 'Aucune explication enregistrée.'}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3"><FileSearch className="text-[#0B63C7]" /><h2 className="text-lg font-semibold text-white">Traçabilité</h2></div>
            <p className="mt-5 text-sm text-white/60">Analyse enregistrée le {formatDate(analysis.created_at)} pour la demande sélectionnée.</p>
          </article>
        </div>
      )}
    </section>
  )
}
