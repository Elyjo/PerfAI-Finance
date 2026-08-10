"use client"

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Vérifie d'abord s'il y a une erreur dans l'URL (annulation Google)
    const error = searchParams.get('error')
    if (error) {
      router.replace('/login?error=Connexion annulée')
      return
    }

    // Vérifie la session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Erreur session:', error.message)
        router.replace('/login?error=Erreur de connexion')
        return
      }
      
      if (session) {
        router.replace('/dashboard')
      } else {
        router.replace('/login?error=Erreur de connexion')
      }
    })

    // Écoute le changement d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, searchParams])

  return null
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackContent />
    </Suspense>
  )
}
