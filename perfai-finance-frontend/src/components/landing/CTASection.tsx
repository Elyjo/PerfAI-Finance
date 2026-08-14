import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function CTASection() {
  return <section className="bg-[#020617] px-6 py-24"><div className="mx-auto max-w-5xl rounded-3xl border border-[#0B63C7]/30 bg-[#0B63C7]/10 px-6 py-16 text-center shadow-2xl shadow-[#0B63C7]/10 sm:px-12"><h2 className="text-3xl font-bold text-white sm:text-4xl">Prenez des décisions de crédit plus éclairées.</h2><p className="mx-auto mt-5 max-w-2xl text-white/60">Accédez à votre espace PerfAI Finance et pilotez chaque dossier avec confiance.</p><Link href={ROUTES.LOGIN} className="mx-auto mt-9 inline-flex items-center gap-2 rounded-xl bg-[#0B63C7] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0954a8]">Accéder à la plateforme <ArrowRight size={17} /></Link></div></section>
}
