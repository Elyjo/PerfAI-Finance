import { supabase } from '@/lib/supabase'
import { CreditRequest, CreateCreditRequestInput, UpdateCreditRequestInput } from '@/types/credit'

// ============================================
// CREATE — Créer une demande de crédit
// ============================================
export const createCreditRequest = async (request: CreateCreditRequestInput): Promise<CreditRequest> => {
  if (!request.client_id) throw new Error('Un client doit être sélectionné.')
  if (!Number.isFinite(request.amount) || request.amount <= 0) throw new Error('Le montant doit être supérieur à zéro.')
  if (request.duration_months !== undefined && (!Number.isFinite(request.duration_months) || request.duration_months <= 0)) {
    throw new Error('La durée doit être supérieure à zéro.')
  }

  const { data, error } = await supabase
    .from('credit_requests')
    .insert([{
      client_id: request.client_id,
      amount: request.amount,
      duration_months: request.duration_months || null,
      purpose: request.purpose || null,
      status: request.status || 'pending',
      ...(request.created_by ? { created_by: request.created_by } : {})
    }])
    .select('*')
    .single()

  if (error) {
    console.error('Erreur création demande:', error.message)
    throw new Error(error.message)
  }
  return data as CreditRequest
}

// ============================================
// READ — Toutes les demandes
// ============================================
export const getAllCreditRequests = async (): Promise<CreditRequest[]> => {
  const { data, error } = await supabase
    .from('credit_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur récupération demandes:', error.message)
    throw new Error(error.message)
  }
  return data as CreditRequest[]
}

// ============================================
// READ — Une demande par ID
// ============================================
export const getCreditRequestById = async (id: string): Promise<CreditRequest> => {
  const { data, error } = await supabase
    .from('credit_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur récupération demande:', error.message)
    throw new Error(error.message)
  }
  return data as CreditRequest
}

// ============================================
// READ — Demandes d'un client spécifique
// ============================================
export const getCreditRequestsByClient = async (clientId: string): Promise<CreditRequest[]> => {
  const { data, error } = await supabase
    .from('credit_requests')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur récupération demandes client:', error.message)
    throw new Error(error.message)
  }
  return data as CreditRequest[]
}

// ============================================
// UPDATE — Modifier une demande
// ============================================
export const updateCreditRequest = async (id: string, updates: UpdateCreditRequestInput): Promise<CreditRequest> => {
  const { data, error } = await supabase
    .from('credit_requests')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Erreur mise à jour demande:', error.message)
    throw new Error(error.message)
  }
  return data as CreditRequest
}

// ============================================
// UPDATE — Changer le statut
// ============================================
export const updateCreditRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<CreditRequest> => {
  return updateCreditRequest(id, { status })
}

// ============================================
// DELETE — Supprimer une demande
// ============================================
export const deleteCreditRequest = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('credit_requests')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression demande:', error.message)
    throw new Error(error.message)
  }
  return true
}

// ============================================
// READ — Demandes par statut
// ============================================
export const getCreditRequestsByStatus = async (status: 'pending' | 'approved' | 'rejected'): Promise<CreditRequest[]> => {
  const { data, error } = await supabase
    .from('credit_requests')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur récupération par statut:', error.message)
    throw new Error(error.message)
  }
  return data as CreditRequest[]
}

// ============================================
// READ — Compter les demandes
// ============================================
export const getCreditRequestCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('credit_requests')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Erreur comptage demandes:', error.message)
    throw new Error(error.message)
  }
  return count || 0
}
