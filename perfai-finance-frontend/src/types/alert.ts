export type Alert = {
  id: string
  client_id: string
  type: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  created_at: string
}

export type CreateAlertInput = Omit<Alert, 'id' | 'created_at'>