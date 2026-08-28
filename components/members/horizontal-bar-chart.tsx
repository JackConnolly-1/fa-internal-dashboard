'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const DEFAULT_PALETTE = ['#0C2140', '#BB8956', '#1d4a88', '#c99970', '#4f7fbf', '#9a6425']

/* eslint-disable @typescript-eslint/no-explicit-any */
export function HorizontalBarChart({
  data,
  format = 'number',
  heightClass = 'h-64',
}: {
  data: { name: string; value: number; color?: string }[]
  format?: 'currency' | 'count' | 'number'
  heightClass?: string
}) {
  if (!data.length) {
    return (
      <div className={`${heightClass} flex items-center justify-center text-navy-700 text-sm`}>
        No data.
      </div>
    )
  }
  const fmt = (v: number) =>
    format === 'currency'
      ? formatCurrency(v)
      : format === 'count'
      ? `${v} ${v === 1 ? 'company' : 'companies'}`
      : String(v)

  return (
    <div className={heightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 6, right: 56, left: 4, bottom: 6 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={82}
            tick={{ fontSize: 12, fill: '#163769' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(12,33,64,0.04)' }}
            formatter={(value: any) => [fmt(Number(value)), '']}
            contentStyle={{ border: '1px solid #d9e6f3', borderRadius: '10px', fontSize: '12px' }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v: any) => fmt(Number(v))}
              style={{ fontSize: 12, fill: '#163769', fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
