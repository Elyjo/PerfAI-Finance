import { BrainCircuit, ChartNoAxesCombined, ShieldCheck } from 'lucide-react'

const features = [
  { icon: BrainCircuit, title: 'Scoring intelligent', text: 'Évaluez chaque dossier selon des critères financiers et opérationnels cohérents.' },
  { icon: ChartNoAxesCombined, title: 'Vision claire', text: 'Suivez votre portefeuille, les tendances et les décisions à prendre en un coup d’œil.' },
  { icon: ShieldCheck, title: 'Décisions explicables', text: 'Chaque recommandation est accompagnée d’indicateurs compréhensibles par vos équipes.' },
]

export default function FeaturesSection() {
  return <section id="features" className="bg-[#061126] px-6 py-24"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-widest text-[#4A9FFF]">La plateforme</p><h2 className="mt-4 text-4xl font-bold tracking-tight text-white">Les bons signaux, au bon moment.</h2><p className="mt-4 leading-relaxed text-white/60">PerfAI Finance donne aux agents une base solide pour analyser, documenter et suivre leurs décisions de crédit.</p></div><div className="mt-12 grid gap-6 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-[#0B63C7]/40 hover:bg-[#0B63C7]/[0.06]"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B63C7]/15 text-[#4A9FFF]"><Icon size={23} /></div><h3 className="mt-6 text-lg font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p></article>)}</div></div></section>
}
