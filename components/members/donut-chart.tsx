'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

const DEFAULT_PALETTE = [
  '#0C2140',
  '#BB8956',
  '#1d4a88',
  '#c99970',
  '#4f7fbf',
  '#9a6425',
  '#163769',
  '#e3c4ae',
]

/* eslint-disable @typescript-eslint/no-explicit-any */
export function DonutChart({
  data,
  format = 'number',
}: {
  data: { name: string; value: number; color?: string }[]
  format?: 'currency' | 'count' | 'number'
}) {
  const shown = data.filter((d) => d.value > 0)
  if (!shown.length) {
    return (
      <div className="h-64 flex items-center justify-center text-navy-700 text-sm">No data.</div>
    )
  }
  const fmtValue = (v: number) =>
    format === 'currency'
      ? formatCurrency(v)
      : format === 'count'
      ? `${v} ${v === 1 ? 'company' : 'companies'}`
      : String(v)
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={shown}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="none"
          >
            {shown.map((d, i) => (
              <Cell key={i} fill={d.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => [fmtValue(Number(value)), String(name)]}
            contentStyle={{ border: '1px solid #d9e6f3', borderRadius: '10px', fontSize: '12px' }}
          />
          <Legend formatter={(v: string) => <span className="text-xs text-navy-700">{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
