'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.LOGIN)
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-sm text-white/60">
        Vérification de votre session…
      </div>
    )
  }

  return children
}
