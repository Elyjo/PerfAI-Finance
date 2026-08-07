export const APP_NAME = 'PerfAI Finance'

export const RISK_LEVELS = {
  FAIBLE: 'Faible',
  MOYEN: 'Moyen',
  ELEVE: 'Élevé',
} as const

export const CREDIT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const ALERT_SEVERITIES = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  CREDIT_REQUESTS: '/credit-requests',
  RISK_ANALYSIS: '/risk-analysis',
} as const
