import { XCircle, Clock, AlertTriangle, BarChart2 } from 'lucide-react'

const problems = [
  {
    icon: XCircle,
    title: 'Refus injustifiés',
    description: 'Des clients fiables sont refusés faute de données formelles dans les systèmes classiques.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    icon: Clock,
    title: 'Analyse trop lente',
    description: 'Les processus manuels ralentissent les décisions et font perdre des opportunités.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  {
    icon: AlertTriangle,
    title: 'Risques impayés',
    description: 'Des crédits risqués sont accordés par manque d\'outils d\'analyse fiables.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
  },
  {
    icon: BarChart2,
    title: 'Données inexploitées',
    description: 'Les données clients existent mais restent sous-exploitées sans outil d\'analyse adapté.',
    color: 'text-[#4A9FFF]',
    bg: 'bg-[#0B63C7]/10',
    border: 'border-[#0B63C7]/20',
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-[#020617] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0B63C7]">Le problème</p>
          <h2 className="mt-4 text-4xl font-bold text-white">
            Pourquoi les décisions de crédit sont difficiles ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Dans le secteur du microcrédit, beaucoup de demandeurs n&apos;ont pas d&apos;historique bancaire formel. Les institutions font face à des défis majeurs.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {problems.map(p => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className={`rounded-2xl border ${p.border} ${p.bg} p-6 transition hover:-translate-y-1`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5`}>
                  <Icon size={22} className={p.color} />
                </div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
