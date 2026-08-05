const activities = [
  {
    title: "Nouvelle demande de crédit reçue de Fatou Ndiaye",
    time: "Il y a 10 min",
    color: "bg-[#0B63C7]",
  },
  {
    title: "Demande de crédit validée après analyse IA",
    time: "Il y a 1h",
    color: "bg-green-400",
  },
  {
    title: "Risque élevé détecté sur une demande",
    time: "Il y a 3h",
    color: "bg-yellow-400",
  },
];

export default function RecentCreditActivityCard() {
  return (
    <div
      className="
          h-fit
          rounded-2xl
          border
          border-white/10
          bg-white/3
          p-6
          backdrop-blur-xl
          shadow-lg
          shadow-[#0B63C7]/10
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
        Activité récente
      </h3>

      {/* Activities */}
      <div
        className="
            mt-6
            flex
            flex-col
            gap-5
          "
      >
        {activities.map((activity, index) => (
          <div
            key={index}
            className="
                flex
                items-start
                gap-4
              "
          >
            {/* Indicator */}
            <div
              className={`
                  mt-1
                  h-3
                  w-3
                  shrink-0
                  rounded-full
                  ${activity.color}
                `}
            />

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
                {activity.title}
              </p>

              <p
                className="
                    mt-1
                    text-xs
                    text-white/50
                  "
              >
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
