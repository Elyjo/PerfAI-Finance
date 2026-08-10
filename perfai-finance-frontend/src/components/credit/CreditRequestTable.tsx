'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, Search, SlidersHorizontal, X } from 'lucide-react'
import CreditStatusBadge from './CreditStatusBadge'
import RiskLevelBadge from './RiskLevelBadge'
import Modal from '@/components/shared/Modal'
import Loading from '@/components/shared/Loading'
import EmptyState from '@/components/shared/EmptyState'
import { useCreditRequests } from '@/hooks/useCreditRequest'
import { useClients } from '@/hooks/useClients'
import { getAllRiskAnalyses } from '@/services/riskService'
import { RiskAnalysis } from '@/types/analysis'
import { formatCurrency } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
}

const inputClass = `
  w-full rounded-xl border border-white/10 bg-white/5
  px-4 py-3 text-sm text-white placeholder-white/30
  outline-none transition
  focus:border-[#0B63C7]/60 focus:bg-[#0B63C7]/5
`
const labelClass = 'block text-xs font-medium text-white/60 mb-2'

export default function CreditRequestTable() {
  const { requests, loading, error, addRequest, changeStatus, refresh } = useCreditRequests()
  const { clients, error: clientsError, refresh: refreshClients } = useClients()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isCreateOpen, setIsCreateOpen] = useState(() => searchParams.get('create') === '1')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [analyses, setAnalyses] = useState<RiskAnalysis[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [form, setForm] = useState({
    client_id: '',
    amount: '',
    duration_months: '',
    purpose: '',
  })

  useEffect(() => {
    void getAllRiskAnalyses().then(setAnalyses).catch(() => setAnalyses([]))
  }, [])

  const analysesByRequest = useMemo(
    () => new Map(analyses.map(analysis => [analysis.request_id, analysis])),
    [analyses]
  )

  const getClient = (id: string) => clients.find(c => c.id === id)

  const filteredRequests = useMemo(() => requests.filter(request => {
    const client = getClient(request.client_id)
    const analysis = analysesByRequest.get(request.id)
    const searchable = `${client?.full_name ?? ''} ${client?.activity ?? ''} ${request.purpose ?? ''}`.toLocaleLowerCase()
    return searchable.includes(query.trim().toLocaleLowerCase())
      && (statusFilter === 'all' || request.status === statusFilter)
      && (riskFilter === 'all' || analysis?.risk_level === riskFilter)
  }), [analysesByRequest, clients, query, requests, riskFilter, statusFilter])

  const clearFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setRiskFilter('all')
  }

  const hasFilters = Boolean(query || statusFilter !== 'all' || riskFilter !== 'all')

  const closeCreate = () => {
    setIsCreateOpen(false)
    if (searchParams.get('create') === '1') router.replace('/credit-requests')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      await addRequest({
        client_id: form.client_id,
        amount: Number(form.amount),
        duration_months: form.duration_months ? Number(form.duration_months) : undefined,
        purpose: form.purpose || undefined,
        status: 'pending',
      })
      closeCreate()
      setForm({ client_id: '', amount: '', duration_months: '', purpose: '' })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'La demande n’a pas pu être créée.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div
        className="
          rounded-2xl border border-white/10 bg-white/3
          backdrop-blur-xl shadow-lg shadow-[#0B63C7]/10
          transition duration-300
          hover:-translate-y-1 hover:border-[#0B63C7]/30 hover:shadow-xl hover:shadow-[#0B63C7]/20
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">Demandes de crédit</h2>
        </div>

        {/* Content */}
        {loading ? (
          <Loading text="Chargement des demandes..." />
        ) : error || clientsError ? (
          <RequestError message={error ?? clientsError ?? 'Erreur de connexion. Vérifiez votre connexion internet, puis réessayez.'} onRetry={() => { void refresh(); void refreshClients() }} />
        ) : requests.length === 0 ? (
          <EmptyState icon={CreditCard} title="Aucune demande" description="Créez votre première demande de crédit." />
        ) : (
          <>
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Rechercher un client, secteur ou motif…" className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#0B63C7]/60" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal size={16} className="text-white/40" />
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="rounded-xl border border-white/10 bg-[#0b1224] px-3 py-2.5 text-sm text-white outline-none focus:border-[#0B63C7]/60">
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
              <select value={riskFilter} onChange={event => setRiskFilter(event.target.value)} className="rounded-xl border border-white/10 bg-[#0b1224] px-3 py-2.5 text-sm text-white outline-none focus:border-[#0B63C7]/60">
                <option value="all">Tous les risques</option>
                <option value="Faible">Risque faible</option>
                <option value="Moyen">Risque moyen</option>
                <option value="Élevé">Risque élevé</option>
              </select>
              {hasFilters && <button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-xl px-2 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"><X size={15} />Effacer</button>}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Secteur</th>
                  <th className="px-5 py-4">Montant</th>
                  <th className="px-5 py-4">Durée</th>
                  <th className="px-5 py-4">Statut</th>
                  <th className="px-5 py-4">Risque</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => {
                  const client = getClient(req.client_id)
                  const analysis = analysesByRequest.get(req.id)
                  return (
                    <tr key={req.id} className="border-b border-white/5 text-sm transition hover:bg-white/3">
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-white">{client?.full_name ?? '—'}</td>
                      <td className="max-w-40 truncate px-5 py-4 text-white/50">{client?.activity ?? '—'}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-white/70">{formatCurrency(req.amount)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-white/70">
                        {req.duration_months ? `${req.duration_months} mois` : '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <CreditStatusBadge status={STATUS_LABELS[req.status] as 'Approuvé' | 'En attente' | 'Rejeté' | 'En analyse'} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <RiskLevelBadge riskLevel={analysis?.risk_level} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => changeStatus(req.id, 'approved')}
                              className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 transition hover:bg-green-500/20 cursor-pointer"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => changeStatus(req.id, 'rejected')}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/20 cursor-pointer"
                            >
                              Rejeter
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredRequests.length === 0 && <div className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/50">Aucune demande ne correspond aux filtres sélectionnés.</div>}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <p className="text-sm text-white/50">{filteredRequests.length} demande{filteredRequests.length > 1 ? 's' : ''}{hasFilters ? ` sur ${requests.length}` : ''}</p>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Modal Création */}
      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title="Nouvelle demande de crédit"
        subtitle="Renseignez les informations de financement"
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Client *</label>
            <select
              className={inputClass + ' appearance-none'}
              value={form.client_id}
              onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}
              required
            >
              <option value="" disabled className="bg-[#020617]">Sélectionner un client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id} className="bg-[#020617]">{c.full_name}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Montant (FCFA) *</label>
              <input
                className={inputClass}
                type="number"
                min="1"
                step="1"
                placeholder="Ex: 1000000"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Durée (mois)</label>
              <input
                className={inputClass}
                type="number"
                min="1"
                step="1"
                placeholder="Ex: 12"
                value={form.duration_months}
                onChange={e => setForm(p => ({ ...p, duration_months: e.target.value }))}
              />
            </div>
          </div>
          {submitError && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{submitError}</p>}
          <div>
            <label className={labelClass}>Motif du crédit</label>
            <input
              className={inputClass}
              placeholder="Ex: Achat de stock, équipement..."
              value={form.purpose}
              onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={closeCreate}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !form.client_id || !form.amount}
              className="rounded-xl bg-[#0B63C7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0954a8] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Création...' : 'Créer la demande'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
