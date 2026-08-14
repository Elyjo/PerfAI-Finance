import { supabase } from '@/lib/supabase'
import { RiskAnalysis } from '@/types/analysis'
import { calculateScore } from './scoringEngine'
import { getClientById } from './clientService'
import { getCreditRequestById } from './creditService'
import { getClientDocuments } from './documentService'
import { getCreditApplicationDocuments } from './applicationService'
import type { CreditApplication } from '@/types/application'

// ============================================
// CREATE — Analyser une demande et sauvegarder
// ============================================
export const analyzeCreditRequest = async (requestId: string): Promise<RiskAnalysis> => {
  // 1. Récupérer la demande et le client
  const request = await getCreditRequestById(requestId)
  const client = await getClientById(request.client_id)

  // 2. Calculer le score
  const documents = await getClientDocuments(client.id)
  const documentTypes = documents
    .filter(document => !document.credit_request_id || document.credit_request_id === requestId)
    .map(document => document.document_type)
  const result = calculateScore(client, request, documentTypes)

  // 3. Sauvegarder dans la base
  const { data, error } = await supabase
    .from('risk_analysis')
    .upsert([{
      request_id: requestId,
      score: result.score,
      risk_level: result.riskLevel,
      recommendation: result.recommendation,
      explanation: result.explanation,
      confidence: result.confidence,
      missing_documents: result.missingDocuments,
      score_details: result.details,
    }], { onConflict: 'request_id' })
    .select('*')
    .single()

  if (error) {
    console.error('Erreur analyse risque:', error.message)
    throw new Error(error.message)
  }

  return data as RiskAnalysis
}

// Analyse de pré-demande : résultat consultable par l'agent, sans transformer la pré-demande en crédit interne.
export const analyzePublicCreditApplication = async (application: CreditApplication): Promise<RiskAnalysis> => {
  const documents = await getCreditApplicationDocuments(application.id)
  const result = calculateScore({
    id: application.id,
    full_name: application.full_name,
    phone: application.phone,
    location: application.location ?? undefined,
    activity: application.activity ?? undefined,
    monthly_income: application.monthly_income ?? undefined,
    business_age: application.business_age ?? undefined,
    created_at: application.created_at,
  }, {
    id: application.id,
    client_id: application.id,
    amount: application.requested_amount,
    duration_months: application.duration_months ?? undefined,
    purpose: application.purpose,
    status: 'pending',
    created_at: application.created_at,
  }, documents.map(document => document.document_type))

  return {
    id: `application-${application.id}`,
    request_id: application.id,
    score: result.score,
    risk_level: result.riskLevel,
    confidence: result.confidence,
    recommendation: result.recommendation,
    explanation: result.explanation,
    missing_documents: result.missingDocuments,
    score_details: result.details,
    created_at: new Date().toISOString(),
  }
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
