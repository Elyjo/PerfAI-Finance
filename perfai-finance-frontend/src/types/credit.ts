export type CreditRequest = {
  id: string
  client_id: string
  amount: number
  duration_months?: number
  purpose?: string
  status: 'pending' | 'approved' | 'rejected'
  created_by?: string
  created_at: string
}

export type CreateCreditRequestInput = Omit<CreditRequest, 'id' | 'created_at'>
export type UpdateCreditRequestInput = Partial<Omit<CreditRequest, 'id' | 'created_at' | 'created_by' | 'client_id'>>
