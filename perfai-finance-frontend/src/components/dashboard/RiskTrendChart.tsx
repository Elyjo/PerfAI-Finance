"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const riskData = [
  {
    month: "Jan",
    real: 28,
    target: 30,
  },
  {
    month: "Fév",
    real: 24,
    target: 28,
  },
  {
    month: "Mar",
    real: 20,
    target: 25,
  },
  {
    month: "Avr",
    real: 18,
    target: 22,
  },
  {
    month: "Mai",
    real: 15,
    target: 20,
  },
];

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    dataKey?: string;
    value?: number;
  }[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const riskValue = payload.find((item) => item.dataKey === "real")?.value;

  const targetValue = payload.find((item) => item.dataKey === "target")?.value;

  return (
    <div
      className="
        rounded-xl
        border
        border-white/10
        bg-[#020617]
        px-4
        py-3
        shadow-xl
      "
    >
      <p
        className="
          mb-2
          text-sm
          font-semibold
          text-white
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          text-[#0B63C7]
        "
      >
        Risque observé : {riskValue}%
      </p>

      <p
        className="
          text-sm
          text-white/60
        "
      >
        Seuil cible : {targetValue}%
      </p>
    </div>
  );
}

export default function RiskTrendChart() {
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
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          Évolution du risque
        </h3>

        <span
          className="
            text-xs
            text-white/40
          "
        >
          5 derniers mois
        </span>
      </div>

      {/* Legend */}
      <div
        className="
          mt-6
          flex
          gap-6
          text-sm
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-[#0B63C7]
            "
          />

          <span className="text-white/70">Risque réel</span>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-white/40
            "
          />

          <span className="text-white/70">Seuil cible</span>
        </div>
      </div>

      {/* Chart */}
      <div
        className="
          mt-8
          h-72
        "
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={riskData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.3)"
              tickLine={false}
              axisLine={false}
              padding={{
                left: 15,
                right: 15,
              }}
              tick={{
                dy: 10,
              }}
            />

            <YAxis
              domain={[0, 40]}
              stroke="rgba(255,255,255,0.3)"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="real"
              stroke="#0B63C7"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="target"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
