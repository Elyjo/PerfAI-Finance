import { supabase } from '@/lib/supabase'
import type { ApplicationStatus, CreditApplication, CreditApplicationDocument } from '@/types/application'

export const getCreditApplications = async (): Promise<CreditApplication[]> => {
  const { data, error } = await supabase
    .from('credit_applications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as CreditApplication[]
}

export const getCreditApplicationDocuments = async (applicationId: string): Promise<CreditApplicationDocument[]> => {
  const { data, error } = await supabase
    .from('credit_application_documents')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as CreditApplicationDocument[]
}

export const getApplicationDocumentUrl = async (storagePath: string): Promise<string> => {
  const { data, error } = await supabase.storage.from('credit-documents').createSignedUrl(storagePath, 60)
  if (error) throw new Error(error.message)
  return data.signedUrl
}

export const reviewCreditApplication = async (
  id: string,
  status: Exclude<ApplicationStatus, 'submitted'>,
  reviewerNote?: string,
) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Votre session a expiré. Veuillez vous reconnecter.')

  const { data, error } = await supabase
    .from('credit_applications')
    .update({ status, reviewer_note: reviewerNote || null, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as CreditApplication
}
