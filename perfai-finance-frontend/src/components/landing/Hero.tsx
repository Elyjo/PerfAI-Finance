import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020617] px-6 text-center">
      {/* Glows */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B63C7]/25 blur-[140px]" />
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-500/15 blur-[120px]" />
      <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-[#0B63C7]/20 blur-[120px]" />

      <div className="relative z-10 max-w-4xl">
        {/* Badge */}
        <div className="mb-8 inline-flex max-w-full items-center justify-center gap-2 rounded-2xl border border-[#0B63C7]/30 bg-[#0B63C7]/10 px-4 py-2 text-sm font-medium text-[#4A9FFF] sm:rounded-full">
          <ShieldCheck size={16} className="shrink-0" />
          Plateforme d&apos;intelligence décisionnelle financière
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Analysez les risques.
          <br />
          <span className="text-[#0B63C7]">Décidez mieux.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
          PerfAI Finance transforme les données financières complexes en décisions intelligentes grâce à l&apos;IA — conçu pour les institutions de microfinance et les agents de crédit.
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.LOGIN}
            className="
              flex items-center gap-2 rounded-xl bg-[#0B63C7]
              px-8 py-4 text-base font-semibold text-white
              transition hover:bg-[#0954a8] shadow-lg shadow-[#0B63C7]/30
            "
          >
            Accéder à la plateforme
            <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            className="
              flex items-center gap-2 rounded-xl border border-white/15
              bg-white/5 px-8 py-4 text-base font-medium text-white/80
              transition hover:bg-white/10
            "
          >
            Découvrir les fonctionnalités
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-3 border-t border-white/10 pt-8 sm:mt-16 sm:gap-8 sm:pt-12">
          {[
            { value: '100+', label: 'Profils analysés' },
            { value: '95%', label: 'Précision IA' },
            { value: '3x', label: 'Décisions plus rapides' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
