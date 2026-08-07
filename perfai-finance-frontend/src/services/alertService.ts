import { supabase } from '@/lib/supabase'
import { Alert, CreateAlertInput } from '@/types/alert'

// ============================================
// CREATE — Créer une alerte
// ============================================
export const createAlert = async (alert: CreateAlertInput): Promise<Alert> => {
  const { data, error } = await supabase
    .from('alerts')
    .insert([{
      client_id: alert.client_id,
      type: alert.type,
      message: alert.message,
      severity: alert.severity
    }])
    .select('*')
    .single()

  if (error) {
    console.error('Erreur creation alerte:', error.message)
    throw new Error(error.message)
  }
  return data as Alert
}

// ============================================
// READ — Toutes les alertes
// ============================================
export const getAllAlerts = async (): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur recuperation alertes:', error.message)
    throw new Error(error.message)
  }
  return data as Alert[]
}

// ============================================
// READ — Alertes d'un client
// ============================================
export const getAlertsByClient = async (clientId: string): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur recuperation alertes client:', error.message)
    throw new Error(error.message)
  }
  return data as Alert[]
}

// ============================================
// READ — Alertes par sévérité
// ============================================
export const getAlertsBySeverity = async (severity: 'info' | 'warning' | 'critical'): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('severity', severity)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur recuperation alertes par severite:', error.message)
    throw new Error(error.message)
  }
  return data as Alert[]
}

// ============================================
// READ — Alertes critiques (pour le dashboard)
// ============================================
export const getCriticalAlerts = async (): Promise<Alert[]> => {
  return getAlertsBySeverity('critical')
}

// ============================================
// DELETE — Supprimer une alerte
// ============================================
export const deleteAlert = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression alerte:', error.message)
    throw new Error(error.message)
  }
  return true
}

// ============================================
// DELETE — Supprimer toutes les alertes d'un client
// ============================================
export const deleteAlertsByClient = async (clientId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('client_id', clientId)

  if (error) {
    console.error('Erreur suppression alertes client:', error.message)
    throw new Error(error.message)
  }
  return true
}

// ============================================
// CREATE — Générer des alertes automatiques
// après une analyse de risque
// ============================================
export const generateRiskAlerts = async (clientId: string, riskLevel: string, score: number): Promise<void> => {
  const alerts: CreateAlertInput[] = []

  if (riskLevel === 'Élevé') {
    alerts.push({
      client_id: clientId,
      type: 'risk_high',
      message: `Risque eleve detecte (score: ${score}/100). Verification approfondie recommandee.`,
      severity: 'critical'
    })
  }

  if (riskLevel === 'Moyen') {
    alerts.push({
      client_id: clientId,
      type: 'risk_medium',
      message: `Risque modere (score: ${score}/100). Points d'attention a verifier.`,
      severity: 'warning'
    })
  }

  if (score >= 80) {
    alerts.push({
      client_id: clientId,
      type: 'low_risk_good',
      message: `Bon profil (score: ${score}/100). Credit recommandable.`,
      severity: 'info'
    })
  }

  for (const alert of alerts) {
    await createAlert(alert)
  }
}
