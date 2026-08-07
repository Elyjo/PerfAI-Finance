import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function Footer() {
  return <footer className="border-t border-white/10 bg-[#020617] px-6 py-8"><div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold text-white">Perf<span className="text-[#0B63C7]">AI</span> Finance</p><nav className="flex gap-5"><a href="#features" className="transition hover:text-white">Fonctionnalités</a><a href="#solution" className="transition hover:text-white">Solution</a><Link href={ROUTES.LOGIN} className="transition hover:text-white">Connexion</Link></nav><p>© {new Date().getFullYear()} PerfAI Finance</p></div></footer>
}
