export type RiskAnalysis = {
  id: string
  request_id: string
  score: number
  risk_level: 'Faible' | 'Moyen' | 'Élevé'
  recommendation?: string
  explanation?: string
  confidence?: number
  missing_documents?: string[]
  score_details?: Record<string, number>
  created_at: string
}
