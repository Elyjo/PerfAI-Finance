'use client'

import { useEffect, useState, useCallback } from 'react'
import { Client, CreateClientInput, UpdateClientInput } from '@/types/client'
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
} from '@/services/clientService'
import { useAuth } from './useAuth'
import { getRequestErrorMessage } from '@/utils/formatters'

export function useClients() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllClients()
      setClients(data)
    } catch (error) {
      setError(getRequestErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Defer the initial fetch so the state updates happen after the effect phase.
    void Promise.resolve().then(fetchClients)
  }, [fetchClients])

  const addClient = async (input: Omit<CreateClientInput, 'created_by'>) => {
    const data = await createClient({ ...input, created_by: user?.id })
    setClients(prev => [data, ...prev])
    return data
  }

  const editClient = async (id: string, updates: UpdateClientInput) => {
    const data = await updateClient(id, updates)
    setClients(prev => prev.map(c => (c.id === id ? data : c)))
    return data
  }

  const removeClient = async (id: string) => {
    await deleteClient(id)
    setClients(prev => prev.filter(c => c.id !== id))
  }

  const search = async (query: string) => {
    if (!query.trim()) return fetchClients()
    setLoading(true)
    try {
      const data = await searchClients(query)
      setClients(data)
    } catch {
      setError('Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  return { clients, loading, error, addClient, editClient, removeClient, search, refresh: fetchClients }
}
