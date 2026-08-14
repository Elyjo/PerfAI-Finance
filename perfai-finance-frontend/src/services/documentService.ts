import { supabase } from '@/lib/supabase'
import type { ClientDocument, DocumentType } from '@/types/document'

export const DOCUMENT_BUCKET = 'credit-documents'
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_')

export const validateDocumentFile = (file: File) => {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error('Formats acceptés : PDF, JPEG ou PNG.')
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error('Chaque document doit faire au maximum 10 Mo.')
  }
}

export const getClientDocuments = async (clientId: string): Promise<ClientDocument[]> => {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as ClientDocument[]
}

export const uploadClientDocument = async ({
  clientId,
  creditRequestId,
  documentType,
  file,
  consentConfirmed,
}: {
  clientId: string
  creditRequestId?: string
  documentType: DocumentType
  file: File
  consentConfirmed: boolean
}): Promise<ClientDocument> => {
  if (!consentConfirmed) throw new Error('Le consentement du client doit être confirmé avant le dépôt.')
  validateDocumentFile(file)

  const storagePath = `${clientId}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`
  const { error: uploadError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error(uploadError.message)

  const { data, error } = await supabase
    .from('client_documents')
    .insert({
      client_id: clientId,
      credit_request_id: creditRequestId ?? null,
      document_type: documentType,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      consent_confirmed: true,
    })
    .select('*')
    .single()

  if (error) {
    await supabase.storage.from(DOCUMENT_BUCKET).remove([storagePath])
    throw new Error(error.message)
  }
  return data as ClientDocument
}

export const getDocumentSignedUrl = async (storagePath: string): Promise<string> => {
  const { data, error } = await supabase.storage.from(DOCUMENT_BUCKET).createSignedUrl(storagePath, 60)
  if (error) throw new Error(error.message)
  return data.signedUrl
}

export const deleteClientDocument = async (document: ClientDocument): Promise<void> => {
  const { error } = await supabase.from('client_documents').delete().eq('id', document.id)
  if (error) throw new Error(error.message)
  const { error: storageError } = await supabase.storage.from(DOCUMENT_BUCKET).remove([document.storage_path])
  if (storageError) throw new Error(storageError.message)
}
