import { Client } from '@/types/client'
import { CreditRequest } from '@/types/credit'

export type RiskLevel = 'Faible' | 'Moyen' | 'Élevé'

export type ScoringResult = {
  score: number
  riskLevel: RiskLevel
  recommendation: string
  explanation: string
  details: {
    stabilityPoints: number
    experiencePoints: number
    incomePoints: number
    debtPenalty: number
    amountRatioPoints: number
  }
}

/**
 * Calcule le score de risque pour une demande de crédit
 * Score sur 100 — Plus c'est élevé, moins c'est risqué
 */
export const calculateScore = (client: Client, request: CreditRequest): ScoringResult => {
  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    throw new Error('Le montant de la demande doit être supérieur à zéro.')
  }
  if (request.duration_months !== undefined && (!Number.isFinite(request.duration_months) || request.duration_months <= 0)) {
    throw new Error('La durée de la demande doit être supérieure à zéro.')
  }

  let score = 50
  const details = {
    stabilityPoints: 0,
    experiencePoints: 0,
    incomePoints: 0,
    debtPenalty: 0,
    amountRatioPoints: 0
  }

  // 1. Stabilité de l'activité
  if (client.business_age && client.business_age >= 5) {
    details.stabilityPoints = 20
    score += 20
  } else if (client.business_age && client.business_age >= 3) {
    details.stabilityPoints = 15
    score += 15
  } else if (client.business_age && client.business_age >= 1) {
    details.stabilityPoints = 8
    score += 8
  }

  // 2. Ancienneté / expérience
  if (client.business_age && client.business_age >= 5) {
    details.experiencePoints = 15
    score += 15
  } else if (client.business_age && client.business_age >= 3) {
    details.experiencePoints = 10
    score += 10
  } else if (client.business_age && client.business_age >= 1) {
    details.experiencePoints = 5
    score += 5
  }

  // 3. Ratio revenus / mensualité
  if (client.monthly_income && request.amount) {
    const monthlyPayment = request.amount / (request.duration_months || 12)
    const ratio = monthlyPayment / client.monthly_income

    if (ratio < 0.3) {
      details.incomePoints = 20
      score += 20
    } else if (ratio < 0.5) {
      details.incomePoints = 10
      score += 10
    } else if (ratio < 0.7) {
      details.incomePoints = 5
      score += 5
    } else {
      details.incomePoints = -10
      score -= 10
    }
  }

  // 4. Pénalité si montant > 12x revenus mensuels
  if (client.monthly_income && request.amount && request.amount > client.monthly_income * 12) {
    details.debtPenalty = -20
    score -= 20
  }

  // 5. Ratio montant/revenu annuel
  if (client.monthly_income && request.amount) {
    const annualIncome = client.monthly_income * 12
    const ratio2 = request.amount / annualIncome
    if (ratio2 > 1.5) {
      details.amountRatioPoints = -15
      score -= 15
    } else if (ratio2 > 1) {
      details.amountRatioPoints = -5
      score -= 5
    } else {
      details.amountRatioPoints = 5
      score += 5
    }
  }

  // Limiter le score entre 0 et 100
  score = Math.max(0, Math.min(100, Math.round(score)))

  // Déterminer le niveau de risque
  let riskLevel: RiskLevel
  if (score >= 70) {
    riskLevel = 'Faible'
  } else if (score >= 45) {
    riskLevel = 'Moyen'
  } else {
    riskLevel = 'Élevé'
  }

  // Générer la recommandation
  let recommendation: string
  if (riskLevel === 'Faible') {
    recommendation = 'CREDIT RECOMMANDE'
  } else if (riskLevel === 'Moyen') {
    recommendation = 'CREDIT A EVALUER'
  } else {
    recommendation = 'CREDIT NON RECOMMANDE'
  }

  // Générer l'explication
  const explanation = generateExplanation(client, request, score, riskLevel)

  return { score, riskLevel, recommendation, explanation, details }
}

/**
 * IA Explicative — Génère une explication en langage naturel
 */
const generateExplanation = (
  client: Client,
  request: CreditRequest,
  score: number,
  riskLevel: RiskLevel
): string => {
  const parts: string[] = []

  // Analyse de l'activité
  if (client.business_age && client.business_age > 3) {
    parts.push(`Activite stable depuis ${client.business_age} ans`)
  } else if (client.business_age && client.business_age > 1) {
    parts.push(`Activite recente (${client.business_age} an(s))`)
  } else {
    parts.push(`Activite trop recente`)
  }

  // Analyse des revenus
  if (client.monthly_income) {
    parts.push(`Revenus mensuels de ${client.monthly_income.toLocaleString()} FCFA`)
  }

  // Ratio d'endettement
  if (client.monthly_income && request.amount) {
    const monthlyPayment = request.amount / (request.duration_months || 12)
    const ratio = Math.round((monthlyPayment / client.monthly_income) * 100)
    if (ratio < 30) {
      parts.push(`Mensualite (${ratio}% des revenus) tres soutenable`)
    } else if (ratio < 50) {
      parts.push(`Mensualite (${ratio}% des revenus) acceptable`)
    } else {
      parts.push(`Mensualite (${ratio}% des revenus) trop elevee`)
    }
  }

  // Conclusion
  parts.push(`Score final : ${score}/100 - Niveau de risque : ${riskLevel}`)

  return parts.join(' | ')
}
