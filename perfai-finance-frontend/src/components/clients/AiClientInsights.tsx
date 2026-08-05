import { AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

const insights = [
  {
    icon: AlertTriangle,
    title: "3 clients présentent un risque élevé",
    description:
      "Recommandation : analyser leurs capacités de remboursement avant tout nouveau financement",
    iconStyle: "bg-yellow-400/10 text-yellow-400",
    cardStyle: "bg-yellow-400/5",
  },
  {
    icon: TrendingUp,
    title: "Le portefeuille client progresse de 12% ce mois-ci",
    description:
      "Les profils financés présentent une meilleure stabilité financière",
    iconStyle: "bg-green-400/10 text-green-400",
    cardStyle: "bg-green-400/5",
  },
  {
    icon: ArrowRight,
    title: "Optimisation recommandée",
    description:
      "Proposez un suivi renforcé aux clients avec un score IA inférieur à 60%",
    iconStyle: "bg-[#0B63C7]/10 text-[#0B63C7]",
    cardStyle: "bg-[#0B63C7]/5",
  },
];

export default function AiClientInsights() {
  return (
    <div
      className="
        h-fit
        rounded-2xl
        border
        border-white/10
        bg-white/3
        p-6
        transition
        duration-300
        hover:-translate-y-1
        hover:border-[#0B63C7]/30
        hover:shadow-xl
        hover:shadow-[#0B63C7]/20
      "
    >
      {/* Header */}
      <h3
        className="
          text-lg
          font-semibold
          text-white
        "
      >
        Analyse intelligente
      </h3>

      {/* Insights */}
      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
        "
      >
        {insights.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`
                flex
                gap-4
                rounded-xl
                p-4
                ${item.cardStyle}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${item.iconStyle}
                `}
              >
                <Icon size={20} />
              </div>

              {/* Content */}
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    leading-relaxed
                    text-white
                  "
                >
                  {item.title}
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-relaxed
                    text-white/60
                  "
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
