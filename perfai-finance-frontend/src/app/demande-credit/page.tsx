'use client'

import Link from 'next/link'
import { CheckCircle2, FileUp, LockKeyhole, Send, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { DOCUMENT_TYPE_LABELS, DOCUMENT_TYPES, type DocumentType } from '@/types/document'
import { ROUTES } from '@/lib/constants'

const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#0B63C7]/70 focus:bg-[#0B63C7]/10'
const labelClass = 'text-sm font-medium text-white/75'

export default function PublicCreditApplicationPage() {
  const [documents, setDocuments] = useState<Partial<Record<DocumentType, File[]>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null); setSubmitting(true)
    try {
      const form = new FormData(event.currentTarget)
      const requiredDocuments: DocumentType[] = ['identity', 'address_proof', 'income_proof', 'bank_statement']
      const missing = requiredDocuments.filter(type => !documents[type]?.length)
      if (missing.length) {
        setError(`Votre dossier est incomplet. Ajoutez les documents obligatoires : ${missing.map(type => DOCUMENT_TYPE_LABELS[type]).join(', ')}.`)
        return
      }
      Object.entries(documents).forEach(([type, files]) => files?.forEach(file => {
        form.append('documents', file)
        form.append('document_types', type)
      }))
      const response = await fetch('/api/credit-applications', { method: 'POST', body: form })
      const body = await response.json() as { error?: string }
      if (!response.ok) throw new Error(body.error ?? 'Votre demande n’a pas pu être envoyée.')
      setSubmitted(true)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Une erreur est survenue.') } finally { setSubmitting(false) }
  }

  const field = (label: string, name: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => <label className={labelClass}>{label}<input name={name} className={inputClass} {...props} /></label>

  return <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-6 text-white sm:px-6 sm:py-10">
    <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#0B63C7]/25 blur-[150px]" />
    <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between"><Link href={ROUTES.HOME} className="text-xl font-bold">Perf<span className="text-[#4A9FFF]">AI</span> Finance</Link><Link href={ROUTES.LOGIN} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10">Espace agent</Link></header>
    <div className="relative z-10 mx-auto mt-10 max-w-5xl">
      <div className="mx-auto max-w-2xl text-center"><div className="inline-flex items-center gap-2 rounded-full border border-[#0B63C7]/30 bg-[#0B63C7]/10 px-4 py-2 text-sm text-[#4A9FFF]"><ShieldCheck size={16} />Demande de crédit sécurisée</div><h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Constituez votre dossier de crédit</h1><p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">Donnez les informations disponibles. Un agent vous accompagne ensuite pour vérifier les pièces et étudier votre demande.</p></div>
      {submitted ? <section className="mx-auto mt-10 max-w-xl rounded-3xl border border-green-400/20 bg-green-500/10 p-8 text-center shadow-2xl"><CheckCircle2 className="mx-auto text-green-400" size={40} /><h2 className="mt-4 text-2xl font-bold">Votre demande a été reçue</h2><p className="mt-3 text-white/65">Un agent vérifiera votre dossier et vous contactera avec les prochaines étapes.</p><Link href={ROUTES.HOME} className="mt-7 inline-flex rounded-xl bg-[#0B63C7] px-5 py-3 text-sm font-semibold transition hover:bg-[#0954a8]">Retour à l’accueil</Link></section> : <>
        <ol className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-2 text-center text-xs sm:text-sm"><li className="rounded-xl border border-[#0B63C7]/40 bg-[#0B63C7]/15 px-2 py-3 text-[#4A9FFF]"><b className="block">1. Profil</b><span className="hidden text-white/45 sm:inline">Identité et activité</span></li><li className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-white/65"><b className="block">2. Projet</b><span className="hidden text-white/45 sm:inline">Besoin de financement</span></li><li className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-white/65"><b className="block">3. Pièces</b><span className="hidden text-white/45 sm:inline">Documents disponibles</span></li></ol>
        <form onSubmit={submit} className="mx-auto mt-6 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <section><div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold">Votre identité et votre activité</h2><p className="mt-1 text-sm text-white/50">Les champs marqués d’un astérisque sont nécessaires.</p></div><span className="rounded-lg bg-white/5 px-3 py-1 text-xs text-white/50">Étape 1</span></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{field('Nom complet *', 'full_name', { required: true, placeholder: 'Ex. Awa Ndiaye' })}{field('Téléphone *', 'phone', { required: true, type: 'tel', placeholder: 'Ex. +221 77 000 00 00' })}{field('Localisation', 'location', { placeholder: 'Ville / quartier' })}{field('Activité / secteur', 'activity', { placeholder: 'Commerce, agriculture…' })}{field('Ancienneté de l’activité (années)', 'business_age', { type: 'number', min: 0 })}{field('Revenus mensuels estimés (FCFA)', 'monthly_income', { type: 'number', min: 0 })}{field('Charges mensuelles estimées (FCFA)', 'monthly_expenses', { type: 'number', min: 0 })}</div></section>
          <section className="mt-10 border-t border-white/10 pt-8"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Votre besoin de financement</h2><span className="rounded-lg bg-white/5 px-3 py-1 text-xs text-white/50">Étape 2</span></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{field('Montant demandé (FCFA) *', 'requested_amount', { required: true, type: 'number', min: 1 })}{field('Durée souhaitée (mois)', 'duration_months', { type: 'number', min: 1 })}<label className="sm:col-span-2 text-sm font-medium text-white/75">Objet du crédit *<textarea name="purpose" required rows={3} placeholder="Expliquez le projet à financer" className={inputClass} /></label>{field('Source de remboursement', 'repayment_source', { placeholder: 'Ventes, salaire, récolte…' })}<label className={labelClass}>Fréquence de remboursement<select name="repayment_frequency" className={inputClass}><option value="" className="bg-[#020617]">À préciser</option><option className="bg-[#020617]">Mensuelle</option><option className="bg-[#020617]">Hebdomadaire</option><option className="bg-[#020617]">Saisonnière</option></select></label><label className="sm:col-span-2 text-sm font-medium text-white/75">Garantie éventuelle<textarea name="collateral_description" rows={2} className={inputClass} /></label></div></section>
          <section className="mt-10 border-t border-white/10 pt-8"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Documents justificatifs</h2><p className="mt-1 text-sm text-white/50">Les quatre premières pièces sont obligatoires. Ajoutez les autres si elles sont disponibles.</p></div><span className="rounded-lg bg-white/5 px-3 py-1 text-xs text-white/50">Étape 3</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{DOCUMENT_TYPES.map(type => { const required = ['identity', 'address_proof', 'income_proof', 'bank_statement'].includes(type); const count = documents[type]?.length ?? 0; return <label key={type} className={`rounded-xl border p-4 transition ${required && count === 0 ? 'border-amber-400/30 bg-amber-400/[0.04]' : 'border-white/10 bg-white/[0.03]'}`}><span className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-white/80">{DOCUMENT_TYPE_LABELS[type]} {required && <em className="not-italic text-[#8fc4ff]">*</em>}</span>{count > 0 && <span className="text-xs text-green-300">{count} ajouté{count > 1 ? 's' : ''}</span>}</span><span className="mt-2 block text-xs text-white/45">PDF, JPEG ou PNG · 10 Mo maximum</span><span className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"><FileUp size={15} />Choisir un fichier<input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png" multiple onChange={event => setDocuments(current => ({ ...current, [type]: Array.from(event.target.files ?? []) }))} /></span></label> })}</div><p className="mt-4 text-xs text-white/45"><span className="text-[#8fc4ff]">*</span> Documents indispensables : pièce d’identité, justificatif de domicile, justificatif de revenus et relevé bancaire.</p></section>
          <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/60"><input name="consent_confirmed" required type="checkbox" className="mt-1 h-4 w-4 accent-[#0B63C7]" /><span>J’accepte que mes données et documents soient utilisés uniquement pour l’étude de ma demande de crédit. Ils sont accessibles uniquement aux agents autorisés.</span></label>{error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}<div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><span className="inline-flex items-center gap-2 text-xs text-white/40"><LockKeyhole size={14} />Transmission sécurisée</span><button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63C7] px-6 py-3 text-sm font-semibold shadow-lg shadow-[#0B63C7]/25 transition hover:bg-[#0954a8] disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} />{submitting ? 'Envoi en cours…' : 'Soumettre ma demande'}</button></div>
        </form>
      </>}
    </div>
  </main>
}
