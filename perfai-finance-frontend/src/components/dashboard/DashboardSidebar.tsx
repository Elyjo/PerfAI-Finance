'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ClipboardCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

const menuItems = [
  { label: 'Tableau de bord', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: 'Clients', icon: Users, href: ROUTES.CLIENTS },
  { label: 'Demandes de crédit', icon: CreditCard, href: ROUTES.CREDIT_REQUESTS },
  { label: 'Pré-demandes clients', icon: ClipboardCheck, href: ROUTES.CREDIT_APPLICATIONS },
  { label: 'Analyse des risques', icon: ShieldAlert, href: ROUTES.RISK_ANALYSIS },
]

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      router.push(ROUTES.LOGIN)
    }
  }

  return (
    <aside
      className={`
        fixed bottom-0 left-0 z-40
        h-16 w-full
        border-t border-white/10
        bg-[#020617]/60 backdrop-blur-xl
        transition-all duration-300
        flex flex-col
        lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-64 lg:border-r lg:border-t-0
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
      `}
    >
      <div className="flex h-full items-center px-2 py-2 lg:flex-col lg:items-stretch lg:px-4 lg:py-6">
        {/* Toggle */}
        <div className={`hidden lg:flex ${collapsed ? 'justify-center' : 'justify-end'} mb-6`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/10 bg-white/5 text-white/70
              transition hover:bg-[#0B63C7]/10 hover:text-white cursor-pointer
            "
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 items-center justify-around gap-1 lg:flex-none lg:flex-col lg:items-stretch lg:justify-start lg:gap-2">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center
                  justify-center ${collapsed ? 'lg:justify-center' : 'lg:justify-start lg:gap-3'}
                  rounded-xl px-3 py-3 text-sm font-medium transition lg:px-4
                  ${isActive
                    ? 'border border-[#0B63C7]/30 bg-[#0B63C7]/15 shadow-lg shadow-[#0B63C7]/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }
                `}
                title={item.label}
              >
                <Icon size={20} className={isActive ? 'text-[#0B63C7]' : 'text-white/50'} />
                {!collapsed && <span className="hidden lg:inline">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto hidden flex-col gap-3 lg:flex">
          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className={`
              flex items-center
              ${collapsed ? 'justify-center' : 'gap-3'}
              rounded-xl px-4 py-3 text-sm font-medium
              text-white/50 transition
              hover:bg-red-500/10 hover:text-red-400 cursor-pointer
            `}
            title={collapsed ? 'Déconnexion' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && 'Déconnexion'}
          </button>

          {/* Info card */}
          {!collapsed && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                PerfAI Finance Intelligence
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#0B63C7]" />
                <span className="text-sm font-medium text-white">Analyse IA activée</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/50">
                Surveillance intelligente des crédits, risques et comportements financiers.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
