import { supabase } from '@/lib/supabase'

export type DashboardStats = {
  totalClients: number
  totalCreditRequests: number
  highRiskCount: number
  approvalRate: number
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // 1. Nombre total de clients
  const { count: totalClients, error: clientError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  if (clientError) throw new Error(clientError.message)

  // 2. Nombre total de demandes de crédit
  const { count: totalCreditRequests, error: creditError } = await supabase
    .from('credit_requests')
    .select('*', { count: 'exact', head: true })

  if (creditError) throw new Error(creditError.message)

  // 3. Nombre de risques élevés
  const { count: highRiskCount, error: riskError } = await supabase
    .from('risk_analysis')
    .select('*', { count: 'exact', head: true })
    .eq('risk_level', 'Élevé')

  if (riskError) throw new Error(riskError.message)

  // 4. Taux d'approbation
  const { count: approvedCount, error: approvedError } = await supabase
    .from('credit_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  if (approvedError) throw new Error(approvedError.message)

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