'use client'

import { useCallback, useState } from 'react'
import { RiskAnalysis } from '@/types/analysis'
import { analyzeCreditRequest, getRiskAnalysis } from '@/services/riskService'
import { generateRiskAlerts } from '@/services/alertService'
import { getRequestErrorMessage } from '@/utils/formatters'

export function useRiskAnalysis() {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (requestId: string, clientId: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeCreditRequest(requestId)
      await generateRiskAlerts(clientId, result.risk_level, result.score)
      setAnalysis(result)
      return result
    } catch (error) {
      setError(getRequestErrorMessage(error))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAnalysis = useCallback(async (requestId: string) => {
    setLoading(true)
    try {
      const result = await getRiskAnalysis(requestId)
      setAnalysis(result)
      return result
    } catch (error) {
      setError(getRequestErrorMessage(error))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { analysis, loading, error, analyze, fetchAnalysis }
}
