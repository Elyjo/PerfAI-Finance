'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Eye, FileText, X } from 'lucide-react'
import type { CreditApplication, CreditApplicationDocument } from '@/types/application'
import { getApplicationDocumentUrl, getCreditApplicationDocuments, getCreditApplications, reviewCreditApplication } from '@/services/applicationService'
import { DOCUMENT_TYPE_LABELS } from '@/types/document'
import { formatCurrency, formatDate } from '@/utils/formatters'
import Loading from '@/components/shared/Loading'
import RequestError from '@/components/shared/RequestError'

const statusLabels = { submitted: 'À vérifier', under_review: 'En vérification', approved: 'Validée', rejected: 'Refusée' }

export default function CreditApplicationsPage() {
  const [applications, setApplications] = useState<CreditApplication[]>([])
  const [selected, setSelected] = useState<CreditApplication | null>(null)
  const [documents, setDocuments] = useState<CreditApplicationDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true); setError(null)
    try { setApplications(await getCreditApplications()) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Impossible de charger les pré-demandes.') } finally { setLoading(false) }
  }, [])
  useEffect(() => { void Promise.resolve().then(refresh) }, [refresh])

  const openApplication = async (application: CreditApplication) => {
    setSelected(application); setDocuments([]); setError(null)
    try { setDocuments(await getCreditApplicationDocuments(application.id)) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Impossible de charger les documents.') }
  }
  const openDocument = async (document: CreditApplicationDocument) => {
    try { window.open(await getApplicationDocumentUrl(document.storage_path), '_blank', 'noopener,noreferrer') } catch (reason) { setError(reason instanceof Error ? reason.message : 'Impossible d’ouvrir le document.') }
  }
  const review = async (status: 'approved' | 'rejected' | 'under_review') => {
    if (!selected) return
    setSaving(true); setError(null)
    try {
      const updated = await reviewCreditApplication(selected.id, status)
      setSelected(updated); setApplications(items => items.map(item => item.id === updated.id ? updated : item))
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'La décision n’a pas pu être enregistrée.') } finally { setSaving(false) }
  }

  return <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
    <h1 className="text-3xl font-bold text-white sm:text-4xl">Pré-demandes clients</h1>
    <p className="mt-3 text-white/60">Vérifiez les informations et justificatifs avant de valider ou refuser un dossier.</p>
    {loading ? <Loading text="Chargement des pré-demandes…" /> : error && !selected ? <RequestError message={error} onRetry={() => void refresh()} /> : <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {applications.length === 0 ? <p className="p-8 text-center text-white/50">Aucune pré-demande reçue.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase text-white/40"><tr><th className="px-5 py-4">Demandeur</th><th className="px-5 py-4">Montant</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Reçue</th></tr></thead><tbody>{applications.map(application => <tr key={application.id} onClick={() => void openApplication(application)} className="cursor-pointer border-b border-white/5 text-white/70 transition hover:bg-white/[0.05]"><td className="px-5 py-4"><p className="font-medium text-white">{application.full_name}</p><p className="mt-1 text-xs text-white/40">{application.phone}</p></td><td className="whitespace-nowrap px-5 py-4">{formatCurrency(application.requested_amount)}</td><td className="px-5 py-4">{statusLabels[application.status]}</td><td className="whitespace-nowrap px-5 py-4">{formatDate(application.created_at)}</td></tr>)}</tbody></table></div>}
      </div>
      <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">{selected ? <>
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-white">{selected.full_name}</h2><p className="mt-1 text-sm text-white/50">{selected.phone} · {selected.location || 'Localisation non renseignée'}</p></div><span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/70">{statusLabels[selected.status]}</span></div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-white/40">Activité</dt><dd className="mt-1 text-white/80">{selected.activity || '—'}</dd></div><div><dt className="text-white/40">Ancienneté</dt><dd className="mt-1 text-white/80">{selected.business_age ?? '—'} ans</dd></div><div><dt className="text-white/40">Revenus</dt><dd className="mt-1 text-white/80">{selected.monthly_income ? formatCurrency(selected.monthly_income) : '—'}</dd></div><div><dt className="text-white/40">Charges</dt><dd className="mt-1 text-white/80">{selected.monthly_expenses ? formatCurrency(selected.monthly_expenses) : '—'}</dd></div><div><dt className="text-white/40">Montant</dt><dd className="mt-1 text-white/80">{formatCurrency(selected.requested_amount)}</dd></div><div><dt className="text-white/40">Durée</dt><dd className="mt-1 text-white/80">{selected.duration_months ? `${selected.duration_months} mois` : '—'}</dd></div></dl>
        <div className="mt-5"><p className="text-sm text-white/40">Objet / remboursement</p><p className="mt-1 text-sm text-white/80">{selected.purpose}</p><p className="mt-2 text-sm text-white/60">{selected.repayment_source || 'Source non renseignée'} · {selected.repayment_frequency || 'Fréquence non renseignée'}</p></div>
        <div className="mt-6 border-t border-white/10 pt-5"><h3 className="font-medium text-white">Pièces jointes ({documents.length})</h3>{documents.length === 0 ? <p className="mt-2 text-sm text-white/40">Aucun document joint.</p> : <ul className="mt-3 space-y-2">{documents.map(document => <li key={document.id}><button onClick={() => void openDocument(document)} className="flex w-full items-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10"><FileText size={16} className="text-[#0B63C7]" />{DOCUMENT_TYPE_LABELS[document.document_type]} — {document.file_name}<Eye size={15} className="ml-auto" /></button></li>)}</ul>}</div>
        {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-2"><button disabled={saving} onClick={() => void review('under_review')} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/70">Marquer en vérification</button><button disabled={saving} onClick={() => void review('approved')} className="inline-flex items-center gap-1 rounded-xl bg-green-500/80 px-3 py-2 text-sm font-medium text-white"><Check size={16} />Valider</button><button disabled={saving} onClick={() => void review('rejected')} className="inline-flex items-center gap-1 rounded-xl bg-red-500/80 px-3 py-2 text-sm font-medium text-white"><X size={16} />Refuser</button></div>
      </> : <p className="py-16 text-center text-sm text-white/40">Sélectionnez une pré-demande pour vérifier le dossier.</p>}</aside>
    </div>}
  </section>
}
