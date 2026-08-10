"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from '@/services/authService';
import { supabase } from '@/lib/supabase';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const error = connectionError ?? searchParams.get('error');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard')
    })
  }, [router])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'access_denied':
        return "Vous avez annulé la connexion. Veuillez réessayer.";
      case 'Connexion annulée':
        return "Vous avez annulé la connexion. Veuillez réessayer.";
      case 'Délai de connexion dépassé':
        return "La connexion a pris trop de temps. Veuillez réessayer.";
      case 'Erreur de connexion':
        return "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
      default:
        return error;
    }
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        overflow-hidden
        bg-[#020617]
        px-6
      "
    >
      {/* Main glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-150
          w-150
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#0B63C7]/40
          blur-[140px]
          animate-pulse-soft
        "
      />

      {/* Secondary lights */}
      <div
        className="
          absolute
          -left-40
          top-20
          h-80
          w-80
          rounded-full
          bg-blue-500/20
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          -right-40
          bottom-20
          h-80
          w-80
          rounded-full
          bg-[#0B63C7]/30
          blur-[120px]
        "
      />

      {/* Auth Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-[#0B63C7]/20
          p-8
          shadow-2xl
          shadow-blue-950/50
          backdrop-blur-xl
        "
      >
        {/* Header */}
        <div className="text-left">
          <h1
            className="
              text-xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Perf
            <span className="text-[#0B63C7]">AI</span> Finance
          </h1>

          <h2
            className="
              mt-8
              text-2xl
              font-bold
              text-white
            "
          >
            Se connecter à PerfAI Finance
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-relaxed
              text-white/70
            "
          >
            Accédez à une plateforme intelligente pour analyser les demandes de
            crédit et améliorer vos décisions financières.
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mt-5 p-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-3">
            <span className="text-red-400 text-lg shrink-0">⚠️</span>
            <div>
              <p className="text-red-300 text-sm font-medium">Échec de connexion</p>
              <p className="text-red-400/80 text-xs mt-1">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>
        )}

        {/* Google Button */}
        <button
          onClick={() => {
            setConnectionError(null)
            signInWithGoogle().catch(() => setConnectionError('Erreur de connexion'))
          }}
          className="
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            border
            border-white/20
            bg-white/10
            px-4
            py-3
            font-semibold
            text-white
            backdrop-blur-sm
            transition
            hover:bg-white/15
            cursor-pointer
          "
        >
          {/* Google Logo */}
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M21.35 12.23c0-.78-.07-1.54-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42z"
            />
            <path
              fill="#34A853"
              d="M12 22c2.64 0 4.86-.87 6.48-2.35l-3.14-2.45c-.87.58-1.98.92-3.34.92-2.56 0-4.73-1.73-5.51-4.06H3.25v2.52A9.79 9.79 0 0 0 12 22z"
            />
            <path
              fill="#FBBC05"
              d="M6.49 14.06A5.9 5.9 0 0 1 6.18 12c0-.71.12-1.4.31-2.06V7.42H3.25A10 10 0 0 0 2 12c0 1.61.39 3.14 1.25 4.58l3.24-2.52z"
            />
            <path
              fill="#EA4335"
              d="M12 5.88c1.44 0 2.73.5 3.75 1.48l2.8-2.8C16.86 2.99 14.64 2 12 2a9.79 9.79 0 0 0-8.75 5.42l3.24 2.52C7.27 7.61 9.44 5.88 12 5.88z"
            />
          </svg>
          Continuer avec Google
        </button>

        {/* Legal */}
        <p
          className="
            mt-10
            text-left
            text-xs
            leading-relaxed
            text-white/60
          "
        >
          En continuant, vous acceptez les conditions d&apos;utilisation de PerfAI
          Finance.
        </p>
      </div>

      {/* Back link */}
      <div
        className="
          relative
          z-10
          mt-6
          flex
          w-full
          max-w-md
          items-center
          justify-between
        "
      >
        <Link
          href="/"
          className="
            text-sm
            text-white/60
            transition
            hover:text-white
          "
        >
          ← Retour à l&apos;accueil
        </Link>

        <span
          className="
            text-xs
            text-white/40
          "
        >
          Financial intelligence · AI-powered
        </span>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#020617]">
        <p className="text-white">Chargement...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
