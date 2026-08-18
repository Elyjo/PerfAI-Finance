import { NextResponse } from 'next/server'

type AlertInput = { type: string; severity: 'info' | 'warning' | 'critical'; message: string; createdAt: string }
type Triage = { priority: 'critique' | 'haute' | 'normale'; summary: string; actions: string[]; anomalies: string[] }

const fallbackTriage = (alerts: AlertInput[]): Triage => {
  const critical = alerts.filter(alert => alert.severity === 'critical')
  const warnings = alerts.filter(alert => alert.severity === 'warning')
  const actions = [
    ...(critical.length ? ['Traiter les dossiers à risque critique avant toute décision.'] : []),
    ...(alerts.some(alert => alert.type === 'missing_documents') ? ['Demander et contrôler les justificatifs essentiels manquants.'] : []),
    ...(alerts.some(alert => alert.type === 'low_confidence') ? ['Compléter les données et effectuer une vérification manuelle renforcée.'] : []),
    ...(warnings.length && !critical.length ? ['Examiner les points d’attention avant le comité de crédit.'] : []),
  ].slice(0, 3)
  return { priority: critical.length ? 'critique' : warnings.length ? 'haute' : 'normale', summary: `${alerts.length} alerte(s) récente(s) à examiner, dont ${critical.length} critique(s) et ${warnings.length} avertissement(s).`, actions: actions.length ? actions : ['Poursuivre le suivi des alertes et documenter toute décision.'], anomalies: alerts.filter(alert => alert.type === 'missing_documents' || alert.type === 'low_confidence' || alert.severity === 'critical').map(alert => alert.message).slice(0, 3) }
}

const parseTriage = (value: string): Triage | null => {
  try {
    const cleaned = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const parsed = JSON.parse(cleaned) as Partial<Triage>
    if (!['critique', 'haute', 'normale'].includes(parsed.priority ?? '') || typeof parsed.summary !== 'string' || !Array.isArray(parsed.actions) || !Array.isArray(parsed.anomalies)) return null
    return { priority: parsed.priority as Triage['priority'], summary: parsed.summary, actions: parsed.actions.filter((item): item is string => typeof item === 'string').slice(0, 3), anomalies: parsed.anomalies.filter((item): item is string => typeof item === 'string').slice(0, 3) }
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { alerts?: AlertInput[] }
    const alerts = body.alerts?.slice(0, 12)
    if (!alerts?.length) return NextResponse.json({ error: 'Aucune alerte à analyser.' }, { status: 400 })
    if (!alerts.every(alert => typeof alert.type === 'string' && typeof alert.message === 'string' && ['info', 'warning', 'critical'].includes(alert.severity))) return NextResponse.json({ error: 'Format d’alerte invalide.' }, { status: 400 })
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'L’assistant IA n’est pas configuré.' }, { status: 503 })
    const prompt = `Tu aides un agent de microfinance à trier des alertes. Ne prends aucune décision de crédit, n’invente aucune information et ne réécris pas les alertes comme des faits nouveaux. Classe seulement les alertes fournies et propose des actions de vérification concrètes.

Alertes: ${JSON.stringify(alerts)}

Réponds uniquement avec ce JSON valide: {"priority":"critique|haute|normale","summary":"...","actions":["..."],"anomalies":["..."]}. Maximum 3 actions et 3 anomalies. Utilise le français.`
    const model = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash'
    const askGemini = async (instruction: string) => {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: instruction }] }], generationConfig: { temperature: 0.1, maxOutputTokens: 700, responseMimeType: 'application/json' } }) })
      if (!response.ok) return null
      const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
      return payload.candidates?.[0]?.content?.parts?.map(part => part.text ?? '').join('').trim() ?? null
    }
    let triage = parseTriage(await askGemini(prompt) ?? '')
    if (!triage) {
      const retryPrompt = `${prompt}\nIMPORTANT : réponds sur une seule ligne, sans markdown, avec un JSON syntaxiquement valide. Les valeurs doivent être courtes.`
      triage = parseTriage(await askGemini(retryPrompt) ?? '')
    }
    if (!triage) return NextResponse.json({ triage: fallbackTriage(alerts), fallback: true })
    return NextResponse.json({ triage, fallback: false })
  } catch (error) {
    console.error('Alert triage error:', error)
    return NextResponse.json({ error: 'Impossible de trier les alertes pour le moment.' }, { status: 500 })
  }
}
