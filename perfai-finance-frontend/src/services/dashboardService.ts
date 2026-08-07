import { supabase } from '@/lib/supabase'

export type DashboardStats = {
  totalClients: number
  totalCreditRequests: number
  highRiskCount: number
  approvalRate: number
}

const throwDashboardError = (resource: string, error: { message?: string; code?: string }) => {
  const detail = error.message || error.code || 'erreur Supabase inconnue'
  throw new Error(`Impossible de charger les KPI (${resource}) : ${detail}`)
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // 1. Nombre total de clients
  const { count: totalClients, error: clientError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  if (clientError) throwDashboardError('clients', clientError)

  // 2. Nombre total de demandes de crédit
  const { count: totalCreditRequests, error: creditError } = await supabase
    .from('credit_requests')
    .select('*', { count: 'exact', head: true })

  if (creditError) throwDashboardError('demandes de crédit', creditError)

  // 3. Nombre de risques élevés
  const { count: highRiskCount, error: riskError } = await supabase
    .from('risk_analysis')
    .select('*', { count: 'exact', head: true })
    .eq('risk_level', 'Élevé')

  if (riskError) throwDashboardError('analyses de risque', riskError)

  // 4. Taux d'approbation
  const { count: approvedCount, error: approvedError } = await supabase
    .from('credit_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  if (approvedError) throwDashboardError('demandes approuvées', approvedError)

  const approvalRate = totalCreditRequests && totalCreditRequests > 0
    ? Math.round((approvedCount! / totalCreditRequests) * 100)
    : 0

  return {
    totalClients: totalClients || 0,
    totalCreditRequests: totalCreditRequests || 0,
    highRiskCount: highRiskCount || 0,
    approvalRate
  }
}
