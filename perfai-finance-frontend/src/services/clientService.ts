import { supabase } from '@/lib/supabase'
import { Client, CreateClientInput, UpdateClientInput } from '@/types/client'

// ============================================
// CREATE — Créer un client
// ============================================
export const createClient = async (client: CreateClientInput): Promise<Client> => {
  if (!client.full_name.trim()) throw new Error('Le nom complet est obligatoire.')
  if (client.monthly_income !== undefined && (!Number.isFinite(client.monthly_income) || client.monthly_income < 0)) {
    throw new Error('Le revenu mensuel doit être un montant positif.')
  }
  if (client.business_age !== undefined && (!Number.isFinite(client.business_age) || client.business_age < 0)) {
    throw new Error('L’ancienneté doit être positive.')
  }

  const { data, error } = await supabase
    .from('clients')
    .insert([{
      full_name: client.full_name,
      phone: client.phone || null,
      activity: client.activity || null,
      monthly_income: client.monthly_income || null,
      business_age: client.business_age || null,
      location: client.location || null,
      ...(client.created_by ? { created_by: client.created_by } : {})
    }])
    .select('*')
    .single()

  if (error) {
    console.error('Erreur création client:', error.message)
    throw new Error(error.message)
  }
  return data as Client
}

// ============================================
// READ — Récupérer tous les clients
// ============================================
export const getAllClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur récupération clients:', error.message)
    throw new Error(error.message)
  }
  return data as Client[]
}

// ============================================
// READ — Récupérer un client par ID
// ============================================
export const getClientById = async (id: string): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur récupération client:', error.message)
    throw new Error(error.message)
  }
  return data as Client
}

// ============================================
// UPDATE — Modifier un client
// ============================================
export const updateClient = async (id: string, updates: UpdateClientInput): Promise<Client> => {
  if (updates.full_name !== undefined && !updates.full_name.trim()) throw new Error('Le nom complet est obligatoire.')
  if (updates.monthly_income !== undefined && (updates.monthly_income === null || !Number.isFinite(updates.monthly_income) || updates.monthly_income < 0)) {
    throw new Error('Le revenu mensuel doit être un montant positif.')
  }
  if (updates.business_age !== undefined && (updates.business_age === null || !Number.isFinite(updates.business_age) || updates.business_age < 0)) {
    throw new Error('L’ancienneté doit être positive.')
  }

  const { data, error } = await supabase
    .from('clients')
    .update({
      ...(updates.full_name && { full_name: updates.full_name }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.activity !== undefined && { activity: updates.activity }),
      ...(updates.monthly_income !== undefined && { monthly_income: updates.monthly_income }),
      ...(updates.business_age !== undefined && { business_age: updates.business_age }),
      ...(updates.location !== undefined && { location: updates.location })
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Erreur mise à jour client:', error.message)
    throw new Error(error.message)
  }
  return data as Client
}

// ============================================
// DELETE — Supprimer un client
// ============================================
export const deleteClient = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression client:', error.message)
    throw new Error(error.message)
  }
  return true
}

// ============================================
// READ — Rechercher des clients
// ============================================
export const searchClients = async (query: string): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .or(`full_name.ilike.%${query}%,activity.ilike.%${query}%,location.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur recherche clients:', error.message)
    throw new Error(error.message)
  }
  return data as Client[]
}

// ============================================
// READ — Compter le nombre de clients
// ============================================
export const getClientCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Erreur comptage clients:', error.message)
    throw new Error(error.message)
  }
  return count || 0
}
