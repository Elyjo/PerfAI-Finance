"use client";

import { useCallback, useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAllRiskAnalyses } from '@/services/riskService'
import { getRequestErrorMessage } from '@/utils/formatters'
import RequestError from '@/components/shared/RequestError'

type RiskPoint = { month: string; real: number | null; target: number; analyses: number }

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    dataKey?: string;
    value?: number;
    payload?: RiskPoint;
  }[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const riskValue = payload.find((item) => item.dataKey === "real")?.value;

  const targetValue = payload.find((item) => item.dataKey === "target")?.value;
  const analysesCount = payload.find((item) => item.dataKey === "real")?.payload?.analyses;

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
        Risque moyen : {riskValue ?? '—'}%
      </p>

      <p
        className="
          text-sm
          text-white/60
        "
      >
        Seuil cible : {targetValue}%
      </p>
      {analysesCount !== undefined && <p className="mt-1 text-xs text-white/40">{analysesCount} analyse{analysesCount > 1 ? 's' : ''}</p>}
    </div>
  );
}

export default function RiskTrendChart() {
  const [riskData, setRiskData] = useState<RiskPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadTrend = useCallback(() => {
    setError(null)
    getAllRiskAnalyses()
      .then(analyses => {
        const monthlyRisks = new Map<string, number[]>()
        for (const analysis of analyses) {
          const date = new Date(analysis.created_at)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const values = monthlyRisks.get(key) ?? []
          values.push(100 - analysis.score)
          monthlyRisks.set(key, values)
        }

        const formatter = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' })
        const months = Array.from({ length: 5 }, (_, index) => {
          const date = new Date()
          date.setDate(1)
          date.setMonth(date.getMonth() - (4 - index))
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const values = monthlyRisks.get(key) ?? []
          return {
            month: formatter.format(date),
            real: values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null,
            target: 30,
            analyses: values.length,
          }
        })
        setRiskData(months)
      })
      .catch(error => setError(getRequestErrorMessage(error)))
  }, [])

  useEffect(() => { void Promise.resolve().then(loadTrend) }, [loadTrend])

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

      {error ? <RequestError message={error} onRetry={loadTrend} /> : <>
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

          <span className="text-white/70">Risque moyen observé</span>
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
      </>}

      {/* Chart */}
      <div
        className="
          mt-8
          h-72
        "
      >
        {error ? null : !riskData.some(point => point.analyses > 0) ? (
          <div className="flex h-full items-center justify-center text-sm text-white/40">Aucune analyse enregistrée.</div>
        ) : <ResponsiveContainer width="100%" height="100%">
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
              domain={[0, 100]}
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
        </ResponsiveContainer>}
      </div>
    </div>
  );
}
