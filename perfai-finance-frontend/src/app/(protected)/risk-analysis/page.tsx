'use client'

import { useEffect, useState } from 'react'
import { Brain, FileSearch, Play, ShieldCheck } from 'lucide-react'
import RiskScore from '@/components/analysis/RiskScore'
import { DOCUMENT_TYPE_LABELS } from '@/types/document'
import Loading from '@/components/shared/Loading'
import { useCreditRequests } from '@/hooks/useCreditRequest'
import { useClients } from '@/hooks/useClients'
import { useRiskAnalysis } from '@/hooks/useRiskAnalysis'
import { formatCurrency, formatDate } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'
import { getCreditApplications } from '@/services/applicationService'
import type { CreditApplication } from '@/types/application'

export default function RiskAnalysisPage() {
  const { requests, loading: requestsLoading, error: requestsError, refresh: refreshRequests } = useCreditRequests()
  const { clients, loading: clientsLoading, error: clientsError, refresh: refreshClients } = useClients()
  const { analysis, loading, error, analyze, analyzeApplication, fetchAnalysis, clearAnalysis } = useRiskAnalysis()
  const [applications, setApplications] = useState<CreditApplication[]>([])
  const [applicationsError, setApplicationsError] = useState<string | null>(null)
  const [selection, setSelection] = useState('')

  useEffect(() => { void getCreditApplications().then(setApplications).catch(reason => setApplicationsError(reason instanceof Error ? reason.message : 'Impossible de charger les pré-demandes.')) }, [])

  const selectedRequestId = selection.startsWith('request:') ? selection.slice(8) : ''
  const selectedApplicationId = selection.startsWith('application:') ? selection.slice(12) : ''
  const selectedRequest = requests.find(request => request.id === selectedRequestId)
  const selectedClient = clients.find(client => client.id === selectedRequest?.client_id)
  const selectedApplication = applications.find(application => application.id === selectedApplicationId)

  useEffect(() => {
    if (selectedRequestId) void fetchAnalysis(selectedRequestId)
    else clearAnalysis()
  }, [clearAnalysis, fetchAnalysis, selectedRequestId])

  const runAnalysis = async () => {
    if (selectedRequest) await analyze(selectedRequest.id, selectedRequest.client_id)
    if (selectedApplication) await analyzeApplication(selectedApplication)
  }
  const currentLabel = selectedApplication ? 'pré-demande client' : 'demande interne'
  const loadingData = requestsLoading || clientsLoading
  const dataError = requestsError ?? clientsError ?? applicationsError

  return <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
    <div><h1 className="text-3xl font-bold text-white sm:text-4xl">Analyse des risques</h1><p className="mt-3 text-white/60">Analysez les demandes créées par un agent ou les pré-demandes reçues depuis le formulaire client.</p></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-xl sm:p-6"><label htmlFor="credit-request" className="text-sm font-medium text-white">Dossier à analyser</label>
      {loadingData ? <Loading text="Chargement des dossiers…" /> : dataError ? <RequestError message={dataError} onRetry={() => { void refreshRequests(); void refreshClients(); void getCreditApplications().then(setApplications).catch(() => setApplicationsError('Impossible de charger les pré-demandes.')) }} /> : <>
        <select id="credit-request" value={selection} onChange={event => setSelection(event.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-[#0B63C7]/60"><option value="">Sélectionner un dossier</option><optgroup label="Demandes créées par les agents">{requests.map(request => { const client = clients.find(item => item.id === request.client_id); return <option key={request.id} value={`request:${request.id}`}>{client?.full_name ?? 'Client inconnu'} — {formatCurrency(request.amount)}</option> })}</optgroup><optgroup label="Pré-demandes soumises par les clients">{applications.map(application => <option key={application.id} value={`application:${application.id}`}>{application.full_name} — {formatCurrency(application.requested_amount)} ({application.status})</option>)}</optgroup></select>
        {selectedRequest && selectedClient && <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"><p><span className="text-white/40">Source :</span> Demande entrée par l’agent</p><p className="mt-2"><span className="text-white/40">Client :</span> {selectedClient.full_name}</p><p className="mt-2"><span className="text-white/40">Montant :</span> {formatCurrency(selectedRequest.amount)}</p><p className="mt-2"><span className="text-white/40">Durée :</span> {selectedRequest.duration_months ? `${selectedRequest.duration_months} mois` : 'Non renseignée'}</p></div>}
        {selectedApplication && <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"><p><span className="text-white/40">Source :</span> Formulaire client</p><p className="mt-2"><span className="text-white/40">Demandeur :</span> {selectedApplication.full_name}</p><p className="mt-2"><span className="text-white/40">Montant :</span> {formatCurrency(selectedApplication.requested_amount)}</p><p className="mt-2"><span className="text-white/40">Activité :</span> {selectedApplication.activity || 'Non renseignée'}</p></div>}
        {(selectedRequest || selectedApplication) && <button onClick={() => void runAnalysis()} disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B63C7] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0954a8] disabled:opacity-50"><Play size={16} />{loading ? 'Analyse en cours…' : analysis ? 'Relancer l’analyse' : `Analyser cette ${currentLabel}`}</button>}
      </>}{error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}</div>
      {analysis ? <RiskScore score={analysis.score} level={analysis.risk_level} confidence={analysis.confidence} /> : <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center"><Brain size={28} className="text-[#0B63C7]" /><p className="mt-3 font-medium text-white/70">Résultat de l’analyse</p><p className="mt-1 text-sm text-white/40">Choisissez un dossier pour afficher son score.</p></div>}
    </div>
    {analysis && <div className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl"><div className="flex items-center gap-3"><ShieldCheck className="text-[#0B63C7]" /><h2 className="text-lg font-semibold text-white">Recommandation</h2></div><p className="mt-5 text-xl font-semibold text-white">{analysis.recommendation ?? 'Analyse disponible'}</p><p className="mt-3 leading-relaxed text-white/60">{analysis.explanation ?? 'Aucune explication enregistrée.'}</p></article>{analysis.missing_documents && analysis.missing_documents.length > 0 && <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6"><h2 className="text-lg font-semibold text-amber-200">Éléments à vérifier</h2><p className="mt-3 text-sm text-white/60">Justificatifs manquants : {analysis.missing_documents.map(type => DOCUMENT_TYPE_LABELS[type as keyof typeof DOCUMENT_TYPE_LABELS] ?? type).join(', ')}.</p></article>}<article className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl"><div className="flex items-center gap-3"><FileSearch className="text-[#0B63C7]" /><h2 className="text-lg font-semibold text-white">Traçabilité</h2></div><p className="mt-5 text-sm text-white/60">Analyse générée le {formatDate(analysis.created_at)} pour le dossier sélectionné.</p></article></div>}
  </section>
}
