import RiskScore from "@/components/analysis/RiskScore";
import RiskIndicator from "@/components/analysis/RiskIndicator";
import RiskAnalysisResult from "@/components/analysis/RiskAnalysisResult";
import AiRiskRecommendation from "@/components/analysis/AiRiskRecommandation";

export default function RiskAnalysisPage() {
  return (
    <section
      className="
        min-h-screen
        px-12
        py-10
      "
    >
      {/* Header */}
      <div>
        <h1
          className="
            text-4xl
            font-bold
            text-white
          "
        >
          Analyse des risques
        </h1>

        <p
          className="
            mt-3
            text-white/60
          "
        >
          Analyse intelligente des profils clients et évaluation du risque
          financier.
        </p>
      </div>

      {/* Content */}
      <div
        className="
          mt-8
          grid
          gap-6
          lg:grid-cols-[2fr_1fr]
        "
      >
        {/* Left */}
        <div
          className="
            flex
            flex-col
            gap-6
          "
        >
          <RiskAnalysisResult />

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/3
              p-6
            "
          >
            <h2
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Indicateurs financiers
            </h2>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-4
              "
            >
              <RiskIndicator
                title="Historique de remboursement"
                value="Paiements réguliers sur les 12 derniers mois"
                status="Bon"
              />

              <RiskIndicator
                title="Niveau d'endettement"
                value="Taux d'endettement supérieur à la moyenne"
                status="Moyen"
              />

              <RiskIndicator
                title="Stabilité des revenus"
                value="Revenus constants détectés"
                status="Bon"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          className="
            flex
            flex-col
            gap-6
          "
        >
          <RiskScore score={72} level="Moyen" />

          <AiRiskRecommendation />
        </div>
      </div>
    </section>
  );
}
