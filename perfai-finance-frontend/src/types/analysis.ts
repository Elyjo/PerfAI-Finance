export type RiskAnalysis = {
  id: string
  request_id: string
  score: number
  risk_level: 'Faible' | 'Moyen' | 'Élevé'
  recommendation?: string
  explanation?: string
  created_at: string
}