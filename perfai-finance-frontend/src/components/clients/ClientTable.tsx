'use client'

import { useState } from 'react'
import { UserPlus, Pencil, Trash2, Users } from 'lucide-react'
import ClientRiskBadge from './ClientRiskBadge'
import Modal from '@/components/shared/Modal'
import Loading from '@/components/shared/Loading'
import EmptyState from '@/components/shared/EmptyState'
import { useClients } from '@/hooks/useClients'
import { Client, CreateClientInput, UpdateClientInput } from '@/types/client'
import { formatCurrency, formatDate } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'

const EMPTY_FORM = {
  full_name: '',
  phone: '',
  activity: '',
  monthly_income: '',
  business_age: '',
  location: '',
}

function getRiskFromScore(score: number): 'Faible' | 'Moyen' | 'Élevé' {
  if (score >= 70) return 'Faible'
  if (score >= 45) return 'Moyen'
  return 'Élevé'
}

const inputClass = `
  w-full rounded-xl border border-white/10 bg-white/5
  px-4 py-3 text-sm text-white placeholder-white/30
  outline-none transition
  focus:border-[#0B63C7]/60 focus:bg-[#0B63C7]/5
`

const labelClass = 'block text-xs font-medium text-white/60 mb-2'

type ClientForm = typeof EMPTY_FORM

function ClientFormFields({ form, setForm }: { form: ClientForm; setForm: React.Dispatch<React.SetStateAction<ClientForm>> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass}>Nom complet *</label>
        <input className={inputClass} placeholder="Ex: Fatou Ndiaye" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required />
      </div>
      <div>
        <label className={labelClass}>Téléphone</label>
        <input className={inputClass} placeholder="Ex: +221 77 000 00 00" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      </div>
      <div>
        <label className={labelClass}>Secteur d&apos;activité</label>
        <input className={inputClass} placeholder="Ex: Commerce alimentaire" value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))} />
      </div>
      <div>
        <label className={labelClass}>Revenus mensuels (FCFA)</label>
        <input className={inputClass} type="number" min="0" placeholder="Ex: 250000" value={form.monthly_income} onChange={e => setForm(p => ({ ...p, monthly_income: e.target.value }))} />
      </div>
      <div>
        <label className={labelClass}>Ancienneté activité (années)</label>
        <input className={inputClass} type="number" min="0" placeholder="Ex: 5" value={form.business_age} onChange={e => setForm(p => ({ ...p, business_age: e.target.value }))} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Localisation</label>
        <input className={inputClass} placeholder="Ex: Dakar, Sénégal" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
      </div>
    </div>
  )
}

export default function ClientTable() {
  const { clients, loading, error, addClient, editClient, removeClient, refresh } = useClients()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Client | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setIsCreateOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditTarget(client)
    setForm({
      full_name: client.full_name,
      phone: client.phone ?? '',
      activity: client.activity ?? '',
      monthly_income: client.monthly_income?.toString() ?? '',
      business_age: client.business_age?.toString() ?? '',
      location: client.location ?? '',
    })
  }

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const input: Omit<CreateClientInput, 'created_by'> = {
        full_name: form.full_name,
        phone: form.phone || undefined,
        activity: form.activity || undefined,
        monthly_income: form.monthly_income ? Number(form.monthly_income) : undefined,
        business_age: form.business_age ? Number(form.business_age) : undefined,
        location: form.location || undefined,
      }
      await addClient(input)
      setIsCreateOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTarget) return
    setSubmitting(true)
    try {
      const updates: UpdateClientInput = {
        full_name: form.full_name,
        phone: form.phone || undefined,
        activity: form.activity || undefined,
        monthly_income: form.monthly_income ? Number(form.monthly_income) : undefined,
        business_age: form.business_age ? Number(form.business_age) : undefined,
        location: form.location || undefined,
      }
      await editClient(editTarget.id, updates)
      setEditTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setSubmitting(true)
    try {
      await removeClient(deleteTarget.id)
      setDeleteTarget(null)
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
          <h2 className="text-lg font-semibold text-white">Liste des clients</h2>
          <button
            onClick={openCreate}
            className="
              flex items-center gap-2 rounded-xl bg-[#0B63C7]
              px-4 py-2 text-sm font-semibold text-white
              transition hover:bg-[#0954a8] cursor-pointer
            "
          >
            <UserPlus size={16} />
            Nouveau client
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <Loading text="Chargement des clients..." />
        ) : error ? (
          <RequestError message={error} onRetry={() => void refresh()} />
        ) : clients.length === 0 ? (
          <EmptyState icon={Users} title="Aucun client" description="Ajoutez votre premier client pour commencer." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Risque</th>
                  <th className="px-6 py-4">Revenus</th>
                  <th className="px-6 py-4">Ancienneté</th>
                  <th className="px-6 py-4">Ajouté</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => {
                  const score = client.business_age
                    ? Math.min(100, 50 + client.business_age * 5)
                    : 50
                  const risk = getRiskFromScore(score)
                  return (
                    <tr key={client.id} className="border-b border-white/5 transition hover:bg-white/3">
                      <td className="px-6 py-5">
                        <p className="font-medium text-white lg:whitespace-nowrap">{client.full_name}</p>
                        <p className="mt-1 text-xs text-white/40">{client.activity ?? '—'}</p>
                      </td>
                      <td className="px-6 py-5">
                        <ClientRiskBadge risk={risk} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/70">
                        {client.monthly_income ? formatCurrency(client.monthly_income) : '—'}
                      </td>
                      <td className="px-6 py-5 text-sm text-white/70 lg:whitespace-nowrap">
                        {client.business_age ? `${client.business_age} an(s)` : '—'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/70">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(client)}
                            className="
                              flex h-8 w-8 items-center justify-center rounded-lg
                              border border-white/10 bg-white/5 text-white/50
                              transition hover:border-[#0B63C7]/40 hover:bg-[#0B63C7]/10 hover:text-white
                              cursor-pointer
                            "
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(client)}
                            className="
                              flex h-8 w-8 items-center justify-center rounded-lg
                              border border-white/10 bg-white/5 text-white/50
                              transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400
                              cursor-pointer
                            "
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <p className="text-sm text-white/50">{clients.length} client{clients.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Création */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nouveau client"
        subtitle="Renseignez les informations du demandeur"
        size="lg"
      >
        <form onSubmit={handleSubmitCreate} className="flex flex-col gap-6">
          <ClientFormFields form={form} setForm={setForm} />
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !form.full_name}
              className="rounded-xl bg-[#0B63C7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0954a8] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Création...' : 'Créer le client'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Édition */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Modifier le client"
        subtitle={editTarget?.full_name}
        size="lg"
      >
        <form onSubmit={handleSubmitEdit} className="flex flex-col gap-6">
          <ClientFormFields form={form} setForm={setForm} />
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setEditTarget(null)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !form.full_name}
              className="rounded-xl bg-[#0B63C7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0954a8] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Suppression */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer le client"
        size="sm"
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-white/70">
            Êtes-vous sûr de vouloir supprimer{' '}
            <span className="font-semibold text-white">{deleteTarget?.full_name}</span> ?
            Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="rounded-xl bg-red-500/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
