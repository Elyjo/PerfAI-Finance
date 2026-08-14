'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock3, CreditCard, XCircle } from 'lucide-react'
import KpiCard from '@/components/shared/KpiCard'
import { getAllCreditRequests } from '@/services/creditService'
import { CreditRequest } from '@/types/credit'

export default function CreditRequestKpis() {
  const [requests, setRequests] = useState<CreditRequest[] | null>(null)

  useEffect(() => {
    void Promise.resolve().then(() => getAllCreditRequests().then(setRequests).catch(() => setRequests([])))
  }, [])

  const value = (number: number) => requests === null ? '…' : number.toLocaleString('fr-FR')
  const pending = requests?.filter(request => request.status === 'pending').length ?? 0
  const approved = requests?.filter(request => request.status === 'approved').length ?? 0
  const rejected = requests?.filter(request => request.status === 'rejected').length ?? 0

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard title="Demandes" value={value(requests?.length ?? 0)} icon={CreditCard} description="Dossiers enregistrés" />
      <KpiCard title="En attente" value={value(pending)} icon={Clock3} description="À examiner" />
      <KpiCard title="Approuvées" value={value(approved)} icon={CheckCircle2} description="Décisions positives" />
      <KpiCard title="Rejetées" value={value(rejected)} icon={XCircle} description="Décisions négatives" />
    </div>
  )
}
