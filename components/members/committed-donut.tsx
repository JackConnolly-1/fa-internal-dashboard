'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const fmt = (v: number) => '$' + Math.round(v).toLocaleString('en-US')

/**
 * Donut showing what % of committed fund capital has actually been called/invested.
 * Center displays the committed dollar amount.
 */
export function CommittedDonut({ committed, called }: { committed: number; called: number }) {
  const pct = committed > 0 ? Math.min(100, Math.round((called / committed) * 100)) : 0
  const data =
    committed > 0
      ? [
          { name: 'Called', value: called },
          { name: 'Remaining', value: Math.max(0, committed - called) },
        ]
      : [{ name: 'None', value: 1 }]

  return (
    <div className="relative h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={94}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill="#BB8956" />
            <Cell fill="#d9e6f3" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-serif font-bold text-navy-900">{pct}%</span>
        <span className="text-xs text-navy-700">called</span>
        <span className="mt-2 text-sm font-semibold text-navy-900">{fmt(committed)}</span>
        <span className="text-xs text-navy-700">committed</span>
      </div>
    </div>
  )
}
