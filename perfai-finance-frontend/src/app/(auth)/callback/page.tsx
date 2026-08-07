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
      console.log('❌ Erreur dans l\'URL:', error)
      router.push('/login?error=Connexion annulée')
      return
    }

    // Vérifie la session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Erreur session:', error.message)
        router.push('/login?error=Erreur de connexion')
        return
      }
      
      if (session) {
        console.log('✅ Session trouvée, redirection dashboard')
        router.push('/dashboard')
      } else {
        console.log('⏳ Pas de session, attente du state change...')
      }
    })

    // Écoute le changement d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? 'session OK' : 'pas de session')
      
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#0B63C7] mx-auto mb-4"></div>
        <p className="text-white text-lg">Connexion en cours...</p>
        <p className="text-white/60 text-sm mt-2">Veuillez patienter</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#020617]">
        <p className="text-white">Chargement...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}