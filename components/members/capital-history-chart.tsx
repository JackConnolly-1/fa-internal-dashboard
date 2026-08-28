'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export interface CapitalHistoryPoint {
  month: string
  invested: number
  distributions: number
}

const fmtK = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`

const LABELS: Record<string, string> = {
  invested: 'Capital Invested',
  distributions: 'Distributions',
}

export function CapitalHistoryChart({ data }: { data: CapitalHistoryPoint[] }) {
  if (!data.length) {
    return (
      <div className="h-72 flex items-center justify-center text-navy-700 text-sm">
        No capital history yet.
      </div>
    )
  }
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-invested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0C2140" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0C2140" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-dist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BB8956" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#BB8956" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9e6f3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#163769' }}
            tickLine={false}
            axisLine={{ stroke: '#d9e6f3' }}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={fmtK}
            tick={{ fontSize: 11, fill: '#163769' }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            formatter={(value, name) => [fmtK(Number(value)), LABELS[String(name)] || String(name)]}
            contentStyle={{ border: '1px solid #d9e6f3', borderRadius: '10px', fontSize: '12px' }}
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-navy-700">{LABELS[value] || value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="invested"
            stroke="#0C2140"
            strokeWidth={2}
            fill="url(#grad-invested)"
          />
          <Area
            type="monotone"
            dataKey="distributions"
            stroke="#BB8956"
            strokeWidth={2}
            fill="url(#grad-dist)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
