interface ClientRiskBadgeProps {
  risk: "Élevé" | "Moyen" | "Faible";
}

const riskStyles = {
  Élevé: {
    background: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-500",
  },

  Moyen: {
    background: "bg-yellow-400/10",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
  },

  Faible: {
    background: "bg-green-500/10",
    text: "text-green-400",
    dot: "bg-green-500",
  },
};

export default function ClientRiskBadge({ risk }: ClientRiskBadgeProps) {
  const style = riskStyles[risk];

  return (
    <div
      className={`
          inline-flex
          items-center
          gap-2
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          ${style.background}
          ${style.text}
        `}
    >
      <span
        className={`
            h-2
            w-2
            rounded-full
            ${style.dot}
          `}
      />

      {risk}
    </div>
  );
}
