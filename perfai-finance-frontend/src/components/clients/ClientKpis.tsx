'use client'

import { useEffect, useState } from 'react'
import { BriefcaseBusiness, MapPin, Users } from 'lucide-react'
import KpiCard from '@/components/shared/KpiCard'
import { getAllClients } from '@/services/clientService'
import { Client } from '@/types/client'

export default function ClientKpis() {
  const [clients, setClients] = useState<Client[] | null>(null)

  useEffect(() => {
    void Promise.resolve().then(() => getAllClients().then(setClients).catch(() => setClients([])))
  }, [])

  const activities = new Set(clients?.map(client => client.activity).filter(Boolean)).size
  const locations = new Set(clients?.map(client => client.location).filter(Boolean)).size
  const value = (number: number) => clients === null ? '…' : number.toLocaleString('fr-FR')

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <KpiCard title="Clients" value={value(clients?.length ?? 0)} icon={Users} description="Portefeuille enregistré" />
      <KpiCard title="Secteurs" value={value(activities)} icon={BriefcaseBusiness} description="Activités représentées" />
      <KpiCard title="Localisations" value={value(locations)} icon={MapPin} description="Zones couvertes" />
    </div>
  )
}
