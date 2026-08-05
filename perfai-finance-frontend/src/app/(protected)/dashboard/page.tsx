import AiCreditInsights from "@/components/dashboard/AiCreditInsights";
import RiskTrendChart from "@/components/dashboard/RiskTrendChart";
import SmartAlertsCard from "@/components/dashboard/SmartAlertsCard";
import KpiCard from "@/components/shared/KpiCard";

import { Users, CreditCard, ShieldAlert, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <section
      className="
        min-h-screen
        px-12
        py-10
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-4xl
              font-bold
              text-white
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

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#0B63C7]
            px-5
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#0954a8]
            cursor-pointer
          "
        >
          <span className="text-lg">+</span>
          Nouvelle demande
        </button>
      </div>

      {/* KPI Cards */}

      <div
        className="
          mt-8
          grid
          gap-6
          md:grid-cols-4
        "
      >
        <KpiCard title="Clients analysés" value="1 248" icon={Users} />

        <KpiCard title="Demandes de crédit" value="186" icon={CreditCard} />

        <KpiCard title="Risque élevé" value="24" icon={ShieldAlert} />

        <KpiCard title="Taux d'approbation" value="82%" icon={TrendingUp} />
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
  );
}
