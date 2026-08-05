import { AlertCircle } from "lucide-react";

const alerts = [
  {
    message:
      "5 demandes de crédit présentent un risque élevé de défaut de paiement",
    time: "Il y a 45 min",
    iconStyle: "bg-red-500/10 text-red-500",
    cardStyle: "bg-red-500/5",
  },
  {
    message:
      "Une augmentation inhabituelle des demandes a été détectée cette semaine",
    time: "Il y a 2h",
    iconStyle: "bg-yellow-400/10 text-yellow-400",
    cardStyle: "bg-yellow-400/5",
  },
];

export default function SmartAlertsCard() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-6
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
        Alertes intelligentes
      </h3>

      {/* Alerts */}
      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
        "
      >
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`
              flex
              gap-4
              rounded-xl
              p-4
              ${alert.cardStyle}
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
                ${alert.iconStyle}
              `}
            >
              <AlertCircle size={20} />
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
                {alert.message}
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-white/40
                "
              >
                {alert.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
