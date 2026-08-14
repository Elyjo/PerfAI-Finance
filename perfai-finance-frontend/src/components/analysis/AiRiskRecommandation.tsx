import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

const recommendations = [
  {
    icon: AlertTriangle,
    title: "Risque détecté",
    description:
      "Le niveau d'endettement du client est supérieur au seuil recommandé.",
    type: "warning",
  },

  {
    icon: CheckCircle2,
    title: "Profil stable",
    description:
      "Les revenus déclarés montrent une capacité de remboursement acceptable.",
    type: "success",
  },

  {
    icon: Lightbulb,
    title: "Recommandation IA",
    description:
      "Accorder un montant inférieur à la demande initiale afin de réduire le risque.",
    type: "info",
  },
];

const styles = {
  warning: {
    icon: "bg-yellow-400/10 text-yellow-400",
    card: "bg-yellow-400/5",
  },

  success: {
    icon: "bg-green-500/10 text-green-400",
    card: "bg-green-500/5",
  },

  info: {
    icon: "bg-[#0B63C7]/10 text-[#0B63C7]",
    card: "bg-[#0B63C7]/5",
  },
};

export default function AiRiskRecommendation() {
  return (
    <div
      className="
          rounded-2xl
          border
          border-white/10
          bg-white/3
          p-6
          backdrop-blur-xl
          transition
          duration-300
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
        Recommandations IA
      </h3>

      {/* Recommendations */}
      <div
        className="
            mt-6
            flex
            flex-col
            gap-4
          "
      >
        {recommendations.map((item, index) => {
          const Icon = item.icon;
          const style = styles[item.type as keyof typeof styles];

          return (
            <div
              key={index}
              className={`
                  flex
                  gap-4
                  rounded-xl
                  p-4
                  ${style.card}
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
                    ${style.icon}
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
