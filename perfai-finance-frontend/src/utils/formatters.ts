export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA'
}

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

export const formatRelativeTime = (dateString: string): string => {
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days === 1) return 'Hier'
  return `Il y a ${days} jours`
}

export const formatScore = (score: number): string => `${score}/100`

export const formatPercent = (value: number): string => `${value}%`

export const getRequestErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  const offline = typeof navigator !== 'undefined' && !navigator.onLine
  const networkError = offline || /failed to fetch|network|timeout|internet|connexion/.test(message)

  if (networkError) return 'Erreur de connexion. Vérifiez votre connexion internet, puis réessayez.'
  return 'Une erreur est survenue lors du chargement. Réessayez dans quelques instants.'
}
