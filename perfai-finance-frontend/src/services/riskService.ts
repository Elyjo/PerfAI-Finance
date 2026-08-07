import { supabase } from '@/lib/supabase'
import { RiskAnalysis } from '@/types/analysis'
import { calculateScore } from './scoringEngine'
import { getClientById } from './clientService'
import { getCreditRequestById } from './creditService'

// ============================================
// CREATE — Analyser une demande et sauvegarder
// ============================================
export const analyzeCreditRequest = async (requestId: string): Promise<RiskAnalysis> => {
  // 1. Récupérer la demande et le client
  const request = await getCreditRequestById(requestId)
  const client = await getClientById(request.client_id)

  // 2. Calculer le score
  const result = calculateScore(client, request)

  // 3. Sauvegarder dans la base
  const { data, error } = await supabase
    .from('risk_analysis')
    .insert([{
      request_id: requestId,
      score: result.score,
      risk_level: result.riskLevel,
      recommendation: result.recommendation,
      explanation: result.explanation
    }])
    .select('*')
    .single()

  if (error) {
    console.error('Erreur analyse risque:', error.message)
    throw new Error(error.message)
  }

  return data as RiskAnalysis
}

// ============================================
// READ — Récupérer l'analyse d'une demande
// ============================================
export const getRiskAnalysis = async (requestId: string): Promise<RiskAnalysis | null> => {
  const { data, error } = await supabase
    .from('risk_analysis')
    .select('*')
    .eq('request_id', requestId)
    .maybeSingle()

  if (error) {
    console.error('Erreur récupération analyse:', error.message)
    throw new Error(error.message)
  }

  return data as RiskAnalysis | null
}

// ============================================
// READ — Toutes les analyses
// ============================================
export const getAllRiskAnalyses = async (): Promise<RiskAnalysis[]> => {
  const { data, error } = await supabase
    .from('risk_analysis')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur récupération analyses:', error.message)
    throw new Error(error.message)
  }

  return data as RiskAnalysis[]
}

// ============================================
// DELETE — Supprimer une analyse
// ============================================
export const deleteRiskAnalysis = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('risk_analysis')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression analyse:', error.message)
    throw new Error(error.message)
  }

  return true
}