interface RiskScoreProps {
  score: number;
  level: "Faible" | "Moyen" | "Élevé";
}

const riskStyles = {
  Faible: {
    color: "text-green-400",
    background: "bg-green-500/10",
    progress: "bg-green-500",
  },

  Moyen: {
    color: "text-yellow-400",
    background: "bg-yellow-400/10",
    progress: "bg-yellow-400",
  },

  Élevé: {
    color: "text-red-400",
    background: "bg-red-500/10",
    progress: "bg-red-500",
  },
};

export default function RiskScore({ score, level }: RiskScoreProps) {
  const style = riskStyles[level];

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
      <h3
        className="
            text-lg
            font-semibold
            text-white
          "
      >
        Score de risque
      </h3>

      <div
        className="
            mt-6
            flex
            items-center
            justify-between
          "
      >
        <div>
          <p
            className="
                text-4xl
                font-bold
                text-white
              "
          >
            {score}
            <span className="text-xl text-white/40">/100</span>
          </p>

          <div
            className={`
                mt-3
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${style.background}
                ${style.color}
              `}
          >
            Risque {level}
          </div>
        </div>

        <div
          className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              border-8
              border-white/10
            "
        >
          <span
            className={`
                text-xl
                font-bold
                ${style.color}
              `}
          >
            {score}%
          </span>
        </div>
      </div>

      <div
        className="
            mt-6
            h-2
            overflow-hidden
            rounded-full
            bg-white/10
          "
      >
        <div
          className={`
              h-full
              rounded-full
              ${style.progress}
            `}
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}
