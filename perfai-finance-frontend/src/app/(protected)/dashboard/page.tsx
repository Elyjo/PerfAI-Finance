
"use client"

import { useCallback, useEffect, useState } from "react"
import AiCreditInsights from "@/components/dashboard/AiCreditInsights"
import RiskTrendChart from "@/components/dashboard/RiskTrendChart"
import SmartAlertsCard from "@/components/dashboard/SmartAlertsCard"
import KpiCard from "@/components/shared/KpiCard"
import { getDashboardStats, DashboardStats } from "@/services/dashboardService"
import { Users, CreditCard, ShieldAlert, TrendingUp } from "lucide-react"
import RequestError from "@/components/shared/RequestError"
import { getRequestErrorMessage } from "@/utils/formatters"


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalCreditRequests: 0,
    highRiskCount: 0,
    approvalRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(() => {
    setLoading(true)
    setError(null)
    getDashboardStats()
      .then(data => {
        setStats(data)
      })
      .catch(err => setError(getRequestErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    void Promise.resolve().then(loadStats)
  }, [loadStats])

  return (
    <section
      className="
        min-h-screen
        px-4
        py-6
        sm:px-6
        lg:px-12
        lg:py-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
            text-3xl
            font-bold
            text-white
            sm:text-4xl
            "
          >
            Tableau de bord
          </h1>

          <p
            className="
              mt-3
              text-white/60
            "
          >
            Vue globale des demandes de crédit, risques et analyses IA.
          </p>
        </div>

      </div>

      {error && <RequestError message={error} onRetry={loadStats} />}

      {/* KPI Cards */}
      <div
        className="
          mt-8
          grid
          gap-6
          md:grid-cols-4
        "
      >
        <KpiCard 
          title="Clients analysés" 
          value={loading ? "..." : stats.totalClients.toLocaleString()} 
          icon={Users} 
        />

        <KpiCard 
          title="Demandes de crédit" 
          value={loading ? "..." : stats.totalCreditRequests.toLocaleString()} 
          icon={CreditCard} 
        />

        <KpiCard 
          title="Risque élevé" 
          value={loading ? "..." : stats.highRiskCount.toLocaleString()} 
          icon={ShieldAlert} 
        />

        <KpiCard 
          title="Taux d'approbation" 
          value={loading ? "..." : `${stats.approvalRate}%`} 
          icon={TrendingUp} 
        />
      </div>

      {/* Charts & Insights */}
      <div
        className="
          mt-8
          grid
          gap-6
          lg:grid-cols-[2fr_1fr]
        "
      >
        <RiskTrendChart />

        <div
          className="
            flex
            flex-col
            gap-6
          "
        >
          <AiCreditInsights />

          <SmartAlertsCard />
        </div>
      </div>
    </section>
  )
}
