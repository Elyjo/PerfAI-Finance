import type { DocumentType } from '@/types/document'

export type ApplicationStatus = 'submitted' | 'under_review' | 'approved' | 'rejected'

export type CreditApplication = {
  id: string
  full_name: string
  phone: string
  location?: string | null
  activity?: string | null
  business_age?: number | null
  monthly_income?: number | null
  monthly_expenses?: number | null
  requested_amount: number
  duration_months?: number | null
  purpose: string
  repayment_source?: string | null
  repayment_frequency?: string | null
  collateral_description?: string | null
  consent_confirmed: boolean
  status: ApplicationStatus
  reviewer_note?: string | null
  reviewed_by?: string | null
  reviewed_at?: string | null
  created_at: string
}

export type CreditApplicationDocument = {
  id: string
  application_id: string
  document_type: DocumentType
  file_name: string
  mime_type: string
  file_size: number
  storage_path: string
  created_at: string
}
