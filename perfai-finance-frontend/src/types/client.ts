export type Client = {
  id: string
  full_name: string
  phone?: string
  activity?: string
  monthly_income?: number
  business_age?: number
  location?: string
  created_by?: string
  created_at: string
}

export type CreateClientInput = Omit<Client, 'id' | 'created_at'>
export type UpdateClientInput = Partial<Omit<Client, 'id' | 'created_at' | 'created_by'>>