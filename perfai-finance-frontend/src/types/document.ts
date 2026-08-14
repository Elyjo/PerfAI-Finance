export const DOCUMENT_TYPES = [
  'identity',
  'address_proof',
  'income_proof',
  'bank_statement',
  'business_registration',
  'financial_statement',
  'invoice_or_quote',
  'collateral',
  'other',
] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export type ClientDocument = {
  id: string
  client_id: string
  credit_request_id?: string | null
  document_type: DocumentType
  file_name: string
  mime_type: string
  file_size: number
  storage_path: string
  consent_confirmed: boolean
  uploaded_by?: string | null
  created_at: string
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  identity: 'Pièce d’identité',
  address_proof: 'Justificatif de domicile',
  income_proof: 'Justificatif de revenus',
  bank_statement: 'Relevé bancaire',
  business_registration: 'Document d’activité / NINEA',
  financial_statement: 'États financiers',
  invoice_or_quote: 'Facture, devis ou bon de commande',
  collateral: 'Document de garantie',
  other: 'Autre document',
}
