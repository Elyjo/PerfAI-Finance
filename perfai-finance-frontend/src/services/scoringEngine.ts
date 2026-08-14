import type { Client } from '@/types/client'
import type { CreditRequest } from '@/types/credit'
import type { DocumentType } from '@/types/document'

export type RiskLevel = 'Faible' | 'Moyen' | 'Élevé'

export type ScoringResult = {
  score: number; riskLevel: RiskLevel; confidence: number; recommendation: string; explanation: string; missingDocuments: DocumentType[]
  details: { repaymentCapacity: number; amountToIncome: number; businessStability: number; dataQuality: number; documentCoverage: number }
}

const requiredDocuments: DocumentType[] = ['identity', 'address_proof', 'income_proof', 'bank_statement']
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(value)))

/** Aide explicable à la pré-instruction : la décision finale reste celle de l’agent. */
export const calculateScore = (client: Client, request: CreditRequest, documentTypes: DocumentType[] = []): ScoringResult => {
  if (!Number.isFinite(request.amount) || request.amount <= 0) throw new Error('Le montant de la demande doit être supérieur à zéro.')
  if (request.duration_months !== undefined && (!Number.isFinite(request.duration_months) || request.duration_months <= 0)) throw new Error('La durée de la demande doit être supérieure à zéro.')
  const income = client.monthly_income ?? 0; const duration = request.duration_months ?? 12; const payment = request.amount / duration
  const paymentRatio = income > 0 ? payment / income : null; const annualAmountRatio = income > 0 ? request.amount / (income * 12) : null
  const missingDocuments = requiredDocuments.filter(type => !documentTypes.includes(type))
  const repaymentCapacity = paymentRatio === null ? -18 : paymentRatio <= .25 ? 28 : paymentRatio <= .35 ? 20 : paymentRatio <= .5 ? 8 : paymentRatio <= .65 ? -8 : -25
  const amountToIncome = annualAmountRatio === null ? -12 : annualAmountRatio <= .5 ? 15 : annualAmountRatio <= 1 ? 8 : annualAmountRatio <= 1.5 ? -4 : annualAmountRatio <= 2 ? -12 : -22
  const age = client.business_age ?? 0; const businessStability = age >= 5 ? 15 : age >= 3 ? 10 : age >= 1 ? 4 : -8
  const dataFields = [client.phone, client.location, client.activity, client.monthly_income, client.business_age, request.duration_months, request.purpose]
  const dataQuality = Math.round((dataFields.filter(Boolean).length / dataFields.length) * 10) - 3
  const documentCoverage = documentTypes.length === 0 ? -5 : missingDocuments.length === 0 ? 5 : Math.max(-3, 3 - missingDocuments.length * 2)
  const score = clamp(55 + repaymentCapacity + amountToIncome + businessStability + dataQuality + documentCoverage, 0, 100)
  const confidence = clamp(35 + dataFields.filter(Boolean).length * 5 + (requiredDocuments.length - missingDocuments.length) * 7 + Math.min(documentTypes.length, 6) * 2, 20, 100)
  const riskLevel: RiskLevel = score >= 72 ? 'Faible' : score >= 50 ? 'Moyen' : 'Élevé'
  const recommendation = riskLevel === 'Faible' && confidence >= 70 ? 'CRÉDIT RECOMMANDÉ SOUS RÉSERVE DE VÉRIFICATION' : riskLevel === 'Élevé' ? 'CRÉDIT NON RECOMMANDÉ — RÉEXAMEN MANUEL REQUIS' : 'À ÉVALUER PAR L’AGENT / COMITÉ DE CRÉDIT'
  const capacityText = paymentRatio === null ? 'La capacité de remboursement ne peut pas être calculée faute de revenu mensuel.' : `La mensualité estimée représente ${Math.round(paymentRatio * 100)} % des revenus déclarés.`
  const documentText = missingDocuments.length ? `${missingDocuments.length} justificatif(s) essentiel(s) manquent.` : 'Les justificatifs essentiels sont présents, sous réserve de contrôle par l’agent.'
  return { score, riskLevel, confidence, recommendation, missingDocuments, explanation: `${capacityText} Activité déclarée depuis ${age || 0} an(s). ${documentText} Score ${score}/100, confiance ${confidence} %.`, details: { repaymentCapacity, amountToIncome, businessStability, dataQuality, documentCoverage } }
}
