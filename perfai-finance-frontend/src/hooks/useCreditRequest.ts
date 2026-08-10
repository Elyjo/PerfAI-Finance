'use client'

import { useEffect, useState, useCallback } from 'react'
import { CreditRequest, CreateCreditRequestInput } from '@/types/credit'
import {
  getAllCreditRequests,
  createCreditRequest,
  updateCreditRequestStatus,
  deleteCreditRequest,
} from '@/services/creditService'
import { useAuth } from './useAuth'
import { getRequestErrorMessage } from '@/utils/formatters'

export function useCreditRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<CreditRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllCreditRequests()
      setRequests(data)
    } catch (error) {
      setError(getRequestErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Defer the initial fetch so the state updates happen after the effect phase.
    void Promise.resolve().then(fetchRequests)
  }, [fetchRequests])

  const addRequest = async (input: Omit<CreateCreditRequestInput, 'created_by'>) => {
    if (!user) throw new Error('Votre session a expiré. Veuillez vous reconnecter.')
    const data = await createCreditRequest({ ...input, created_by: user?.id })
    setRequests(prev => [data, ...prev])
    return data
  }

  const changeStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const data = await updateCreditRequestStatus(id, status)
    setRequests(prev => prev.map(r => (r.id === id ? data : r)))
    return data
  }

  const removeRequest = async (id: string) => {
    await deleteCreditRequest(id)
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  return { requests, loading, error, addRequest, changeStatus, removeRequest, refresh: fetchRequests }
}
