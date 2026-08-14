import { describe, expect, it } from 'vitest'
import { calculateScore } from './scoringEngine'
import type { Client } from '@/types/client'
import type { CreditRequest } from '@/types/credit'

const client: Client = {
  id: 'client-1',
  full_name: 'Awa Diop',
  monthly_income: 300_000,
  business_age: 5,
  created_at: '2026-01-01T00:00:00.000Z',
}

const request = (overrides: Partial<CreditRequest> = {}): CreditRequest => ({
  id: 'request-1',
  client_id: client.id,
  amount: 500_000,
  duration_months: 12,
  status: 'pending',
  created_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('calculateScore', () => {
  it('classe un dossier soutenable en risque faible', () => {
    const result = calculateScore(client, request())

    expect(result.score).toBeGreaterThanOrEqual(70)
    expect(result.riskLevel).toBe('Faible')
  })

  it('augmente la confiance lorsque les justificatifs essentiels sont présents', () => {
    const withoutDocuments = calculateScore(client, request())
    const withDocuments = calculateScore(client, request(), ['identity', 'address_proof', 'income_proof', 'bank_statement'])

    expect(withDocuments.confidence).toBeGreaterThan(withoutDocuments.confidence)
    expect(withDocuments.missingDocuments).toEqual([])
  })

  it('signale les justificatifs manquants sans empêcher une pré-analyse', () => {
    const result = calculateScore(client, request(), ['identity'])

    expect(result.missingDocuments).toContain('bank_statement')
    expect(result.confidence).toBeLessThan(100)
  })

  it('pénalise un montant trop élevé au regard des revenus', () => {
    const result = calculateScore(client, request({ amount: 8_000_000 }))

    expect(result.score).toBeLessThan(45)
    expect(result.riskLevel).toBe('Élevé')
  })

  it('refuse une durée ou un montant invalide', () => {
    expect(() => calculateScore(client, request({ amount: 0 }))).toThrow('montant')
    expect(() => calculateScore(client, request({ duration_months: 0 }))).toThrow('durée')
  })
})
