'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Navy/gold design-system shades cycled across segments
const PALETTE = [
  '#0C2140',
  '#BB8956',
  '#1d4a88',
  '#c99970',
  '#4f7fbf',
  '#9a6425',
  '#163769',
  '#e3c4ae',
  '#255da5',
  '#80a5d2',
]

export function SectorDonut({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-navy-700 text-sm">
        No sector data.
      </div>
    )
  }
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${value} ${Number(value) === 1 ? 'company' : 'companies'}`,
              String(name),
            ]}
            contentStyle={{ border: '1px solid #d9e6f3', borderRadius: '10px', fontSize: '12px' }}
          />
          <Legend
            formatter={(value: string) => <span className="text-xs text-navy-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
