import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { DOCUMENT_TYPES, type DocumentType } from '@/types/document'

const MAX_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const REQUIRED_DOCUMENT_TYPES: DocumentType[] = ['identity', 'address_proof', 'income_proof', 'bank_statement']

const asOptionalNumber = (value: FormDataEntryValue | null) => {
  if (typeof value !== 'string' || value.trim() === '') return null
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) throw new Error('Les montants et durées doivent être positifs.')
  return number
}

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceRoleKey) return NextResponse.json({ error: 'Le dépôt des demandes n’est pas configuré.' }, { status: 503 })

    const form = await request.formData()
    const fullName = form.get('full_name')
    const phone = form.get('phone')
    const purpose = form.get('purpose')
    const amount = asOptionalNumber(form.get('requested_amount'))
    const consent = form.get('consent_confirmed') === 'on'
    const documentTypes = form.getAll('document_types')
    const files = form.getAll('documents').filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (typeof fullName !== 'string' || !fullName.trim() || typeof phone !== 'string' || !phone.trim() || typeof purpose !== 'string' || !purpose.trim() || !amount || !consent) {
      return NextResponse.json({ error: 'Veuillez renseigner les champs obligatoires et confirmer votre consentement.' }, { status: 400 })
    }
    if (files.length !== documentTypes.length || !documentTypes.every((type): type is DocumentType => typeof type === 'string' && DOCUMENT_TYPES.includes(type as DocumentType))) {
      return NextResponse.json({ error: 'Les documents fournis ne peuvent pas être identifiés.' }, { status: 400 })
    }
    const missingRequiredDocuments = REQUIRED_DOCUMENT_TYPES.filter(type => !documentTypes.includes(type))
    if (missingRequiredDocuments.length) {
      return NextResponse.json({ error: 'Votre dossier doit contenir une pièce d’identité, un justificatif de domicile, un justificatif de revenus et un relevé bancaire.' }, { status: 400 })
    }
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) return NextResponse.json({ error: 'Documents acceptés : PDF, JPEG ou PNG, 10 Mo maximum par fichier.' }, { status: 400 })
    }

    const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data: application, error } = await admin.from('credit_applications').insert({
      full_name: fullName.trim(), phone: phone.trim(), purpose: purpose.trim(), requested_amount: amount,
      location: form.get('location') || null, activity: form.get('activity') || null,
      business_age: asOptionalNumber(form.get('business_age')), monthly_income: asOptionalNumber(form.get('monthly_income')),
      monthly_expenses: asOptionalNumber(form.get('monthly_expenses')), duration_months: asOptionalNumber(form.get('duration_months')),
      repayment_source: form.get('repayment_source') || null, repayment_frequency: form.get('repayment_frequency') || null,
      collateral_description: form.get('collateral_description') || null, consent_confirmed: true,
    }).select('id').single()
    if (error) throw error

    const uploadedPaths: string[] = []
    try {
      for (const [index, file] of files.entries()) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `applications/${application.id}/${crypto.randomUUID()}-${safeName}`
        const { error: uploadError } = await admin.storage.from('credit-documents').upload(path, file, { contentType: file.type, upsert: false })
        if (uploadError) throw uploadError
        uploadedPaths.push(path)
        const { error: documentError } = await admin.from('credit_application_documents').insert({ application_id: application.id, document_type: documentTypes[index], file_name: file.name, mime_type: file.type, file_size: file.size, storage_path: path })
        if (documentError) throw documentError
      }
    } catch (uploadError) {
      if (uploadedPaths.length) await admin.storage.from('credit-documents').remove(uploadedPaths)
      await admin.from('credit_application_documents').delete().eq('application_id', application.id)
      await admin.from('credit_applications').delete().eq('id', application.id)
      throw uploadError
    }
    return NextResponse.json({ id: application.id }, { status: 201 })
  } catch (error) {
    console.error('Public credit application failed:', error)
    return NextResponse.json({ error: 'Votre demande n’a pas pu être envoyée. Veuillez réessayer ou contacter l’agence.' }, { status: 500 })
  }
}
