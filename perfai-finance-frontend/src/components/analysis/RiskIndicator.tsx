interface RiskIndicatorProps {
  title: string;
  value: string;
  status: "Bon" | "Moyen" | "Critique";
}

const indicatorStyles = {
  Bon: {
    background: "bg-green-500/10",
    text: "text-green-400",
    dot: "bg-green-500",
  },

  Moyen: {
    background: "bg-yellow-400/10",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },

  Critique: {
    background: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-500",
  },
};

export default function RiskIndicator({
  title,
  value,
  status,
}: RiskIndicatorProps) {
  const style = indicatorStyles[status];

  return (
    <div
      className="
          flex
          items-center
          justify-between
          rounded-xl
          border
          border-white/10
          bg-white/3
          p-4
        "
    >
      {/* Information */}
      <div>
        <p
          className="
              text-sm
              font-medium
              text-white
            "
        >
          {title}
        </p>

        <p
          className="
              mt-1
              text-xs
              text-white/50
            "
        >
          {value}
        </p>
      </div>

      {/* Status */}
      <div
        className={`
            flex
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
    </div>
  );
}
