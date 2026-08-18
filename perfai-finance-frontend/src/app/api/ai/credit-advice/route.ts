import { NextResponse } from 'next/server'

type AdviceRequest = {
  score: number
  riskLevel: 'Faible' | 'Moyen' | 'Élevé'
  confidence: number
  amount: number
  durationMonths?: number
  monthlyIncome?: number
  businessAge?: number
  activity?: string
  purpose?: string
  missingDocuments: string[]
}

const isAdviceRequest = (value: unknown): value is AdviceRequest => {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.score === 'number' && typeof item.confidence === 'number' && typeof item.amount === 'number'
    && (item.riskLevel === 'Faible' || item.riskLevel === 'Moyen' || item.riskLevel === 'Élevé')
    && Array.isArray(item.missingDocuments)
}

export async function POST(request: Request) {
  try {
    const input: unknown = await request.json()
    if (!isAdviceRequest(input)) return NextResponse.json({ error: 'Données d’analyse invalides.' }, { status: 400 })
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'L’assistant IA n’est pas configuré. Ajoutez GEMINI_API_KEY côté serveur.' }, { status: 503 })

    const prompt = `Tu es un assistant de pré-instruction pour un agent de microfinance en Afrique de l’Ouest. Tu ne décides jamais seul et tu ne dois inventer aucune donnée. À partir des données anonymisées ci-dessous, fournis un avis prudent et concret en français.

Score déterministe: ${input.score}/95. Niveau de risque: ${input.riskLevel}. Confiance: ${input.confidence} %.
Montant: ${input.amount} FCFA. Durée: ${input.durationMonths ?? 'non renseignée'} mois. Revenu mensuel: ${input.monthlyIncome ?? 'non renseigné'} FCFA. Ancienneté activité: ${input.businessAge ?? 'non renseignée'} an(s). Secteur: ${input.activity ?? 'non renseigné'}. Objet: ${input.purpose ?? 'non renseigné'}. Justificatifs manquants: ${input.missingDocuments.join(', ') || 'aucun'}.

Réponds uniquement avec un JSON valide: {"summary":"...","strengths":["..."],"risks":["..."],"questions":["..."],"recommendation":"..."}. Limite chaque liste à 3 éléments. Ne fais aucune promesse d’octroi, recommande toujours une vérification humaine.`
    const model = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 700, responseMimeType: 'application/json' },
      }),
    })
    if (!response.ok) {
      console.error('Gemini request failed:', response.status)
      return NextResponse.json({ error: 'L’assistant IA est momentanément indisponible.' }, { status: 502 })
    }
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    const text = payload.candidates?.[0]?.content?.parts?.map(part => part.text ?? '').join('').trim()
    if (!text) return NextResponse.json({ error: 'L’assistant IA n’a pas renvoyé de réponse exploitable.' }, { status: 502 })
    const advice = JSON.parse(text) as unknown
    if (!advice || typeof advice !== 'object') throw new Error('Invalid AI response')
    return NextResponse.json({ advice })
  } catch (error) {
    console.error('Credit advice error:', error)
    return NextResponse.json({ error: 'Impossible de générer l’avis IA pour le moment.' }, { status: 500 })
  }
}
