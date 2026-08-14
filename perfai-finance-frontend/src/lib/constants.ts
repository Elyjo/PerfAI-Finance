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
  PUBLIC_CREDIT_APPLICATION: '/demande-credit',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  CREDIT_REQUESTS: '/credit-requests',
  CREDIT_APPLICATIONS: '/credit-applications',
  RISK_ANALYSIS: '/risk-analysis',
} as const
