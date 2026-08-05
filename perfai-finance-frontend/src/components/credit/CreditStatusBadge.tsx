interface CreditStatusBadgeProps {
  status: "Approuvé" | "En attente" | "Rejeté" | "En analyse";
}

const statusStyles = {
  Approuvé: {
    dot: "bg-green-500",
    background: "bg-green-500/10",
    text: "text-green-400",
  },

  "En attente": {
    dot: "bg-yellow-400",
    background: "bg-yellow-400/10",
    text: "text-yellow-300",
  },

  Rejeté: {
    dot: "bg-red-500",
    background: "bg-red-500/10",
    text: "text-red-400",
  },

  "En analyse": {
    dot: "bg-[#0B63C7]",
    background: "bg-[#0B63C7]/10",
    text: "text-[#4A9FFF]",
  },
};

export default function CreditStatusBadge({ status }: CreditStatusBadgeProps) {
  const style = statusStyles[status];

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

      {status}
    </div>
  );
}
